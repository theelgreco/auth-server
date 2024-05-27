const crypto = require("crypto")

const {createNewUser, getUser} = require("../models/models");
const {hashPassword, checkPassword} = require("./utils");
const {validateAndClean} = require("./validation");
const {generateJWT} = require("../jwt/jwt");

exports.postSignUp = async (request, response, next) => {
    const validData = {
        email: {
            type: String,
            required: false,
            default: null
        },
        username: {
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

    try {
        let {email, username, password, service} = validateAndClean(validData, request.body)
        password = await hashPassword(password)

        await createNewUser(crypto.randomUUID(), email, username, password, service)

        response.status(200).send({msg: "OK"})
    } catch (error) {
        next(error)
    }
}

exports.postLogin = async (request, response, next) => {
    const validData = {
        email: {
            type: String,
            required: false,
            default: null
        },
        username: {
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

    try {
        let {email, username, password, service} = validateAndClean(validData, request.body)

        const user = await getUser(email, username, service)
        await checkPassword(password, user.password)

        const jwt = generateJWT(user, service)

        response.status(200).send({jwt})
    } catch (error) {
        next(error)
    }
}