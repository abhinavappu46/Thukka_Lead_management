const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const User=require("../model/user.js");


const LoginUser= async (req,res)=>{
    try{
    
const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }
         const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email "
            });
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );
if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }
const status = await user.status;
if(status != "active"){
    return res.status(401).json({
        message: "Your account has been deactivated. Please contact admin."
    });
}
const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    }catch(error){
       res.status(500).json({
            message: "Server error",
            error: error.message
        });
        console.log(error);

    }
};
module.exports=LoginUser;