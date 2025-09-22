import z from "zod";

const ServiceName = {
    ftp: "ftp",
    income_calculator: "income_calculator",
} as const;

export const LoginPostData = z.object({
    emailOrUsername: z.string().or(z.email()),
    password: z.string(),
    serviceName: z.enum(ServiceName),
});

export const LoginResponse = z.object({
    jwt: z.jwt(),
});

export const SignUpPostData = z.object({
    email: z.email(),
    username: z.string(),
    password: z.string(),
    serviceName: z.enum(ServiceName),
});

export const SignUpResponse = z.object({
    msg: z.literal("OK"),
});
