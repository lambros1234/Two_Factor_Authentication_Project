import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000";
const USERNAME = "Test"; // Assuming the attacker has the credentials
const PASSWORD = "123";
const OLD_TOTP = "482193"; // previously valid code

async function replayAttack() {
  console.log("Logging in first...");

  // Login to create a session
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      username: USERNAME,
      password: PASSWORD
    }),
    redirect: "manual"
  });

  const cookie = loginRes.headers.get("set-cookie");
  if (!cookie) {
    console.log("Login failed");
    return;
  }

  console.log("Session established. Attempting replay attack...");

  // Replay expired TOTP using SAME session
  const replayRes = await fetch(`${BASE_URL}/2fa/verify-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": cookie
    },
    body: new URLSearchParams({
      token: OLD_TOTP
    }),
    redirect: "manual"
  });

    const location = replayRes.headers.get("location");

    if (location === "/dashboard.html") {
    console.log("Replay attack succeeded (this should not happen)");
    } else {
    console.log("Replay attack blocked");
    }
}

replayAttack();
