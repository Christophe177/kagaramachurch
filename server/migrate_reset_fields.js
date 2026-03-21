import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: 'd:/kagarama/server/.env' });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function migrate() {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL for migration...');
    try {
        await connection.query(`
            ALTER TABLE users 
            ADD COLUMN reset_token VARCHAR(255) NULL, 
            ADD COLUMN reset_expires DATETIME NULL;
        `);
        console.log('Users table updated successfully.');
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Reset columns already exist, skipping migration steps.');
        } else {
            console.error('Migration error:', err);
        }
    } finally {
        await connection.end();
    }
}

migrate();
