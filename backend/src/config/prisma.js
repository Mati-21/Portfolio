const { PrismaClient } = require("@prisma/client");

// Reuse a single PrismaClient instance to avoid connection pool exhaustion
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

module.exports = prisma;
