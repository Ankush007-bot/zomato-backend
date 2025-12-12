// ✅ 1. Access Token Kya Hota Hai?

// Short-lived token (usually 10–30 minutes).
// Jise frontend har request ke sath bhejta hai to prove:

// “Yeh user authenticated hai.”

// Use:

// Protected APIs me access milta hai

// Example:

// GET /api/user/orders

// Validity chhoti kyu rakhi jati hai?

// Agar token leak ho jaye toh attacker sirf 30 minutes use kar paaye.

// ✅ 2. Refresh Token Kya Hota Hai?

// Long-lived token (7–30 days).
// Backend only uses refresh token to generate a new access token.

// Use:

// Jab access token expire ho jaye → refresh token se new access token banega.

// User ko fir se login nahi karna padta.

// Storage:

// HTTP-Only Cookie me hi store karte hain (secure method).

// ✅ 3. HUMNE ABHI TAK KYA-KYA KIYA? (Recap)
// ✔ (A) Login API

// Login ke time:

// Email/password verify

// accessToken generate

// refreshToken generate

// Refresh token cookie me set (httpOnly)

// ✔ (B) Protected Routes

// Backend me middleware:

// JWT verify

// Wrong/expired token → 401 Unauthorized

// ✔ (C) Token Expiry

// Humne:

// Access token: short expiry (mostly 10–15 min)

// Refresh token: long expiry (7 days)

// Though hum code me expiry baad me add karenge, concept tu clear rakh.

// 🔥 4. Aage Projects Me Access + Refresh Token Kaise Kaam Karega?
// ⭐ Scenario 1 — User opens the app

// Browser request → refresh token cookie check hota hai

// Valid → new access token → user stays logged in

// ⭐ Scenario 2 — Access Token Expire Ho Gaya

// Automatically backend:

// Access token expired → request fails

// Frontend silently calls:

// POST /api/auth/refresh


// Backend checks refresh token

// New access token generate

// User ko pata bhi nahi chalega → smooth login

// ⭐ Scenario 3 — User Logout Kare

// Refresh token cookie delete

// Refresh token DB se remove

// Access token worthless ban gaya

// ⭐ Scenario 4 — Hacker Ne Token Chura Liya

// Access token → kam time ka hoga → jaldi expire

// Refresh token → httpOnly cookie me rahta hai → JS se access nahi hota

// Best protection

// 🧠 5. Real-World Projects Me Actual Use
// ✔ Zomato → continuous login for weeks
// ✔ Swiggy → access token expire → backend automatically refresh
// ✔ Instagram → app kholte hi login ID yaad

// Auth ka pura flow isi ke upar chalta hai.

// 🎯 6. Final Flow Diagram (Simple)
// User Login → accessToken + refreshToken

// accessToken expired ?
//      |
//      |— Yes → use refreshToken → new accessToken generate
//      |
//      |— No  → request continue

// User Logout → refreshToken delete → login required