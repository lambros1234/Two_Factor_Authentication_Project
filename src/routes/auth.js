const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.redirect('/register.html?error=missing_fields');
  }

  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hash],
    (err) => {
      if (err) {
        return res.redirect('/register.html?error=user_exists');
      }

      return res.redirect('/login.html?registered=success');
    }
  );

  } catch (err) {
    console.error(err);
    res.redirect('/register.html?error=server_error');
  }
});



// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.redirect('/login.html?error=missing_fields');
  }

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) return res.redirect('/login.html?error=db_error');
      if (!user) return res.redirect('/login.html?error=user_not_found');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.redirect('/login.html?error=invalid_password');

      req.session.user = {
        id: user.id,
        username: user.username,
        twofa_enabled: user.twofa_enabled
      };

      if (user.twofa_enabled) {
        return res.redirect('/verify-2fa.html');
      }

      res.redirect('/2fa-dashboard.html');
    }
  );
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login.html');
  });
});


module.exports = router;
