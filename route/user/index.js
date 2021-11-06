const express = require('express');
const router = express.Router();
const userModel = require("../../model/user/index");
// email verification need to be done

const verify_email=(email)=>{
    try {
        const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const status =  emailRegexp.test(email);
        return status;
    } catch (error) {
        return false;
    }
}
const verify_phone=(phone)=>{
    try {
        if(phone<9999999999 && phone > 6000000000) return true;
        return false;
    } catch (error) {
        return false;
    }
}
const verifyfield=(data)=>{
    try {
        const {name,email,phone,password} = data;
        if(name===undefined || email===undefined || phone ===undefined || password===undefined){
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

router.post("/signup",(req,res)=>{
    try {
        // get user parameter and do validation
        const body = req.body;
        // check for required fields
        const required_satisfied = verifyfield(data=body);
        if(required_satisfied===false){
            res.json({
                "status":1,
                "message":"please make sure every field is required"
            });
        }else{
            if(verify_email(data.email) && verify_phone(data.phone)){
                userModel(res,data);
            }else{
                res.json({
                    "status":1,
                    "message":"Make sure you provide the valid data"
                });
            }   
            
        }
        
    } catch (error) {
        res.json({
            "status":0,
            "message":"Please provide a data into proper format"
        })
    }
})

module.exports = router;