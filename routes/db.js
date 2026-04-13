const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: '34.69.124.135',
    user: 'aamiraccount',
    password: 'Aamir123#',
    database: 'loan_match_db'
});

db.connect(err => {
  if (err) {
    console.error('db connect failed:', err);
    return;
  }
  console.log('db connected');
});

module.exports = db;