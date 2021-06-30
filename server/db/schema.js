const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;


const schema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    password:String,
    conpassword:String,
    token:{
        type:String,
        default:null
    },
    date:{
        type:Date,
        default: Date.now()
    }
});

//calling a middleware before 'save' the data in db 
//this middleware will be pre called before and save() method in auth.js (in /signin) and it will hash the password and conpassword if the password is modified by the user

schema.pre('save',async function(next){
     if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,saltRounds);
        this.conpassword = await bcrypt.hash(this.conpassword,saltRounds);
     }
     next();
})

const user = new mongoose.model("user",schema);

module.exports = user;