
import { db } from './config/db.js';

async function check() {
    try {
        const [columns] = await db.query('SHOW COLUMNS FROM photo_of_day');
        const fields = columns.map(c => c.Field);
        process.stdout.write(JSON.stringify(fields));
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
check();
