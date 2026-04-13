require('dotenv').config();
var mysql = require('mysql2');

var db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(function(err) {
  if (err) {
    console.error('db connection failed:', err.message);
    process.exit(1);
  }
  console.log('connected to mysql');
});

module.exports = db;
