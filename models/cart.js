import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Items',
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    total:{
        type:Number,
        required:true,
    }
},{timestamps:true})

const cartModel = await mongoose.model("Cart",cartSchema)
export default cartModel