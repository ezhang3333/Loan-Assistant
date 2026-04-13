const express = require('express');
const db = require('../db');
const router = express.Router();

const LIST_SQL = 'SELECT * FROM User ORDER BY user_id LIMIT 50';

function renderList(res, opts = {}) {
  db.query(LIST_SQL, (err, rows) => {
    res.render('users', {
      users: rows || [],
      error: opts.error || null,
      success: opts.success || null
    });
  });
}

router.get('/', (req, res) => {
  db.query(LIST_SQL, (err, rows) => {
    if (err) return res.status(500).send('db error');
    res.render('users', { users: rows, error: null, success: null });
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
    if (err) return res.status(500).send('db error');
    res.render('users', { users: rows, error: null, success: null });
  });
});

router.post('/add', (req, res) => {
  const b = req.body;

  db.query('SELECT COALESCE(MAX(user_id), 0) + 1 AS next_id FROM User', (err, r) => {
    if (err) return res.status(500).send('db error');

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
      if (err2) return renderList(res, { error: 'add failed: ' + err2.message });
      renderList(res, { success: 'user added' });
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
    if (err) return renderList(res, { error: 'update failed: ' + err.message });
    renderList(res, { success: 'updated' });
  });
});

router.post('/delete', (req, res) => {
  db.query('DELETE FROM User WHERE user_id = ?', [req.body.user_id], err => {
    if (err) return renderList(res, { error: 'delete failed: ' + err.message });
    renderList(res, { success: 'deleted' });
  });
});

module.exports = router;