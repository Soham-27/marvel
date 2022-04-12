const client = require("../db/connect");

exports.isUserAuthenticated = async(req,res,next)=>{
    try {
        
    } catch (err) {
        return res.status(401).json({error:'Unautherised Admin!'});
    }
}