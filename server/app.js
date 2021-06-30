const express = require("express");
const app = express();
const router = require("../server/route/auth");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config({path:"./config.env"});
app.use(router);

app.use(cors());
app.use(bodyParser());

const port = process.env.PORT ;
 
app.listen(port,()=>{
    console.log(`Listening to the port no ${port}`);
})