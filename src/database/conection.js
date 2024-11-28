import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    authPlugins: {
        mysql_native_password: () => () => require('mysql/lib/protocol/Auth').auth('mysql_native_password')
    }
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected');
    }
});

export default db;
