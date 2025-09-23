import { NextFunction, Response, Request } from "express";

type ErrorMiddlewareFunction = (error: Error & { code: number | string }, request: Request, response: Response, next: NextFunction) => void;

export const errorLogger: ErrorMiddlewareFunction = (error, _request, _response, next) => {
    const { message, code, name } = error;
    console.error(error);
    console.error(`${code} | ${name} | ${message}`);

    next(error);
};

export const handleCustomErrors: ErrorMiddlewareFunction = (error, _request, response, next) => {
    const { message, name } = error;

    if (name === "ValidationError") {
        response.status(400).send({ [name]: message });
    } else if (name === "InvalidLoginError" || name === "UnauthorisedError") {
        response.status(401).send({ [name]: message });
    } else if (name === "ForbiddenError") {
        response.status(403).send({ [name]: message });
    } else {
        next(error);
    }
};

export const handlePostgresErrors: ErrorMiddlewareFunction = (error, _request, response, next) => {
    const { code } = error;

    if (code === "P2025") {
        response.status(404).send({ message: "No record found" });
    } else if (code === "P2002") {
        response.status(400).send({ message: "This record already exists" });
    } else {
        next();
    }
};

export const handle500Errors = (_request: Request, response: Response) => {
    response.status(500).send({ msg: "Internal server error" });
};
