const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
var cors = require("cors");

const colors = require("colors");
const PORT = process.env.PORT || 5000;
// const connect = require("./DB/db");
const router = require("./BACKEND/routes/router");
const userrouter = require("./BACKEND/routes/userroutes");
const { errorhandler } = require("./BACKEND/middleware/errorhandler");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/goals", router);
app.use(cors());
app.use("/users", userrouter);
const connectDB = require("./BACKEND/DB/db");
const { urlencoded } = require("express");
connectDB();
app.use(errorhandler);

app.listen(PORT, () =>
  console.log(`server is running on port ${PORT}`.underline.cyan)
);
