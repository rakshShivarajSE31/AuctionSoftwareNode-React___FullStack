

const express = require("express");
const User = require("../models/userModel");
const crypto = require("crypto"); // For hashing
const router = express.Router();

// Login route
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Log the received username and password
    console.log("Login request received:", { username, password });

    // Input validation
    if (!username || !password) {
        console.log("Missing credentials");
        return res.status(400).json({ error: "Username and password are required" });
    }

    // Find user by username
    User.findByUsername(username, (err, results) => {
        if (err) {
            console.error("Database query failed:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length === 0) {
            console.log("Invalid username or password");
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = results[0];
        const { salt, password: storedPassword } = user;

        const hashedInputPassword = crypto
            .createHash("md5")
            .update(crypto.createHash("md5").update(password).digest("hex") + salt)
            .digest("hex");

        if (hashedInputPassword === storedPassword) {
            console.log("Login successful for user:", username);
            req.session.userId = user.user_id;
            req.session.username = user.username;
            res.json({ message: "Login successful", username: user.username });
        } else {
            console.log("Password mismatch");
            res.status(401).json({ error: "Invalid username or password" });
        }
    });
});


// Route to check session status
router.get("/session", (req, res) => {
    if (req.session && req.session.userId) {
        console.log("Session active for user:", req.session.username);
        return res.json({ loggedIn: true, username: req.session.username });
    }
    console.log("No active session");
    res.json({ loggedIn: false });
});


// Logout route
router.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: "Failed to log out." });
            }
            res.clearCookie("connect.sid"); // Clear session cookie
            res.json({ message: "Logout successful" });
        });
    } else {
        res.status(400).json({ error: "No session to log out." });
    }
});




module.exports = router;
