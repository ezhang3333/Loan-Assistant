require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 80;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render('index'));

app.use('/users', require('./routes/users'));
app.use('/loans', require('./routes/loans'));
app.use('/banks', require('./routes/banks'));
app.use('/analytics', require('./routes/analytics'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`running on :${PORT}`);
});