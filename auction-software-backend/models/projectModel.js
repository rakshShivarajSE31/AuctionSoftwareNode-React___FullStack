

const db = require("./db");

const Project = {
    getAllProjects: (sortBy, offset, limit, callback) => {
        let orderBy = "p.date_added DESC"; // Default sorting: Recent Projects

        // Determine sorting column based on `sort_by` parameter
        if (sortBy === "category_name") {
            orderBy = "c.category_name ASC";
        } else if (sortBy === "username") {
            orderBy = "u.username ASC";
        } else if (sortBy === "project_title") {
            orderBy = "p.project_title ASC";
        }

        const sql = `
            SELECT 
                IFNULL(p.project_title, 'Untitled') AS project_title, 
                u.username, 
                c.category_name
            FROM 
                ilance_projects p
            LEFT JOIN 
                ilance_users u 
            ON 
                p.user_id = u.user_id
            LEFT JOIN 
                ilance_categories c 
            ON 
                p.cid = c.cid
            ORDER BY ${orderBy}
            LIMIT ? OFFSET ?;
        `;

        db.query(sql, [limit, offset], (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    }
};

module.exports = Project;

