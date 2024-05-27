const jwt = require("jsonwebtoken")

exports.generateJWT = (user, service) => {
    const payload = {
        user_id: user.slug,
        service: service,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // Expires in 1 day
        iat: Math.floor(Date.now() / 1000), // Issued at time
    };

    return jwt.sign(payload, process.env.JWT_KEY, {algorithm: 'HS256'});
}