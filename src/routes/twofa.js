const express = require('express');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const db = require('../db');

const router = express.Router();

router.get('/setup', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login.html');
  }

  const secret = speakeasy.generateSecret({
    name: `2FA Project (${req.session.user.username})`
  });

  req.session.temp_secret = secret;
  req.session.otpauth_url = secret.otpauth_url;

  res.sendFile(
    require('path').join(__dirname, '../public/2fa-setup.html')
  );
});

router.get('/qr', (req, res) => {
  if (!req.session.otpauth_url) {
    return res.status(400).json({ error: 'No QR available' });
  }

  qrcode.toDataURL(req.session.otpauth_url, (err, data_url) => {
    res.json({ qr: data_url });
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
