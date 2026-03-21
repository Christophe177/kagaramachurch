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
            ALTER TABLE photo_of_day 
            ADD COLUMN media_type ENUM('image', 'video') DEFAULT 'image', 
            ADD COLUMN file_path VARCHAR(255) DEFAULT NULL;
        `);
        console.log('Schema updated successfully.');
        await connection.query(`
            UPDATE photo_of_day SET media_type = 'image', file_path = image_url;
        `);
        console.log('Existing data updated.');
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Columns already exist, skipping migration steps.');
        } else {
            console.error('Migration error:', err);
        }
    } finally {
        await connection.end();
    }
}

migrate();
