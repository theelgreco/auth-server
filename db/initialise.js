const {db} = require("./connect")
const crypto = require("crypto")

const createTables = async () => {
    // Drop the tables
    if(process.env.NODE_ENV !== "production") {
        try {
            await db.query(`
                DROP TABLE IF EXISTS users;
            `)
            console.log("DROPPED TABLE users")
        } catch (err){
            console.error(err)
        }

        try {
            await db.query(`
                DROP TABLE IF EXISTS services;
            `)
            console.log("DROPPED TABLE services")
        } catch (err){
            console.error(err)
        }
    }

    // Create services table if it does not exist
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS services (
                slug VARCHAR(36) PRIMARY KEY,
                service_name VARCHAR(50) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );`
        )
    } catch (err){
        console.error(err)
    }

    // Create users table if it does not exist
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                slug VARCHAR(36) PRIMARY KEY,
                email VARCHAR(200) NOT NULL,
                username VARCHAR(32),
                password VARCHAR(200) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                service_slug VARCHAR(36),
                CONSTRAINT fk_service_slug
                    FOREIGN KEY(service_slug)
                    REFERENCES services(slug)
                    ON DELETE CASCADE,
                CONSTRAINT unique_email_service
                    UNIQUE (email, service_slug),
                CONSTRAINT unique_username_service
                    UNIQUE (username, service_slug),
                CONSTRAINT unique_email_and_username_service
                    UNIQUE (username, email, service_slug)
            );`
        )
    } catch (err){
        console.error(err)
    }

    // Seed services table if it is empty
    try {
        const servicesCount = (await db.query(`SELECT COUNT(*) FROM services;`)).rows[0].count;

        if(!parseInt(servicesCount)){
            await db.query(`
                INSERT INTO services (slug, service_name)
                VALUES ($1, 'ftp');
            `, [crypto.randomUUID()])
            console.log("SEEDED services table")
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = createTables