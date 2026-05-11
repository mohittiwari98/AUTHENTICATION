import express from "express";
import dotenv from "dotenv";
import connectDB from "config/db.js";
import authRoute from "../routes/auth.route.js";
connectDB();
dotenv.config();
const app=express();
app.use(express.json());
app.use("/api",authRoute);

const port=process.env.PORT|| 5000;
app.listen(port,()=>{
  console.log(`port is running at ${port}`)
});
