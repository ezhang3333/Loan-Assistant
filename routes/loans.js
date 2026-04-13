const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  const { purpose, loan_type } = req.query;
  const where = [];
  const params = [];

  if (purpose) {
    where.push('purpose LIKE ?');
    params.push(`%${purpose}%`);
  }
  if (loan_type) {
    where.push('loan_type = ?');
    params.push(loan_type);
  }

  const sql = 'SELECT * FROM Loan'
    + (where.length ? ' WHERE ' + where.join(' AND ') : '')
    + ' ORDER BY loan_id LIMIT 50';

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).send('db error');
    res.render('loans', { loans: rows });
  });
});

module.exports = router;