import("./db/connect.ts");

import process from "node:process";
import dotenv from "dotenv";

// module imports
import express from "express";
import cors from "cors";
import { postSignUp, postLogin } from "./controllers/controllers.ts";
import { handleCustomErrors, handlePostgresErrors, handle500Errors } from "./errors/middleware.ts";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { authContract, contract, LoginPostDataType } from "./contracts/contract.ts";

dotenv.config();

// setup
const app = express();
const PORT = process.env.PORT || 9091;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = initServer();

const authRouter = server.router(authContract, {
    postLogin: async ({ body }) => {
        // You should implement your login logic here, for now return a dummy response
        return {
            status: 200,
            body: {
                msg: "OK",
            },
        };
    },
});

createExpressEndpoints(authContract, authRouter, app);

// endpoints
app.get("/", (req, res) => {
    res.status(200).send({ message: "Welcome!!" });
});

app.post("/sign-up", postSignUp);

// app.post("/login", postLogin);

// error-handling middleware
app.use(handleCustomErrors);
app.use(handlePostgresErrors);
app.use(handle500Errors);

// Listener
app.listen(PORT, "0.0.0.0", () => {
    console.log("-------------------------------------");
    console.log(`Server listening on port ${PORT}`);
    console.log(`View here: http://localhost:${PORT}`);
    console.log("-------------------------------------");
});
