const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const twofaRoutes = require('./routes/twofa');
const authCheck = require('./middleware/authCheck'); 

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'super-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(express.static(path.join(__dirname, 'views')));

// Public routes
app.use('/auth', authRoutes);
app.use('/2fa', twofaRoutes); // 2FA verification is part of login flow

// Protected routes
app.get('/dashboard', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});

app.get('/account', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'account.html'));
});

// Default route
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
