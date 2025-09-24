import z from "zod";
import { contract } from "./init.ts";

// All possible error names must come from this enum first. This is the single source of truth.
export const enum ErrorNameEnum {
    ValidationError = "ValidationError",
    PrismaClientKnownRequestError = "PrismaClientKnownRequestError",
    InternalServerError = "InternalServerError",
    InvalidLoginError = "InvalidLoginError",
    UnauthorisedError = "UnauthorisedError",
    ForbiddenError = "ForbiddenError",
}

// Below are the built-in/library errors.

const validationError = contract.type<{
    name: ErrorNameEnum.ValidationError;
    issues: z.core.$ZodIssue[];
}>();

const prismaClientKnownRequestError = contract.type<{
    name: ErrorNameEnum.PrismaClientKnownRequestError;
    message: string;
}>();

// Below are the custom errors. These are errors we define and throw.

export class InvalidLoginError extends Error {
    constructor(message: string) {
        super(message);
        this.name = ErrorNameEnum.InvalidLoginError;
    }
}

export class UnauthorisedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = ErrorNameEnum.UnauthorisedError;
    }
}

export class ForbiddenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = ErrorNameEnum.ForbiddenError;
    }
}

const internalServerError = contract.type<{
    name: ErrorNameEnum.InternalServerError;
    message: string;
}>();

const invalidLoginError = contract.type<{
    name: ErrorNameEnum.InvalidLoginError;
    message: string;
}>();

const unauthorisedError = contract.type<{
    name: ErrorNameEnum.UnauthorisedError;
    message: string;
}>();

const forbiddenError = contract.type<{
    name: ErrorNameEnum.ForbiddenError;
    message: string;
}>();

export const commonErrorType = contract.type<
    | typeof validationError
    | typeof prismaClientKnownRequestError
    | typeof internalServerError
    | typeof invalidLoginError
    | typeof unauthorisedError
    | typeof forbiddenError
>();

// Custom ZodErrors. Useful for throwing custom ts-rest RequestValidationErrors

export const EmailTaken = new z.ZodError([
    {
        code: "custom",
        path: ["email"],
        message: "Email is already taken",
    },
]);

export const UsernameTaken = new z.ZodError([
    {
        code: "custom",
        path: ["username"],
        message: "Username is already taken",
    },
]);

export const WrongPassword = new z.ZodError([
    {
        code: "custom",
        path: ["password"],
        message: "Wrong password",
    },
]);
