import z from "zod";

export const LoginPostData = z.object({
    emailOrUsername: z.string().or(z.email()),
    password: z.string(),
    serviceName: z.string(),
});

export const LoginResponse = z.object({
    jwt: z.jwt(),
});

export const SignUpPostData = z.object({
    email: z.email(),
    username: z.string(),
    password: z.string(),
    serviceName: z.string(),
});

export const SignUpResponse = z.object({
    msg: z.literal("OK"),
});
