
import { db } from './config/db.js';

async function check() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM photo_of_day');
        console.log('Columns in photo_of_day:', columns.map(c => c.Field));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
