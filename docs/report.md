# Two-Factor Authentication (2FA) Using TOTP
**Author:** Lampros Chalatsis, Konstantinos Pogelis  
**Course:** Cryptography and Security
**Professor:** Marek Ogiela  
**Date:** December 2025

## Introduction
Passwords alone are often insufficient to secure user accounts due to risks such as phishing, credential reuse, and brute-force attacks. This project implements a two-factor authentication system that combines passwords with time-based one-time passwords (TOTP), demonstrating how cryptographic primitives are applied in real-world authentication.

## Motivation / Problem Statement
We chose 2FA because it reduces the major risks that are associated with password-only authentication, demonstrates practical use of cryptography, and is widely used as a standard in secure authentication practices.

Traditional password-based authentication is vulnerable to a variety of security risks, such as passwords reuse across multiple websites, phishing attacksm and brute-force attempts. These vulnerabilities can lead to unauthorized access, data breaches, and loss of sensitive information. There is a need for a more secure authentication process that increases user account protecation without reducing usability. This project adresses this problem by implementing Two-Factor Authentication (2FA) using Time-Based One-Time Passwords (TOTP), which provides an additional layer of security beyond standard passwords.

## Objectives
- Implement secure user registration and login using bcrypt.
- Generate and store per-user TOTP secrets for 2FA.
- Enable QR-code enrollment for authenticator apps.
- Verify TOTP codes during login
- Protect routes using middleware
- Explain the cryptography behind password hashing and TOTP