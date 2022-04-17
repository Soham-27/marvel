const bcrypt = require('bcryptjs');

const client = require("../db/connect");
const generateAdminToken = require("../utils/generateAdmionTokens");

exports.signUpAdmin = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const query = `INSERT INTO Admin (username, password, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING id, username, created_at, updated_at`;
        const values = [req.body.username, hashedPassword, new Date(), new Date()];
        const result = await client.query(query, values);
        const token = await generateAdminToken(result.rows[0].id);
        res.send({
            admin: result.rows[0],
            token
        })
    } catch (e) {
        console.log(e);
        const duplicateError = e.message.split(" ").pop().replaceAll('"', '');
        if (duplicateError === "admin_username_key") {
            return res.status(409).json({ error: "Admin already exists" })
        }
        res.status(500).send({
            error: "Internal Server Error"
        })
    }
};

exports.signInAdmin = async (req, res) => {
    try {
        const query = `select * from Admin where username = $1`;
        const values = [req.body.username];
        const result = await client.query(query, values)
        if (result.rowCount === 0) {
            return res.status(400).send({
                error: "Admin Does not exist"
            })
        }
        else {
            const auth = await bcrypt.compare(req.body.password, result.rows[0].password);
            if (auth) {
                const token = await generateAdminToken(result.rows[0].id);
                const admin = result.rows[0];
                delete admin.password;
                res.send({
                    admin,
                    token
                })
            }
            else {
                return res.status(400).send({
                    error: "Admin Credentials does not match"
                })
            }
        }
    } catch (e) {
        res.status(500).send({
            error: "Internal Server Error"
        })
    }
}

exports.getAdmin = async (req, res) => {
    res.send({ admin: req.admin });
}

exports.logOutAdmin = async (req, res) => {
    try {
        const query = "delete from admin_token where token = $1";
        const params = [req.token];
        const data = await client.query(query, params);
        if (data.rowCount === 1) {
            return res.status(200).json({ success: "successfully logged out" });
        }
        else {
            return res.status(500).json({ error: "Unable to log out" });
        }
    }
    catch (e) {
        res.status(500).send({
            error: "Internal Server Error"
        })
    }
}