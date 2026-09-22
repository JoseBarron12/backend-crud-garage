const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../generated/prisma/client.js");

process.loadEnvFile();

const connectionString = process.env.NODE_ENV === 'test'
? `${process.env.TEST_DATABASE_URL}` : `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({connectionString});
const prisma = new PrismaClient({adapter});

module.exports = prisma;