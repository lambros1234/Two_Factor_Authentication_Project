const sqlite3 = require('sqlite3').verbose();

// Connect to a database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to database');
    }
});

// Define the SQL statement to create a table
const createTable = `CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        twofa_secret TEXT,
        twofa_enabled INTEGER DEFAULT 0)`;

// Execute the SQL statement to create the table
db.run(createTable, function (err) {
    if (err) {
        return console.error('Error creating table:', err.message);
    }
    console.log('Table created successfully');
});

module.exports = db;

