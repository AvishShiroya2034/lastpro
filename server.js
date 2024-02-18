import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import colors from "colors";
import connectDB from "./config/db.js";
import cloudinary from "cloudinary";
//rest object
const app = express();

//dotenv
dotenv.config();

//connect Db
connectDB();

//cloudinary config
cloudinary.v2.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_SECRET,
})

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//User Routers
import userRoutes from "./routes/userRoutes.js";
app.use("/api/v1/user", userRoutes);

//Cart Router
import cartRoutes from "./routes/cartRoutes.js"
app.use("/api/v1/cart",cartRoutes)

//admin
import adminRoutes from "./routes/adminRoutes.js"
app.use("/api/v1/admin", adminRoutes);

//category , cloth and item Routes
import categoryRoutes from "./routes/categoryRoutes.js"
import clothRoutes from "./routes/clothRoutes.js"
import itemRoutes from "./routes/itemRoutes.js";
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/cloth", clothRoutes);
app.use("/api/v1/item", itemRoutes);


app.get("/", (req, res) => {
  return res.send("<h1>jay Shree Ram </h1>..");
});

const PORT = process.env.PORT || 401;

//listen
app.listen(PORT, () => {
  console.log("server run".bgGreen.black);
});
