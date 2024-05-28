const {db} = require("../db/connect")
const format = require("pg-format")
const {ValidationError, InvalidLoginError} = require("../errors/classes");

const getService = async (service) => {
    const service_rows = await db.query(`
        SELECT *
        FROM services
        WHERE service_name = $1;
    `, [service])

    if (!service_rows.rows.length) {
        throw new ValidationError(`Service '${service}' does not exist.`);
    }

    return service_rows.rows[0]
}

exports.createNewUser = async (slug, email, username, password, service) => {
    try {
        const service_slug = (await getService(service)).slug

        if (email) {
            const queryString = format(`
                INSERT INTO users (slug, email, username, password, service_slug)
                VALUES (%L);
            `, [slug, email, username, password, service_slug])

            await db.query(queryString)
        } else {
            const queryString = format(`
                INSERT INTO users (slug, username, password, service_name, service_slug)
                VALUES (%L);
            `, [slug, username, password, service, service_slug])

            await db.query(queryString)
        }
    } catch (error) {
        throw error
    }
}

exports.getUser = async (email, username, service) => {
    try {
        const service_slug = (await getService(service)).slug
        let user

        if (email && username) {
            const userQuery = await db.query(`
                SELECT *
                FROM users
                WHERE email = $1
                  AND username = $2
                  AND service_slug = $3;
            `, [email, username, service_slug])
            user = userQuery.rows[0]
        } else if (email) {
            const userQuery = await db.query(`
                SELECT *
                FROM users
                WHERE email = $1
                  AND service_slug = $2;
            `, [email, service_slug])
            user = userQuery.rows[0]
        } else {
            const userQuery = await db.query(`
                SELECT *
                FROM users
                WHERE username = $1
                  AND service_slug = $2;
            `, [username, service_slug])
            user = userQuery.rows[0]
        }

        if (!user) {
            throw new InvalidLoginError("User does not exist")
        }

        return user
    } catch (error) {
        throw error
    }
}