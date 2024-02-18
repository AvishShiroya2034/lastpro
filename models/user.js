import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken'
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name Is Required']
    },
    email:{
        type:String,
        required:[true,'Email Id Is Required'],
        unique:[true,'Email is Already taken']
    },
    mobile:{
        type:String,
        required:[true,'Mobile No Is Required']
    },
    password:{
        type:String,
        required:[true,'Password Is Required'],
        minLength: [6, 'pasword length should be greater than 6 character']
    },
    address:{
        type:String
    },
    landmark:{
        type:String
    },
    pincode:{
        type:Number
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    },
},{timestamps:true})

//function for password hashing
userSchema.pre("save",async function (next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
})
//function for compare password
userSchema.methods.comparePassword = async function(plainPassword){
    return await bcrypt.compare(plainPassword,this.password)
}
//Function for the Create the token
userSchema.methods.generateToken = function(){
    return JWT.sign({_id:this._id},process.env.JWT_SECRET,{
        expiresIn:'7d'
    });
}

const userModel = await  mongoose.model("Users",userSchema)
export default userModel