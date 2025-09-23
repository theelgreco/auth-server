import z from "zod";

const ServiceNameChoices = { ftp: "ftp", income_calculator: "income_calculator" } as const;
const serviceName = z.enum(ServiceNameChoices, "That's not a valid service");

const PASSWORD_MIN_LENGTH = 8;
const password = z.string().min(PASSWORD_MIN_LENGTH, "Must be at least 8 characters");

export const LoginPostData = z.object({
    emailOrUsername: z.string().or(z.email()),
    password,
    serviceName,
});

export const LoginResponse = z.object({
    jwt: z.jwt(),
});

export const SignUpPostData = z.object({
    email: z.email(),
    username: z.string(),
    password,
    serviceName,
});

export const SignUpResponse = z.object({
    msg: z.literal("OK"),
});
