const { execSync } = require('child_process');
const maxRetries = 5;
let retries = 0;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function migrate() {
  while (retries < maxRetries) {
    try {
      console.log('Attempting database migration...');
      execSync('DATABASE_URL=$DIRECT_URL npx prisma migrate reset --force', { stdio: 'inherit' });
      console.log('Migration successful!');
      process.exit(0);
    } catch (error) {
      retries++;
      if (retries === maxRetries) {
        console.error('Migration failed after', maxRetries, 'attempts');
        process.exit(1);
      }
      console.log('Migration attempt failed, retrying in 10 seconds...');
      await delay(10000);
    }
  }
}

migrate();