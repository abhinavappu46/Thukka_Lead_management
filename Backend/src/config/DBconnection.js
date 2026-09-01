const mogoose=require("mongoose");


const Dbconnect= async ()=>{
try {
await mogoose.connect(process.env.MONGO_URI);
console.log("monogodb coneected successfully")
    
} catch (error) {
    console.log(error.message);
    process.exit(1);
}



}
module.exports = Dbconnect;