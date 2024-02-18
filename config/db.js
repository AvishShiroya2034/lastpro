import colors from "colors";
import mongoose from "mongoose";

const connectDB = async(req,res)=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('database connected'.bgMagenta.white)
    } catch (error) {
        console.log(`database error in connection ${error}`.bgRed.black)
    }
}
export default connectDB