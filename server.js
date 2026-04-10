const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection - UPDATE THESE WITH YOUR CLOUD SQL CREDENTIALS
const db = mysql.createConnection({
  host: '34.69.124.135',
    user: 'aamiraccount',
    password: 'Aamir123#',
    database: 'loan_match_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to Cloud SQL database');
});

// ==================== PAGES ====================

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// ==================== USER CRUD ====================

// READ - List all users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM User ORDER BY user_id LIMIT 50', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.render('users', { users: results, error: null, success: null });
  });
});

// CREATE - Add a new user
app.post('/users/add', (req, res) => {
  const { username, password, gender, marital_status, annual_income, credit_score,
          num_loans_taken, age, employment_status, num_existing_loans, zipcode,
          loan_amount_asked } = req.body;

  // Get next user_id
  db.query('SELECT COALESCE(MAX(user_id), 0) + 1 AS next_id FROM User', (err, idResult) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    const newId = idResult[0].next_id;
    const sql = `INSERT INTO User (user_id, username, password, gender, marital_status,
                  annual_income, credit_score, num_loans_taken, age, employment_status,
                  num_existing_loans, zipcode, loan_amount_asked)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [newId, username, password, gender, marital_status,
                    annual_income, credit_score, num_loans_taken, age,
                    employment_status, num_existing_loans, zipcode, loan_amount_asked];

    db.query(sql, values, (err2) => {
      if (err2) {
        console.error(err2);
        db.query('SELECT * FROM User ORDER BY user_id LIMIT 50', (e, results) => {
          res.render('users', { users: results || [], error: 'Failed to add user: ' + err2.message, success: null });
        });
        return;
      }
      db.query('SELECT * FROM User ORDER BY user_id LIMIT 50', (e, results) => {
        res.render('users', { users: results, error: null, success: 'User added successfully!' });
      });
    });
  });
});

// UPDATE - Update a user
app.post('/users/update', (req, res) => {
  const { user_id, username, gender, marital_status, annual_income, credit_score,
          num_loans_taken, age, employment_status, num_existing_loans, zipcode,
          loan_amount_asked } = req.body;

  const sql = `UPDATE User SET username=?, gender=?, marital_status=?, annual_income=?,
               credit_score=?, num_loans_taken=?, age=?, employment_status=?,
               num_existing_loans=?, zipcode=?, loan_amount_asked=?
               WHERE user_id=?`;
  const values = [username, gender, marital_status, annual_income, credit_score,
                  num_loans_taken, age, employment_status, num_existing_loans,
                  zipcode, loan_amount_asked, user_id];

  db.query(sql, values, (err) => {
    if (err) {
      console.error(err);
      db.query('SELECT * FROM User ORDER BY user_id LIMIT 50', (e, results) => {
        res.render('users', { users: results || [], error: 'Failed to update user: ' + err.message, success: null });
      });
      return;
    }
    db.query('SELECT * FROM User ORDER BY user_id LIMIT 50', (e, results) => {
      res.render('users', { users: results, error: null, success: 'User updated successfully!' });
    });
  });
});

// DELETE - Delete a user
app.post('/users/delete', (req, res) => {
  const { user_id } = req.body;

  db.query('DELETE FROM User WHERE user_id = ?', [user_id], (err) => {
    if (err) {
      console.error(err);
      db.query('SELECT * FROM User ORDER BY user_id LIMIT 50', (e, results) => {
        res.render('users', { users: results || [], error: 'Failed to delete user: ' + err.message, success: null });
      });
      return;
    }
    db.query('SELECT * FROM User ORDER BY user_id LIMIT 50', (e, results) => {
      res.render('users', { users: results, error: null, success: 'User deleted successfully!' });
    });
  });
});

// ==================== SEARCH / RETRIEVAL ====================

// Search users by username or credit score range
app.get('/users/search', (req, res) => {
  const { username, min_credit, max_credit } = req.query;
  let sql = 'SELECT * FROM User WHERE 1=1';
  const params = [];

  if (username) {
    sql += ' AND username LIKE ?';
    params.push('%' + username + '%');
  }
  if (min_credit) {
    sql += ' AND credit_score >= ?';
    params.push(parseInt(min_credit));
  }
  if (max_credit) {
    sql += ' AND credit_score <= ?';
    params.push(parseInt(max_credit));
  }

  sql += ' ORDER BY user_id LIMIT 50';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.render('users', { users: results, error: null, success: null });
  });
});

// ==================== LOANS PAGE ====================

app.get('/loans', (req, res) => {
  const { purpose, loan_type } = req.query;
  let sql = 'SELECT * FROM Loan WHERE 1=1';
  const params = [];

  if (purpose) {
    sql += ' AND purpose LIKE ?';
    params.push('%' + purpose + '%');
  }
  if (loan_type) {
    sql += ' AND loan_type = ?';
    params.push(loan_type);
  }

  sql += ' ORDER BY loan_id LIMIT 50';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.render('loans', { loans: results });
  });
});

// ==================== BANKS PAGE ====================

app.get('/banks', (req, res) => {
  const { state } = req.query;
  let sql = `SELECT b.bank_id, b.name, b.type, b.zipcode, l.state,
             l.medium_house_income, l.avg_credit_score
             FROM Bank b
             LEFT JOIN Location l ON b.zipcode = l.zipcode
             WHERE 1=1`;
  const params = [];

  if (state) {
    sql += ' AND l.state = ?';
    params.push(state.toUpperCase());
  }

  sql += ' ORDER BY b.bank_id LIMIT 50';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.render('banks', { banks: results });
  });
});

// ==================== ADVANCED QUERIES PAGE ====================

app.get('/analytics', (req, res) => {
  const query = req.query.query || '1';

  const queries = {
    '1': `SELECT l.state, COUNT(b.bank_id) AS num_banks,
          AVG(l.medium_house_income) AS avg_income,
          AVG(l.avg_credit_score) AS avg_credit
          FROM Bank b
          JOIN Location l ON b.zipcode = l.zipcode
          GROUP BY l.state
          ORDER BY num_banks DESC
          LIMIT 15`,
    '2': `SELECT purpose, AVG(amount) AS avg_amount, COUNT(*) AS num_loans
          FROM Loan
          WHERE amount > (SELECT AVG(amount) FROM Loan)
          GROUP BY purpose
          ORDER BY avg_amount DESC
          LIMIT 15`,
    '3': `SELECT b.name, b.type, l.state, l.avg_credit_score
          FROM Bank b
          JOIN Location l ON b.zipcode = l.zipcode
          WHERE l.avg_credit_score > (SELECT AVG(avg_credit_score) FROM Location)
          ORDER BY l.avg_credit_score DESC
          LIMIT 15`
  };

  const sql = queries[query] || queries['1'];

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }
    res.render('analytics', { results: results, activeQuery: query });
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Loan Match server running on http://0.0.0.0:${PORT}`);
});
