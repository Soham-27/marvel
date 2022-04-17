
const client = require("../db/connect");

exports.isAdminAuthenticated = async (req, res, next) => {
    try {
        let query = `select * from admin_token where token = $1`
        const token = req.header("Authorization").replace("Bearer ", "");
        let params = [token]
        const data = await client.query(query, params);
        if (data.rowCount < 1) {
            return res.status(401).json({ error: "Unauthorized Admin!" });
        }
        const Adminid = data.rows[0].fk_admin;
        query = `SELECT id, username, created_at, updated_at from Admin where id = $1`
        params = [Adminid]
        const result = await client.query(query, params);
        if (result.rowCount < 1) {
            return res.status(401).json({ error: "Unauthorized Admin!" });
        }
        req.admin = result.rows[0];
        req.token = token;
        next();
    } catch (e) {
        return res.status(401).json({ error: "Unauthorized Admin!" });
    }
}