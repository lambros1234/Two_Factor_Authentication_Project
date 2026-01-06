# Security Tests – Attack Demonstrations

This folder contains **controlled security test scripts** used to demonstrate
how the implemented Two-Factor Authentication (2FA) system based on
**Time-Based One-Time Passwords (TOTP)** protects against common authentication attacks.

⚠️ **Important Notice**  
All scripts in this directory are intended **strictly for educational and demonstration purposes**  
and were executed **only against the local development environment** of this project.  
No unauthorized systems or third-party services were targeted.

---

## Purpose of This Folder

The goal of these tests is to:
- Demonstrate the **security guarantees provided by TOTP**
- Show how common attacks fail against properly implemented 2FA
- Support the theoretical explanations provided in the project report

Each script simulates a well-known attack scenario and verifies that the system
correctly detects and blocks the attack.

---

## Included Tests

### 1️⃣ Replay Attack Demonstration (`replay-demo.js`)

**Attack Description:**  
A replay attack occurs when an attacker captures a previously valid authentication
code and attempts to reuse it to gain unauthorized access.

**Test Method:**
- A user logs in normally and completes password authentication
- A previously valid (now expired) TOTP code is submitted again
- The server verifies the code using the current time window

**Expected Outcome:**  
❌ Access is denied because the TOTP code has expired  
✅ The user is **not redirected** to the protected dashboard

**Security Property Demonstrated:**  
- Time-based validity of OTPs
- Resistance to replay attacks

---

## How to Run the Test
1. Start the application server:
   ```bash
   node src/server.js
   
2. Ensure at least one user has 2FA enabled
3. Run a test script:
   ```bash
   node src/security-tests/replay-demo.js
4. Observe the console output to verify whether the attack was successfully blocked

**Notes on Results Interpretation**
- A successful attack would result in a redirect to a protected route (e.g. /dashboard.html)
- A blocked attack results in: 
    - No redirect
    - An error message or unchanged response
- HHTP status may still return 200 (OK) for failed attacks due to simplidied backend error handling

---

### 2️⃣ Brute-Force Authentication Attack (`bruteforce-demo.js`)

**Attack Description:**  
A brute-force attack attempts to gain unauthorized access by systematically trying
multiple common or leaked passwords until the correct one is found.

**Test Method:**
- An attacker submits repeated login attempts using a list of common passwords
- The correct password is eventually guessed
- The server redirects the attacker to the 2FA verification step instead of granting access

**Expected Outcome:**  
Password compromised ❌
Second factor required ✅
Account takeover prevented by TOTP

**Security Property Demonstrated:**  
- Protectios against credential compromise
- Enforcement of multi-factor authentication
- Seperation of password verification and final authorization

## How to Run the Test
1. Start the application server
   ```bash
   node src/server.js
2. Ensure a test user exists with:
    - A known username
    - 2FA enabled
3. Run the brute-force test script
   ```bash
   node src/security-tests/bruteforce-demo.js
4. Observe the console output for:
    - Password attempts
    - Detection of correct password
    - Redirection to the 2FA verification page

**Notes on Results Interpratation**
- A succesful brute-force attack would result in direct access to protect resources 
- In the system:
    - The correct password only grants access to the 2FA setup
    - Final access requires a valid TOTP code
- HTTP status codes may still return 200 (OK) due to simplified error handling