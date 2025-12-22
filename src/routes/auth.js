const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

// Register
// NOT FINISHED: add email field
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);  

  // Store user in the database
  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, hash],
    (err) => {
      if (err) return res.send("User already exists.");
      res.redirect('/login.html');
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.status(500).send("Database error.");
    if (!user) return res.send("User not found.");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.send("Invalid password.");

    // Store minimal info in session
    req.session.user = {
      id: user.id,
      username: user.username,
      twofa_enabled: user.twofa_enabled
    };

    if (user.twofa_enabled) {
      return res.redirect('/verify-2fa.html');
    }
    console.log("Session after login:", req.session.user);


    res.redirect('/dashboard.html');
  });
});


module.exports = router;
