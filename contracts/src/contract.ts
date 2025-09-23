import { initContract } from "@ts-rest/core";
import { GoogleSignInData, LoginPostData, LoginResponse, SignUpPostData, SignUpResponse } from "./validation.ts";

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
        summary: "Sign up",
        body: SignUpPostData,
        responses: {
            200: SignUpResponse,
        },
    },
    postGoogleSignIn: {
        method: "POST",
        path: "/google-sign-in",
        summary: "Sign in with Google",
        body: GoogleSignInData,
        responses: {
            200: LoginResponse,
        },
    },
});
