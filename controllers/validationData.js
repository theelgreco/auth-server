const emailValidator = require("email-validator");

exports.validAuthSignUpData = {
    email: {
        type: String,
        required: true,
        comparator(value) {
            return emailValidator.validate(value)
        }
    },
    username: {
        type: String,
        required: false,
        default: null
    },
    password: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    }
}

exports.validAuthLoginData = {
    email_or_username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    service: {
        type: String,
        required: true
    }
}