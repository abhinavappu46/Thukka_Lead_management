const express=require("express");
const loginUser=require("../controller/LoginAuth");
const router =express.Router();



router.post("/Login",loginUser);


module.exports=router;
