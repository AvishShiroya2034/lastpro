import JWT from 'jsonwebtoken';
import userModel from '../models/user.js';
import adminModel from '../models/admin.js';

//getDate Using token

export const isAuth= async(req,res,next)=>{
    try{
        const {token}= req.cookies;
        //validation
        if(!token){
           return res.status(401).send({
                success:false,
                message:"anauthorized user"
            })
        }
        const decodeData =  JWT.verify(token,process.env.JWT_SECRET);
        const user = await userModel.findById(decodeData._id);
        req.user = user
        next();
    }
    catch{
        return res.status(401).send({
            success:false,
            message:"Token expire ! Login again"
        })
    }
}

export const adminIsAuth = async(req,res,next)=>{
   try{ const {admintoken} = req.cookies;
    // validation
    if(!admintoken){
        return res.status(401).send({
            success:false,
            message:"anauthorized admin"
        })
    }
    const decodeData = JWT.verify(admintoken,process.env.JWT_SECRET)
    const admin = await adminModel.findById(decodeData._id);
    // console.log(admin)
    req.admin = admin
    next();
}catch{
    return res.status(401).send({
        success:false,
        message:"Token expire ! Login again"
    })
}
}

//check the it is receptionist / owner
export const checkIsreceptionist = async(req,res,next)=>{
    if(req.admin.role == "receptionist" || req.admin.role == ""){
        return res.status(401).send({
            success:false,
            message:"This Access Only For Owner"
        })
    }
    next();
}