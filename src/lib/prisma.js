import { PrismaClient } from "@prisma/client";

// A single PrismaClient instance for the whole app.
const prisma = new PrismaClient();
export default prisma;
