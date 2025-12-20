const express = require('express');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const db = require('../db');

const router = express.Router();

// Generate QR Code
router.get('/setup', (req, res) => {
  const secret = speakeasy.generateSecret({
    name: `2FA Project (${req.session.user.username})`
  });

  // Store secret temporarily in session
  req.session.temp_secret = secret;

  // Generate QR code image
  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    res.send(`
      <h1>Scan QR Code in Google Authenticator</h1>
      <img src="${data_url}">
      <form method="POST" action="/2fa/verify-setup">
        <input name="token" placeholder="Enter 6-digit code">
        <button>Verify</button>
      </form>
    `);
  });
});

// Verify setup
router.post('/verify-setup', (req, res) => {
  const { token } = req.body;
  const secret = req.session.temp_secret;

  // Verify the token
  const verified = speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token
  });

  if (!verified) return res.send("Invalid code. Try again.");

  // Save secret and enable 2FA for the user
  db.run(
    "UPDATE users SET twofa_secret = ?, twofa_enabled = 1 WHERE id = ?",
    [secret.base32, req.session.user.id]
  );

  delete req.session.temp_secret;
  res.redirect('/dashboard.html');
});

// Verify during login
router.post('/verify-login', (req, res) => {
  const { token } = req.body;

  db.get(
    "SELECT twofa_secret FROM users WHERE id = ?",
    [req.session.user.id],
    (err, user) => {
      const verified = speakeasy.totp.verify({
        secret: user.twofa_secret,
        encoding: 'base32',
        token
      });

      if (!verified) return res.send("Incorrect code.");

      return res.redirect('/dashboard.html');
    }
  );
});

module.exports = router;
