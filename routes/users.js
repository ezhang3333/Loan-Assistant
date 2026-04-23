const express = require('express');
const db = require('../db');
const bcrpyt = require('bcrypt'); 
const router = express.Router();

const LIST_SQL = 'SELECT * FROM User ORDER BY user_id LIMIT 50';
const saltRounds = 10;

router.post('/login', async (req, res) => {
  try {
    const { username, password_attempt } = req.body;

    if (!username || !password_attempt) {
      return res.status(400).json({ error: 'No username or password detected' });
    }

    const sql = 'SELECT * FROM User WHERE username = ?';
    const [rows] = await db.query(sql, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    if (rows.length > 1) {
      return res.status(500).json({ error: 'Multiple instances of this username have been found' });
    }

    const user = rows[0];

    const passwordMatches = await bcrypt.compare(
      password_attempt,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: `Server error: ${err.body}` });
  }
});

router.post('/create', async (req, res) => {
  try {
    // since we auto increment our user_id in the database per new entry
    // we dont need to pass or generate a user_id here
    const {
      username,
      password,
      gender,
      marital_status,
      annual_income,
      credit_score,
      num_loans_taken,
      age,
      employment_status,
      num_existing_loans,
      zipcode,
      loan_amount_asked
    } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'No username or password detected' });
    }

    // check username already taken
    const checkSql = 'SELECT user_id FROM User WHERE username = ?';
    const [existingRows] = await db.query(checkSql, [username]);
    if (existingRows.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const password_hash = await bcrpyt.hash(password, saltRounds);
    const sql = `
      INSERT INTO User (
        username,
        password_hash,
        gender,
        marital_status,
        annual_income,
        credit_score,
        num_loans_taken,
        age,
        employment_status,
        num_existing_loans,
        zipcode,
        loan_amount_asked
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      username,
      password_hash,
      gender,
      marital_status,
      annual_income,
      credit_score,
      num_loans_taken,
      age,
      employment_status,
      num_existing_loans,
      zipcode,
      loan_amount_asked
    ];

    const [result] = await db.query(sql, values);

    return res.status(201).json({
      message: 'User created successfully',
      user_id: result.insertId 
    });
  } catch (err) {
    return res.status(500).json({ error: `Server error: ${err.body}` });
  }
});

//
// Prev Endpoints 
//

router.get('/', (req, res) => {
  db.query(LIST_SQL, (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ users: rows });
  });
});

router.get('/search', (req, res) => {
  const { username, min_credit, max_credit } = req.query;
  const where = [];
  const params = [];

  if (username) {
    where.push('username LIKE ?');
    params.push(`%${username}%`);
  }
  if (min_credit) {
    where.push('credit_score >= ?');
    params.push(parseInt(min_credit));
  }
  if (max_credit) {
    where.push('credit_score <= ?');
    params.push(parseInt(max_credit));
  }

  const sql = 'SELECT * FROM User'
    + (where.length ? ' WHERE ' + where.join(' AND ') : '')
    + ' ORDER BY user_id LIMIT 50';

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ users: rows });
  });
});

router.post('/add', (req, res) => {
  const b = req.body;

  db.query('SELECT COALESCE(MAX(user_id), 0) + 1 AS next_id FROM User', (err, r) => {
    if (err) return res.status(500).json({ error: 'db error' });

    const sql = `INSERT INTO User
      (user_id, username, password, gender, marital_status, annual_income,
       credit_score, num_loans_taken, age, employment_status,
       num_existing_loans, zipcode, loan_amount_asked)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const vals = [
      r[0].next_id, b.username, b.password, b.gender, b.marital_status,
      b.annual_income, b.credit_score, b.num_loans_taken, b.age,
      b.employment_status, b.num_existing_loans, b.zipcode, b.loan_amount_asked
    ];

    db.query(sql, vals, err2 => {
      if (err2) return res.status(400).json({ error: 'add failed: ' + err2.message });
      res.json({ success: 'user added' });
    });
  });
});

router.post('/update', (req, res) => {
  const b = req.body;
  const sql = `UPDATE User SET
    username=?, gender=?, marital_status=?, annual_income=?, credit_score=?,
    num_loans_taken=?, age=?, employment_status=?, num_existing_loans=?,
    zipcode=?, loan_amount_asked=?
    WHERE user_id=?`;
  const vals = [
    b.username, b.gender, b.marital_status, b.annual_income, b.credit_score,
    b.num_loans_taken, b.age, b.employment_status, b.num_existing_loans,
    b.zipcode, b.loan_amount_asked, b.user_id
  ];

  db.query(sql, vals, err => {
    if (err) return res.status(400).json({ error: 'update failed: ' + err.message });
    res.json({ success: 'updated' });
  });
});

router.post('/delete', (req, res) => {
  db.query('DELETE FROM User WHERE user_id = ?', [req.body.user_id], err => {
    if (err) return res.status(400).json({ error: 'delete failed: ' + err.message });
    res.json({ success: 'deleted' });
  });
});

module.exports = router;