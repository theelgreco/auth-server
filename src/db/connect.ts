import { Pool } from "pg";
import process from "node:process";

export const db = new Pool({ connectionString: process.env.DATABASE_URL });
