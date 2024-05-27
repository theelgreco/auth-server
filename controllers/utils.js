const bcrypt = require("bcrypt")
const {InvalidLoginError} = require("../errors/classes");

exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

exports.checkPassword = async (providedPassword, storedPassword) => {
    const result = await bcrypt.compare(providedPassword, storedPassword)

    if (!result) {
        throw new InvalidLoginError("Incorrect password")
    }

    return result
}