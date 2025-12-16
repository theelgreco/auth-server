import jwt from "jsonwebtoken";
import process from "node:process";
import { User } from "../generated/prisma/client.ts";

export const generateJWT = ({ user, serviceName }: { user: User; serviceName: string }) => {
    const payload = {
        userId: user.slug,
        name: user.username,
        email: user.email,
        image: user.image,
        service: serviceName,
        isGuest: user.isGuest,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * (24 * 30), // Expires in 30 day
        iat: Math.floor(Date.now() / 1000), // Issued at time
    };

    return jwt.sign(payload, process.env.JWT_KEY, { algorithm: "HS256" });
};
