const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res) => {
  const { state } = req.query;

  let sql = `
    SELECT b.bank_id, b.name, b.type, b.zipcode,
           l.state, l.medium_house_income, l.avg_credit_score
    FROM Bank b
    LEFT JOIN Location l ON b.zipcode = l.zipcode`;
  const params = [];

  if (state) {
    sql += ' WHERE l.state = ?';
    params.push(state.toUpperCase());
  }
  sql += ' ORDER BY b.bank_id LIMIT 50';

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).send('db error');
    res.render('banks', { banks: rows });
  });
});

module.exports = router;