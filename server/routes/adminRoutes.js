const express = require("express");
const {isAdminAuthenticated} = require("../middlewares/adminMiddlewares");
const client = require('../db/connect');



const {
    signUpAdmin,
    signInAdmin,
    getAdmin,
    logOutAdmin
} = require("../controllers/adminControllers");

const router = express.Router();

router.post("/signup", signUpAdmin);
router.post("/signin",signInAdmin);
router.get("/me",isAdminAuthenticated,getAdmin);
router.post("/signout",isAdminAuthenticated,logOutAdmin);

router.get("/dataquest", isAdminAuthenticated , async(req,res)=>{
   try {
       const response= await client.query("SELECT * FROM dataquest");
       res.status(400).send({
            submissions: response.rows[0]
       })
       
   } catch (error) {
       
   }
})

module.exports = router;