export const handleCustomErrors = (error, request, response, next) => {
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

export const handlePostgresErrors = (error, request, response, next) => {
    next();
};

export const handle500Errors = (request, response) => {
    response.status(500).send({ msg: "Internal server error" });
};
