import express from "express";
import colors from "colors";
import morgan  from "morgan";   
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import connectDB from "./config/db.js";
import path from "path";
import cloudinary from "cloudinary";
// const __dirname = path.resolve();


//dotenc config
dotenv.config();

//database function call
connectDB();

//cloudinary config
cloudinary.v2.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECERT,
})

const app = express();


app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use(express.static(path.join(__dirname,"uploads")))import categoryRoutes from "./routes/categoryRoutes.js";
app.use('/api/v2/user',userRoute) 
app.use('/api/v2/product',productRoutes)
app.use('/api/v2/category',categoryRoutes)
app.use('/api/v2/order',orderRoutes)



const port = process.env.PORT || 8080

app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port} on ${process.env.NODE_ENV} mode `.bgBrightBlue.white)
})
