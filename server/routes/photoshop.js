const express = require('express');
const client = require('../db/connect');
const isUserAuthenticated = require('../middleware/userMiddleware');
const router = require('./user_events');
const { emsIds } = require("../models/master");

router.post('/', isUserAuthenticated, async (req, res) => {
    const submission = req.body;
    const ems_id = emsIds.photoshop;
    try {

        const data = await client.query(
            "SELECT* FROM user_events WHERE fk_user=$1 and ems_id=$2",
            [req.user.id, ems_id]
        );

        if (data.rowCount === 0) {
            return res.status(400).send({
                error: "User havent Registered "
            })
        }

        const response = await client.query(
            "INSERT INTO photoshop(submission, active_submission, fk_user, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING * ",
            [submission, true, req.user.id, new Date(), new Date()]
        );
        res.send({
            submission: response.rows[0]
        })



    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: "Internal Server error"
        });


    }
})

router.get('/', isUserAuthenticated, async (req, res) => {
    try {
        const response = await client.query(
            "SELECT * FROM photoshop WHERE fk_user= $1",
            [req.user.id]
        );

        if (response.rowCount === 0) {
            return res.status(400).send({
                error: "Nothing Submitted"
            })
        }
        res.send({
            submission: response.rows[0]
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            error: "Internal Server error"
        });

    }
})

module.exports = router;