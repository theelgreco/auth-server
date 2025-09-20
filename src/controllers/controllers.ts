import crypto from "node:crypto";

import { createExpressEndpoints, initServer } from "@ts-rest/express";

import { createNewUser, getUser } from "../models/models.ts";
import { hashPassword, checkPassword } from "./utils.ts";
import { validateAndClean } from "./validation.ts";
import { generateJWT } from "../jwt/jwt.ts";
import { validAuthSignUpData, validAuthLoginData } from "./validationData.ts";

export const postSignUp = async (request, response, next) => {
    try {
        const { email, username, password, service } = validateAndClean(validAuthSignUpData, request.body);
        const hashed_password = await hashPassword(password);

        await createNewUser(crypto.randomUUID(), email, username, hashed_password, service);

        response.status(200).send({ msg: "OK" });
    } catch (error) {
        next(error);
    }
};

export const postLogin = async (request, response, next) => {
    try {
        const { email_or_username, password, service } = validateAndClean(validAuthLoginData, request.body);

        const user = await getUser(email_or_username, service);
        await checkPassword(password, user.password);

        const jwt = generateJWT(user, service);

        response.status(200).send({ jwt });
    } catch (error) {
        next(error);
    }
};
