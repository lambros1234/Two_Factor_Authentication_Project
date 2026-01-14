import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000";
const username = "Test";

const passwords = [
  "123456",
  "password",
  "password123",
  "123456a",
  "letmein",
  "qwerty",
  "123", // correct password
  "abc123",
];

// Function to attempt login with a given password
async function attemptLogin(password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      username,
      password
    }),
    redirect: "manual"
  });

  return res.headers.get("location");
}

(async () => { 
  console.log("Starting brute-force demo...\n");

  let compromised = false;
  
  // Try each password
  for (const pwd of passwords) {
    console.log(`Trying password: ${pwd}`);

    const redirect = await attemptLogin(pwd);

    if (redirect?.includes("verify-2fa")) {
        compromised = true;
        console.log("\nPassword compromised ❌");
        console.log("Second factor required ✅");
        console.log("Account takeover prevented by TOTP.\n");
        break;
    }

  }

  if (!compromised) {
    console.log("\nBrute-force attack failed. Account secure.");
  }

  console.log("Demo complete.");
})();
