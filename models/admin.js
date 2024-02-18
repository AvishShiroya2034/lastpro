import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken'
const adminSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Email Id Is Required'],
        unique:[true,"userName Already Taken"]
    },
    email:{
        type:String,
        required:[true,'Mobile No Is Required']
    },
    password:{
        type:String,
        required:[true,'Password Is Required'],
        minLength: [6, 'pasword length should be greater than 6 character']
    },
    hint:{
        type:String,
        required:[true,'Password Hint Is Required']
    },
    role:{
        type:String,
        required:[true,'Role Is Required'] ,
        enum:["owner","receptionist"]
    }
},{timestamps:true})

//function for password hashing
adminSchema.pre("save",async function (next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
})
//function for compare password
adminSchema.methods.comparePassword = async function(plainPassword){
    return await bcrypt.compare(plainPassword,this.password)
}
//Function for the Create the token
adminSchema.methods.generateToken = function(){
    return JWT.sign({_id:this._id},process.env.JWT_SECRET,{
        expiresIn:'7d'
    });
}

const adminModel = await  mongoose.model("Admins",adminSchema)
export default adminModel