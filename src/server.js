const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const twofaRoutes = require('./routes/twofa');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'super-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, 'views')));

app.use('/auth', authRoutes);
app.use('/2fa', twofaRoutes);

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));