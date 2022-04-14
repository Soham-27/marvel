const express = require('express');
const client = require('../db/connect');
const isUserAuthenticated = require('../middleware/userMiddleware');
const router = require('./user_events');

router.post('/', isUserAuthenticated, async (req,res)=>{
    const url= req.body;
    try {

        const response= await client.query(
            "INSERT INTO photoshop(submission, active_submission, fk_user, created_at, updated_at) VALUES($1, $2, $3, $4, $5) RETURNING * ",
            [url, true, req.user.id, new Date(), new Date()]
        );
        res.send({
            submission:response.rows[0]
        })

        
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
           error: "Internal Server error"
          });
        
        
    }
})

module.exports = router;