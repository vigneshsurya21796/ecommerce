const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const colors = require("colors");
const PORT = process.env.PORT || 5000;
const userrouter = require("./BACKEND/routes/userroutes");
const orderrouter = require("./BACKEND/routes/orderroutes");
const paymentrouter = require("./BACKEND/routes/paymentroutes");
const adminrouter = require("./BACKEND/routes/adminroutes");
const productRouter = require("./BACKEND/routes/productroutes");
const { errorhandler } = require("./BACKEND/middleware/errorhandler");

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    // In development, allow any localhost origin regardless of port
    if (process.env.NODE_ENV !== "production") return callback(null, true);
    // In production, check against allowedOrigins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/users", userrouter);
app.use("/orders", orderrouter);
app.use("/payment", paymentrouter);
app.use("/admin", adminrouter);
app.use("/products", productRouter);
const connectDB = require("./BACKEND/DB/db");
const { urlencoded } = require("express");
connectDB();
app.use(errorhandler);

app.listen(PORT, () =>
  console.log(`server is running on port ${PORT}`.underline.cyan)
);
