const express = require('express');
const db = require('../db');
const router = express.Router();

const QUERIES = {
  '1': `
    SELECT l.state,
           COUNT(b.bank_id) AS num_banks,
           AVG(l.medium_house_income) AS avg_income,
           AVG(l.avg_credit_score) AS avg_credit
    FROM Bank b
    JOIN Location l ON b.zipcode = l.zipcode
    GROUP BY l.state
    ORDER BY num_banks DESC
    LIMIT 15`,

  '2': `
    SELECT purpose,
           AVG(amount) AS avg_amount,
           COUNT(*) AS num_loans
    FROM Loan
    WHERE amount > (SELECT AVG(amount) FROM Loan)
    GROUP BY purpose
    ORDER BY avg_amount DESC
    LIMIT 15`,

  '3': `
    SELECT b.name, b.type, l.state, l.avg_credit_score
    FROM Bank b
    JOIN Location l ON b.zipcode = l.zipcode
    WHERE l.avg_credit_score > (SELECT AVG(avg_credit_score) FROM Location)
    ORDER BY l.avg_credit_score DESC
    LIMIT 15`
};

router.get('/', (req, res) => {
  const q = req.query.query || '1';
  const sql = QUERIES[q] || QUERIES['1'];

  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ results: rows, activeQuery: q });
  });
});

module.exports = router;