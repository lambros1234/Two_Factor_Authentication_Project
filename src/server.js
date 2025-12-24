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

// Serve static files properly
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRoutes);
app.use('/2fa', twofaRoutes);


// Protected pages
app.get('/2fa-dashboard', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', '2fa-dashboard.html'));
});

app.get('/account', authCheck, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'account.html'));
});

// Default route
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Logout failed.');
    }

    res.redirect('/login.html');
  });
});

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 



app.listen(3000, () => console.log("Server running at http://localhost:3000"));
