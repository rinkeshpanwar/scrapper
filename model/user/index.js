const conn = require("../../conn/index");


const insertdata = (res,data)=>{
    try {
        const {name,email,phone,password}=data;
        conn.query("SELECT * FROM user WHERE email=? OR phone = ?   ",[email,phone],(err,results,fields)=>{
            if (err){
                res.json({
                    "status":0,
                    "message":"There was some problem in finding the user"
                });
            }else{
                if(results.length>0){
                    res.json({
                        "status":0,
                        "message":"You are already registered"
                    }); 
                }else{
                    conn.query("INSERT INTO user(name,email,password,phone) VALUES(?,?,?,?)",[name,email,phone,password],(err,results,fields)=>{
                        if(err){
                            res.json({
                                "status":0,
                                "message":"There was some problem in adding the data"
                            });
                        }else{
                            res.json({
                                "status":1,
                                "message":"Thank you you can login now"
                            });
                            
                        }
                    })
                }
            }
        })
    } catch (error) {
        
    }
}
const create_user =(res,data)=>{
    try {
        insertdata(res,data);
          
    } catch (error) {
        res.json({
            "Status":0,
            "message":"There was some problem from server end"
        })
    }
}

module.exports = create_user;