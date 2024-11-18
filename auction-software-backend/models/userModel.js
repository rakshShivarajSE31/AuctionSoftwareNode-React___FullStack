

const db = require("./db");

const User = {
    findByUsername: (username, callback) => {
        const query = "SELECT user_id, username, password, salt FROM ilance_users WHERE username = ?";
        db.query(query, [username], callback);
    },
};

module.exports = User;
