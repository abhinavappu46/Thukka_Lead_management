const express=require("express");
const registerUser=require("../controller/RegisterAuth");


const router=express.Router();

router.post("/register",registerUser);


module.exports=router;
