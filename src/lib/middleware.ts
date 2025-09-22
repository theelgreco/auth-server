import type { NextFunction, Response, Request } from "express";

type ErrorMiddlewareFunction = (error: Error & { code: number | string }, request: Request, response: Response, next: NextFunction) => void;

export const handleCustomErrors: ErrorMiddlewareFunction = (error, _request, response, next) => {
    const { message, code, name } = error;

    console.log(`${code} | ${name} | ${message}`);

    if (name === "ValidationError" || name === "KeyError") {
        response.status(400).send({ [name]: message });
    } else if (name === "InvalidLoginError" || "UnauthorisedError") {
        response.status(401).send({ [name]: message });
    } else if (name === "ForbiddenError") {
        response.status(403).send({ [name]: message });
    } else {
        next(error);
    }
};

export const handlePostgresErrors: ErrorMiddlewareFunction = (_error, _request, _response, next) => {
    next();
};

export const handle500Errors = (_request: Request, response: Response) => {
    response.status(500).send({ msg: "Internal server error" });
};
