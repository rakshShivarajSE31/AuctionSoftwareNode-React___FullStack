
const express = require("express");
const Project = require("../models/projectModel");
const router = express.Router();

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.status(401).json({ error: "Unauthorized. Please log in first." });
};

// Route to fetch projects with sorting and pagination (protected)
router.get("/projects", isAuthenticated, (req, res) => {
    const sortBy = req.query.sort_by || "recent"; // Default to "recent"
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1
    const limit = 2; // 2 rows per page
    const offset = (page - 1) * limit; // Calculate offset for pagination

    // Fetch projects with sorting and pagination
    Project.getAllProjects(sortBy, offset, limit, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });
});

module.exports = router;
