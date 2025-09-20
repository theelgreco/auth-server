import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const contract = initContract();

export const LoginPostData = z.object({
    email_or_username: z.string().or(z.email()),
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

export type LoginPostDataType = z.infer<(typeof authContract)["postLogin"]["body"]>;
