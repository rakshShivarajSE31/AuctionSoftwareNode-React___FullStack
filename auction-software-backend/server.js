

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = 5009;

// Middleware
app.use(cors({
    origin: "http://localhost:3000", // Correct frontend URL
    credentials: true, // Allow cookies to be sent
}));
app.use(bodyParser.json());

// Session configuration
app.use(
    session({
        secret: "your_secret_key", 
        resave: false,
        saveUninitialized: false, 
        cookie: {
            secure: process.env.NODE_ENV === "production", 
            httpOnly: true, 
            maxAge: 1000 * 60 * 60, 
        },
    })
);

// Routes
app.use("/api/auth", authRoutes); // Authentication-related routes
app.use("/api", projectRoutes); // Project-related routes

// Test endpoint for session checking
app.get("/api/auth/session", (req, res) => {
    if (req.session && req.session.userId) {
        return res.json({ loggedIn: true, username: req.session.username });
    }
    res.json({ loggedIn: false });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
