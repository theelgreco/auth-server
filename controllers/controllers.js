const crypto = require("crypto");

const {createNewUser, getUser} = require("../models/models");
const {hashPassword, checkPassword} = require("./utils");
const {validateAndClean} = require("./validation");
const {generateJWT} = require("../jwt/jwt");
const {validAuthSignUpData, validAuthLoginData} = require("./validationData");

exports.postSignUp = async (request, response, next) => {
    try {
        const {email, username, password, service} = validateAndClean(validAuthSignUpData, request.body);
        const hashed_password = await hashPassword(password);

        await createNewUser(crypto.randomUUID(), email, username, hashed_password, service);

        response.status(200).send({msg: "OK"});
    } catch (error) {
        next(error);
    }
};

exports.postLogin = async (request, response, next) => {
    try {
        const {email_or_username, password, service} = validateAndClean(validAuthLoginData, request.body);

        const user = await getUser(email_or_username, service);
        await checkPassword(password, user.password);

        const jwt = generateJWT(user, service);

        response.status(200).send({jwt});
    } catch (error) {
        next(error);
    }
};
