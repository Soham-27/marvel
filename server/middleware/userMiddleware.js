const client = require("../db/connect");

exports.isUserAuthenticated = async (req, res, next) => {
    try {
        let query = "select * from user_token where token = $1";
        const token = req.header("Authorization").replace("Bearer ", "");
        let params = [token];
        const data = await client.query(query, params);
        if (data.rowCount < 1) {
            return res.status(401).json({ error: "Unauthorized user!" });
        }
        const userId = data.rows[0].fk_user;
        query =
            "SELECT id, first_name, last_name, email, mobile_number, college, created_at, updated_at from users where id = $1";
        params = [userId];
        const result = await client.query(query, params);
        if (result.rowCount < 1) {
            return res.status(401).json({ error: "Unauthorized user!" });
        }
        req.user = result.rows[0];
        req.token = token;
        next();

    } catch (err) {
        return res.status(401).json({ error: 'Unautherised Admin!' });
    }
}