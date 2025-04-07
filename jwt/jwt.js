const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.generateJWT = (user, service) => {
    const payload = {
        user_id: user.slug,
        name: user.username,
        email: user.email,
        service: service,
        session_id: crypto.randomUUID(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * (24 * 30), // Expires in 30 day
        iat: Math.floor(Date.now() / 1000), // Issued at time
    };

    return jwt.sign(payload, process.env.JWT_KEY, { algorithm: "HS256" });
};
