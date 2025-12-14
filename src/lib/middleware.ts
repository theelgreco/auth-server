import { NextFunction, Response, Request } from "express";

import { RequestValidationError } from "@ts-rest/express";
import { ErrorNameEnum, ForbiddenError, UnauthorisedError } from "../../contracts/src/errors.ts";
import {
    PrismaClientInitializationError,
    PrismaClientKnownRequestError,
    PrismaClientRustPanicError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
} from "../generated/prisma/internal/prismaNamespace.ts";

type WithOptionalCode<T> = T & { code?: string };

type ErrorMiddlewareFunction<T> = (error: T, request: Request, response: Response, next: NextFunction) => void;

export const errorLogger: ErrorMiddlewareFunction<Error> = (error, _request, _response, next) => {
    console.error(error);
    next(error);
};

export const handleZodValidationErrors: ErrorMiddlewareFunction<RequestValidationError> = (error, _request, response, next) => {
    if (error.body) {
        const { issues } = error.body;
        response.status(400).json({ name: ErrorNameEnum.ValidationError, issues });
    } else {
        next(error);
    }
};

type PrismaError =
    | WithOptionalCode<PrismaClientKnownRequestError>
    | WithOptionalCode<PrismaClientUnknownRequestError>
    | WithOptionalCode<PrismaClientRustPanicError>
    | WithOptionalCode<PrismaClientInitializationError>
    | WithOptionalCode<PrismaClientValidationError>;

export const handlePrismaErrors: ErrorMiddlewareFunction<PrismaError> = (error, _request, response, next) => {
    if (error instanceof PrismaClientKnownRequestError) {
        const { code } = error;

        switch (code) {
            case "P2025":
                response.status(404).send({
                    name: ErrorNameEnum.PrismaClientKnownRequestError,
                    message: `No ${(error.meta?.modelName as string).toLowerCase()} matching those details`,
                });
                break;
            case "P2002":
                response.status(400).send({
                    name: ErrorNameEnum.PrismaClientKnownRequestError,
                    message: `This ${(error.meta?.modelName as string).toLowerCase()} already exists`,
                });
                break;
        }
    } else {
        next(error);
    }
};

type CustomError = ForbiddenError | UnauthorisedError;

export const handleCustomErrors: ErrorMiddlewareFunction<CustomError> = (error, _request, response, next) => {
    if (error instanceof UnauthorisedError) {
        response.status(401).send({
            name: ErrorNameEnum.UnauthorisedError,
            message: error?.message || "The request could not be authorised",
        });
    } else {
        next(error);
    }
};

export const handle500Errors = (_error: Error, _request: Request, response: Response) => {
    response.status(500).send({ name: ErrorNameEnum.InternalServerError, message: "Internal server error" });
};
