# Two-Factor Authentication (2FA) Using TOTP

This project implements a secure Two-Factor Authentication (2FA) system using Time-Based One-Time Passwords (TOTP).
It demonstrates how cryptographic techniques such as bcrypt password hashing and HMAC-based OTP generation are used in real-world authentication systems.

The project was developed as part of the Cryptography and Security course.

## Features
- User registration and login with bcrypt-hashed passwords
- Time-Based One-Time Password (TOTP) authentication
- QR-code enrollment for authenticator apps (Google Authenticator)
- Session-based authentication and access control
- Middleware-protected routes
- Security demonstration scripts (brute-force and replay attacks)

## Technologies Used
- Node.js
- Express.js
- SQLite
- bcrypt
- speakeasy
- qrcode
- exress-session

## Project Structure
```text
src/
├── server.js        # Application entry point
├── db.js            # SQLite database initialization
├── routes/
│   ├── auth.js      # Registration and login logic
│   └── twofa.js     # TOTP enrollment and verification
├── middleware/
│   └── authCheck.js # Authentication and 2FA enforcement
├── public/
│   ├── login.html
│   ├── register.html
│   ├── verify-2fa.html
│   ├── 2fa-setup.html
│   ├── dashboard.html
│   └── 2fa-dashboard.html
└── security-tests/
    ├── bruteforce-demo.js
    └── replay-demo.js
```

## Installation and Running the Project
1. Install dependencies
```bash
npm install 
```
2. Start the server
```bash
node src/server.js
```
The application will be available at 
```bash
http://localhost:3000
```

## Security Demonstrations 
⚠️ Make sure the server is running before executing any security test scripts.

### Brute-force attack simulation
```bash
node security-tests/bruteforce-demo.js
```
### Replay attack simulation
```bash
node security-tests/replay-demo.js
```

These scripts are provided for educational purposes only and operate on test accounts.

## Documentation
- The full technical report is available in the docs/folder
- The report explains:
     - Cryptographic mechanisms
     - Authentication flow
     - Threat model
     - Security analysis and limitations

## Authors
- Lampros Chalatsis
- Konstantinos Pogelis

## Cource Information
- Cource: Cryptography and Security
- Instructor: Marek Ogiela
- Year: 2025-2026