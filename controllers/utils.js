const bcrypt = require("bcrypt")
const {InvalidLoginError} = require("../errors/classes");

exports.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

/**
 * Compares a plain password to a hashed password. Throwing an error if they don't match.
 * @param {string} providedPassword - The user-provided plain password.
 * @param {string} storedPassword - The hashed password from the database.
 * @throws InvalidLoginError - If the passwords don't match.
 * @returns void
 */
exports.checkPassword = async (providedPassword, storedPassword) => {
    const result = await bcrypt.compare(providedPassword, storedPassword)

    if (!result) {
        throw new InvalidLoginError("Incorrect password")
    }

    return result
}