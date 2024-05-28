const emailValidator = require("email-validator");

exports.validAuthData = {
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