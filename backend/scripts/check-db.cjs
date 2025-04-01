const { Pool } = require('pg');
const { DIRECT_URL } = process.env;

async function checkDbConnection() {
  try {
    const pool = new Pool({
      connectionString: DIRECT_URL,
    });

    const client = await pool.connect();
    const result = await client.query('SELECT 1');
    console.log('Database connection successful!');
    client.release();
    await pool.end();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

checkDbConnection();