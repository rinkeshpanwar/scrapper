const express = require("express");
const server = express();
const bodyparser = require("body-parser");
const flipkart = require('./route/flipkart/app');
const user = require("./route/user/index");
const auth = require("./route/auth/index");
const port = 8000;

server.use(express.json());

// user route
server.use("/user",user);

// authentication process
server.use("/auth",auth);

// flipkart rout
server.use("/",flipkart); 


// company api
server.listen(port,()=>{
    try {   
        console.log("server is listening");    
    } catch (error) {
        console.log("error was",error);
    }
    
})