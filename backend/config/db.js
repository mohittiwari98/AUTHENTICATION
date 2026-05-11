import mongoose from "mongoose";
const connectDB=async()=>{
  try{
    await mongoose.connect(process.env.MONGOURL);
    console.log("mongodb connected successfully");
  }
  catch(e){
    console.error("mongodb error",e)
  }
}
export default connectDB;
