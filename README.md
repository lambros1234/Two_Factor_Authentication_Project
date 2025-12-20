# Two-Factor Authentication (2FA) Using TOTP

This project implements a secure authentication system combining
password-based login with Time-Based One-Time Passwords (TOTP),
demonstrating how two-factor authentication is used in real-world systems.

## Cryptographic Concepts Used
- Password hashing with bcrypt (adaptive hashing, per-user salt)
- Time-Based One-Time Passwords (RFC 6238)
- HMAC-based OTP generation
- Secure secret key provisioning via QR codes

## Current Progress
- User registration and login implemented
- Secure password hashing with bcrypt
- SQLite database for credential storage
- Initial 2FA flow design
- Middleware for route protection

## Planned Features
- QR-code-based TOTP enrollment (Google Authenticator)
- OTP verification during login
- Session-based 2FA verification
- Security analysis and attack discussion

## Authentication Flow
User → Login (password)
     → Server verifies bcrypt hash
     → If 2FA enabled → OTP required
     → TOTP verified (HMAC + time)
     → Access granted

## Running the Project
```bash
npm install
node src/server.js
