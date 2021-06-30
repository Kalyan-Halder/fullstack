const express = require("express");
const router = express.Router();
require("../db/connection");
const user = require("../db/schema");
router.use(express.json());
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const SECTETKEY = process.env.SECRETKEY;






router.get("/",(req,res)=>{
    res.send("Home");
});
router.get("/about",(req,res)=>{
    res.send("About");
});
router.get("/contact",(req,res)=>{
    res.send("Contact");
});



// user Register
router.post("/register",async(req,res)=>{ 
     const {name,email,phone,password,conpassword} = req.body;
     if(!name || !email || !phone || !password || !conpassword){
         return res.status(422).send("Insufficient inputs..");

     }

     if(req.body.password !== req.body.conpassword){
         return res.status(404).send("Password Did Not Match");
     }

     const userExist = await user.findOne({email:email});
     
     if(userExist){
         return res.status(422).send("Email Already Exists");
     }

     try{
         const data =  new user(req.body);
         //calling a middleware to hash the password before saving and the middleware is inside schema page
         const save = await data.save();
         res.status(200).send("Data Creation Successful");
     }catch{
         console.log("Data Creation Failed");
         res.status(422).send("Data Creation Failed");
     }
});

//user login
router.post("/signin",async(req,res)=>{
      try{
            const {email,password} = req.body;
           
          // this userReal will return the whole document part that contained the email if the entered email is matched with the database email
           const userReal = await user.findOne({email:email});
           // make sure to start the contidon with ! sign(not equal)... you will know why
           if(!userReal){
              res.send("Error email");
           }else{
               //comparing the passwoed with the hashed one
            const isPassword = await bcrypt.compare(password,userReal.password);
               if(isPassword){

                   //creating a jason web token to validate the user letter and saving this inside db
                   const userToken = jwt.sign({_id:userReal._id},SECTETKEY); 
                   const upData = await user.findByIdAndUpdate({_id:userReal._id},{token:userToken});
                   await upData.save();

                   //Creating cookie to save the token in borwser for further purposes and adding a expariy date
                   res.cookie("userToken",userToken,{
                       expires: new Date(Date.now() + 850000000),
                       httpOnly:true
                   })

                   res.send("Successfull");
               }
               else{
                   res.send("Error Pass");
               }

           }
      }catch(err){
           console.log(err);
      }
});


module.exports = router;