require("dotenv").config();
const mysql = require("mysql2");

// Create connection pool for production reliability
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,

  // Connection pool settings
  waitForConnections: true,
  connectionLimit: 10, // Maximum number of connections in pool
  queueLimit: 0, // Unlimited queueing

  // Connection timeout settings
  connectTimeout: 60000, // 60 seconds
  acquireTimeout: 60000, // 60 seconds
  timeout: 60000, // 60 seconds

  // Enable multiple statements (if needed)
  multipleStatements: false,

  // SSL/TLS configuration for production databases
  ssl: process.env.DB_SSL === 'true' ? {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
  } : false,

  // Enable keep-alive to prevent connection drops
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test the connection pool
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL connection pool failed:", err.message);
    console.error("Error code:", err.code);
    console.error("Error errno:", err.errno);

    // Log specific error types
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error("Database connection was closed.");
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error("Database has too many connections.");
    }
    if (err.code === 'ECONNREFUSED') {
      console.error("Database connection was refused.");
    }
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("Database access denied. Check credentials.");
    }
  } else {
    console.log("✅ MySQL connection pool established successfully");
    connection.release(); // Release the test connection back to pool
  }
});

// Handle pool errors
pool.on('error', (err) => {
  console.error("❌ Unexpected error on idle client", err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error("Database connection was lost. Pool will reconnect automatically.");
  } else {
    throw err;
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing MySQL pool');
  pool.end((err) => {
    if (err) {
      console.error('Error closing MySQL pool:', err);
    } else {
      console.log('MySQL pool closed successfully');
    }
    process.exit(err ? 1 : 0);
  });
});

module.exports = pool;
