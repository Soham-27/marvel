const express = require('express');
const client = require('../db/connect');
const isUserAuthenticated = require('../middleware/userMiddleware');
const { emsIds } = require("../models/master");

const router = express.Router();

router.post('/', isUserAuthenticated, async (req, res) => {
    // const { submission } = req.body;
    const { paper_type } = req.body;
    const ems_id = emsIds.paper;
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

        const query = `select exists (select * from paper where fk_user = $1)`
        const result = await client.query(query, [req.user.id]);
        if (result.rows[0].exists) {
            return res.status(400).send({
                error: "Entry Already Submitted",
            })
        }
        
        if(paper_type===""){
            return res.status(400).send({
                error:"Paper Type not entered"
            })
        }

        if (paper_type === "Idea Presentation Track") {
            const { submission_abstract } = req.body;
            const response = await client.query(
                "INSERT INTO paper(type, submission_abstract, active_submission, fk_user, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING * ",
                [paper_type, submission_abstract, true, req.user.id, new Date(), new Date()]
            );
            return res.send({
                submission: response.rows[0]
            })
        }
        if (paper_type === "Paper Presentation Track") {
            const { submission_abstract } = req.body;
            const { submission_paper } = req.body;
            if(submission_paper===""){
                return res.status(400).send({
                    error:"Paper Not Submitted"
                })
            }
            const response = await client.query(
                "INSERT INTO paper(type, submission_abstract, submission_paper, active_submission, fk_user, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING * ",
                [paper_type, submission_abstract, submission_paper, true, req.user.id, new Date(), new Date()]
            );
            return res.send({
                submission: response.rows[0]
            })
        }
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
            "SELECT * FROM paper WHERE fk_user= $1",
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