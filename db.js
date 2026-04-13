var mysql = require('mysql2');

var db = mysql.createConnection({
  host: '34.69.124.135',
  user: 'aamiraccount',
  password: 'Aamir123#',
  database: 'loan_match_db'
});

db.connect(function(err) {
  if (err) {
    console.error('db connection failed:', err.message);
    process.exit(1);
  }
  console.log('connected to mysql');
});

module.exports = db;
