import emailValidator from "email-validator";

export const validAuthSignUpData = {
    email: {
        type: String,
        required: true,
        comparator(value: any) {
            return emailValidator.validate(value);
        },
    },
    username: {
        type: String,
        required: false,
        default: null,
    },
    password: {
        type: String,
        required: true,
    },
    service: {
        type: String,
        required: true,
    },
};

export const validAuthLoginData = {
    email_or_username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    service: {
        type: String,
        required: true,
    },
};
