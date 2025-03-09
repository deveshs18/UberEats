require('dotenv').config();
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convert pool to use promises
const promisePool = pool.promise();

// Test the connection
const getConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('Database connection pool initialized');
        connection.release();
        return connection;
    } catch (err) {
        console.error('Error initializing database pool:', err);
        throw err;
    }
};

// Export the promise pool and connection function
module.exports = {
    pool: promisePool,
    getConnection
};
