const jwt = require("jsonwebtoken")
const {InvalidLoginError, UnauthorisedError, ForbiddenError} = require("../errors/classes");

exports.generateJWT = (user, service) => {
    const payload = {
        user_id: user.slug,
        service: service,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // Expires in 1 day
        iat: Math.floor(Date.now() / 1000), // Issued at time
    };

    return jwt.sign(payload, process.env.JWT_KEY, {algorithm: 'HS256'});
}

exports.authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    try {
        if (!token) {
            throw new UnauthorisedError("No JWT provided")
        }

        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err) {
                throw new ForbiddenError("Invalid JWT provided")
            }

            req.user = user;
            next();
        });
    } catch (error) {
        next(error)
    }
}