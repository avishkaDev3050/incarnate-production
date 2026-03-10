import mysql from 'mysql2/promise';

// Use environment variables for production
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'incarnate_user',
  password: process.env.DB_PASSWORD || '1ncarnat34l1f3',
  database: process.env.DB_NAME || 'incarnet',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
};

export const db = mysql.createPool(dbConfig);