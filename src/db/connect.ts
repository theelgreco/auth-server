import { Pool } from "pg";
import process from "node:process";
import { PrismaClient } from "../generated/prisma/client.ts";

export const db = new Pool({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient();
