import mysql from 'mysql2/promise';

// Use environment variables for production
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'mAvishka@2002',
  database: process.env.DB_NAME || 'incarnet',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
};

export const db = mysql.createPool(dbConfig);