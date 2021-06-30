const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path:"../server/config.env"});

const DB = process.env.DATABASE;

const serverCreate = async()=>{
    try{
           const server = await mongoose.connect(DB,{useCreateIndex:true,useFindAndModify:false,useNewUrlParser:true,useUnifiedTopology:true});
           console.log("Server Connected");
    }catch{
           console.log("Server Unable to connect")
    }
}

serverCreate();