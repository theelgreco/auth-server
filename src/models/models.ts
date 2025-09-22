import { prisma } from "../db/connect.ts";
import { z } from "zod";

export const getService = async (serviceName: string) => {
    try {
        return await prisma.service.findFirstOrThrow({ where: { serviceName } });
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await prisma.$disconnect();
    }
};

export const createNewUser = async (data: { email: string; username: string; password: string; service: string }) => {
    try {
        await prisma.user.create({ data });
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await prisma.$disconnect();
    }
};

export const getUser = async (data: { emailOrUsername: string; serviceName: string }) => {
    const user: {
        email?: string;
        username?: string;
        serviceName: string;
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
        } else {
            throw new Error("No user found!");
        }
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        await prisma.$disconnect();
    }
};
