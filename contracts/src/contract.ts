import { initContract } from "@ts-rest/core";
import { LoginPostData, LoginResponse } from "./validation.ts";

const contract = initContract();

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
    postSignUp: {
        method: "POST",
        path: "/sign-up",
        summary: "Sign Up",
        body: LoginPostData,
        responses: {
            200: LoginResponse,
        },
    },
});
