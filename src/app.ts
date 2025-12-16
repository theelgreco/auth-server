import process from "node:process";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { handlePrismaErrors, handle500Errors, errorLogger, handleZodValidationErrors, handleCustomErrors } from "./lib/middleware.ts";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { authContract } from "../contracts/src/contract.ts";
import { GoogleSignInData, LoginPostData, SignUpPostData } from "../contracts/src/validation.ts";
import { createNewUser, getUser } from "./models/models.ts";
import { checkPassword, hashPassword } from "./lib/utils.ts";
import { generateJWT } from "./lib/jwt.ts";
import { User } from "./generated/prisma/client.ts";
import { UnauthorisedError } from "../contracts/src/errors.ts";
import { randomUUID } from "node:crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 9091;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = initServer();

const authRouter = server.router(authContract, {
    postLogin: async ({ body }) => {
        const { emailOrUsername, password, serviceName } = LoginPostData.parse(body);

        const user = await getUser({ emailOrUsername, serviceName });
        await checkPassword(password, user.password);
        const jwt = generateJWT({ user, serviceName });

        return {
            status: 200,
            body: { jwt },
        };
    },
    postSignUp: async ({ body }) => {
        const { email, username, password, serviceName } = SignUpPostData.parse(body);

        const hashedPassword = await hashPassword(password);
        await createNewUser({ email, username, password: hashedPassword, serviceName });

        return {
            status: 200,
            body: { msg: "OK" },
        };
    },
    postGoogleSignIn: async ({ body }) => {
        const { token, serviceName } = GoogleSignInData.parse(body);

        const googleResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!googleResponse.ok) {
            throw new UnauthorisedError("Your Google token could not be verified");
        }

        const { email, name, picture } = await googleResponse.json();

        let user: User;

        try {
            user = await getUser({ emailOrUsername: email, serviceName });
        } catch {
            user = await createNewUser({ email, username: name, image: picture, password: "", serviceName });
        }

        const jwt = generateJWT({ user, serviceName });

        return {
            status: 200,
            body: { jwt },
        };
    },
    postSignUpAsGuest: async ({ body }) => {
        const { serviceName } = body;
        const slug = randomUUID();
        const email = `${slug}@fidelio.club`;
        const username = slug;
        const password = await hashPassword("");

        const user = await createNewUser({ email, username, password, serviceName, isGuest: true });

        return {
            status: 200,
            body: { email: user.email },
        };
    },
});

createExpressEndpoints(authContract, authRouter, app, {
    // Just passes on the error to the middleware stack. This is only invoked when the error is thrown by Zod inside the ts-rest router,
    // otherwise the normal middleware flow occurs
    requestValidationErrorHandler: (error, _request, _response, next) => next(error),
});

// error-handling middleware
app.use(errorLogger);
app.use(handleZodValidationErrors);
app.use(handlePrismaErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

// Listener
app.listen(PORT, "0.0.0.0", () => {
    console.log("-------------------------------------");
    console.log(`Server listening on port ${PORT}`);
    console.log(`View here: http://localhost:${PORT}`);
    console.log("-------------------------------------");
});
