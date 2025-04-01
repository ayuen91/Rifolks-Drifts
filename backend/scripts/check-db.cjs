const { PrismaClient } = require('@prisma/client');
const { DATABASE_URL } = process.env;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function checkDbConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Database connection successful!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkDbConnection();