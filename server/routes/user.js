const axios = require('axios');
const express = require('express');
const client = require('../db/connect');
const generateUserToken = require("../utils/generateUserTokens");

const router = new express.Router();

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const options = {
        method: "POST",
        url: `https://api.pulzion.in/user/signin`,
        headers: {
            "Content-Type": "application/json",
        },
        data: {
            email,
            password
        },
    };
    try {
        let response = await axios(options)
        let user = response.data.user;
        if (response.data?.error) {
            console.log(response.data.error);
            return res.send({
                error: 'EMS Error'
            })
        }
        const ems_token = response.data.token;
        response = await client.query('select * from users where ems_id = $1', [user.id])
        if(response.rowCount === 0) {
            response = await client.query(
                "INSERT INTO users( first_name, last_name, email, mobile_number, college, year, created_at, updated_at, ems_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
                [user.first_name, user.last_name, user.email, user.mobile_number, user.college, user.year, new Date(), new Date(), user.id]
            );
        }
        user = response.rows[0]
        const userId = user.id;
        const token = await generateUserToken(userId, ems_token);

        res.send({
            user,
            tokens: {
                token,
                ems_token
            }
        })
    } catch (err) {
        console.log(err)
        const duplicateError = err.message.split(" ").pop().replaceAll('"', '');
        if (duplicateError === "users_email_key") {
            res.status(409).json({ error: "User with this email already exists" })
        }
        else if (duplicateError === "users_mobile_number_key") {
            res.status(409).json({ error: "User with this mobile_number already extsts" })
        }
        else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
})

module.exports = router;