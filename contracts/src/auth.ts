import z from "zod";
import { initContract } from "@ts-rest/core";

const contract = initContract();

const LoginPostData = z.object({
    emailOrUsername: z.string().or(z.email()),
    password: z.string(),
    service: z.string(),
});

const LoginResponse = z.object({
    msg: z.literal("OK"),
});

export const authContract = contract.router({
    postLogin: {
        method: "POST",
        path: "/login",
        summary: "Login",
        body: LoginPostData,
        responses: {
            200: LoginResponse,
        },
    },
});
