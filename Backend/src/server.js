const express = require("express");
const app = express();
const dotenv = require("dotenv");
const Dbconnect = require("./config/DBconnection");
const cors = require("cors");
const Registeroute = require("./routes/Registeroute");
const LoginRoute = require("./routes/LoginRoute");
const UsersRoute = require("./routes/UserRoute");
const EnquiryRoute = require("./routes/EnquiryRoute");

dotenv.config();
app.use(cors());
app.use(express.json());

Dbconnect();


app.use("/api/auth", Registeroute);
app.use("/api/auth", LoginRoute);
app.use("/api/user", UsersRoute);
app.use("/api/Enquiry", EnquiryRoute)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});