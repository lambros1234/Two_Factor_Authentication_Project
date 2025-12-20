const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);  // <-- no callback

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

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.status(500).send("Database error.");
    if (!user) return res.send("User not found.");

    console.log("password typeof:", typeof password, password);
    console.log("user.password typeof:", typeof user.password, user.password);

    try {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.send("Invalid password.");
    } catch (error) {
      console.error("COMPARE ERROR:", error);
      return res.status(500).send("Error comparing passwords.");
    }

    req.session.user = user;

    if (user.twofa_enabled) {
      return res.redirect('/verify-2fa.html');
    }

    res.redirect('/dashboard.html');
  });
});


module.exports = router;
