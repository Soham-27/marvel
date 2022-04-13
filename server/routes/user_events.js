const { default: axios } = require('axios');
const express = require('express');
const isUserAuthenticated = require('../middleware/userMiddleware');

const router = express.Router();

router.get('/', isUserAuthenticated, async (req, res) => {
    const options = {
        method: "GET",
        url: `${process.env.EMS_API}/user_events`,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${req.ems_token}`,
        },
    };
    try {
        const response = await axios(options);
        return res.send(response.data);
    } catch (err) {
        console.log(err)
        if (err?.response) {
            return res.status(400).send(err?.response?.data);
        }
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = router;