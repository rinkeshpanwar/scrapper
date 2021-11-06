const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const conn = require("../../conn/index");
require('dotenv').config();

const nullsafety = (data)=>{
    try {
        const {email,password} = data;
        if(email===undefined || password===undefined){
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

const generate_token = (data,res)=>{
    try {
        const {email,password} =data; 
        conn.query("SELECT * FROM user WHERE email = ? AND password = ?",[email,password],(err,results,fields)=>{
            if(err){
                res.json({
                    "status":0,
                    "message":"There was some problem in checking the detail please try again"
                });
            }else{ 
                if(results.length<1){
                    // no user found with this email and password
                    res.json({
                        "status":0,
                        "message":"please provide a valid username and password"
                    })
                }else{
                    // sign the token add expiration days and send to the user
                    const token = jwt.sign({data:results[0]},process.env.JWT_SECRET,{expiresIn:"3m"})
                    res.json({
                        "status":1,
                        "message":"Token generated succesfully",
                        "token":token
                    })
                }             
            }
        })
    }catch (error) {
        res.json({
            "status":0,
            "message":"There was some problem in generating the token"
        })
    }
}

const generate_send_token = (res,data)=>{
    try {
        if(nullsafety(data)){
            generate_token(data,res);
        }else{
            res.json({
                "status":0,
                "message":"please make sure you provide all required fields"
            });
        }

    } catch (error) {
        res.json({
            "status":0,
            "message":"There was some problem in generating and sending the token"
        })
    }
}




router.post("/checkToken",(req,res)=>{
    try {
        const token = req.header('Authorization').split(" ")[1]; 
        const data = jwt.verify(token,process.env.JWT_SECRET); 
        res.json({
            "status":1,
            data
        })    
    } catch (error) {
        res.json({
            "status":0,
            "message":"Token verification failed"
        })
    }
    
})
router.post("/",(req,res)=>{
    try { 
        const data = req.body;
        generate_send_token(res,data)
    } catch (error) {
        res.json({
            "status":0,
            "message":"There was some problem in authentication"
        })
    }
})

module.exports = router;