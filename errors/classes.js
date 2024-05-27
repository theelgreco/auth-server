exports.ValidationError = class extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

exports.KeyError = class extends Error {
    constructor(message) {
        super(message);
        this.name = "KeyError";
    }
}

exports.UnauthorisedError = class extends Error {
    constructor(message) {
        super(message);
        this.name = "UnauthorisedError";
    }
}

exports.InvalidLoginError = class extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidLoginError";
    }
}

exports.ForbiddenError = class extends Error {
    constructor(message) {
        super(message);
        this.name = "ForbiddenError";
    }
}