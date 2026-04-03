require('dotenv').config();

const DB_CONFIG = {
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/swaynix',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
};

module.exports = { DB_CONFIG };
