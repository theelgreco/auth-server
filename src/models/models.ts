import { prisma } from "../db/connect.ts";
import { z } from "zod";
import { ServiceName } from "../generated/prisma/enums.ts";
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace.ts";
import { RequestValidationError } from "@ts-rest/express";
import { EmailTaken, UsernameTaken } from "../../contracts/src/errors.ts";

export const getService = async (serviceName: ServiceName) => {
    try {
        return await prisma.service.findFirstOrThrow({ where: { serviceName } });
    } catch (err) {
        throw err;
    } finally {
        await prisma.$disconnect();
    }
};

export const createNewUser = async ({
    email,
    username,
    password,
    serviceName,
    image,
    isGuest = false,
}: {
    email: string;
    username: string;
    password: string;
    serviceName: ServiceName;
    isGuest?: boolean;
    image?: string;
}) => {
    try {
        const serviceSlug = (await getService(serviceName)).slug;
        return await prisma.user.create({ data: { email, username, password, serviceSlug, image, isGuest } });
    } catch (err) {
        if (err instanceof PrismaClientKnownRequestError) {
            const target = err?.meta?.target as string[] | undefined;

            if (target?.includes("email")) {
                throw new RequestValidationError(null, null, null, EmailTaken);
            }

            if (target?.includes("username")) {
                throw new RequestValidationError(null, null, null, UsernameTaken);
            }
        }

        throw err;
    } finally {
        await prisma.$disconnect();
    }
};

export const getUser = async (data: { emailOrUsername: string; serviceName: ServiceName }) => {
    const user: {
        email?: string;
        username?: string;
        serviceName: ServiceName;
    } = {
        email: undefined,
        username: undefined,
        serviceName: data.serviceName,
    };

    try {
        user.email = z.email().parse(data.emailOrUsername);
    } catch {
        user.username = data.emailOrUsername;
    }

    try {
        const serviceSlug = (await getService(user.serviceName)).slug;

        if (user.email) {
            return await prisma.user.findUniqueOrThrow({ where: { email_serviceSlug: { email: user.email, serviceSlug } } });
        } else if (user.username) {
            return await prisma.user.findUniqueOrThrow({ where: { username_serviceSlug: { username: user.username, serviceSlug } } });
        }

        // If we get here then no user was found so throw an error
        throw new Error("No user found!");
    } catch (err) {
        throw err;
    } finally {
        await prisma.$disconnect();
    }
};
