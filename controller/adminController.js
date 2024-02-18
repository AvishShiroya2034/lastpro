import adminModel from "../models/admin.js"

//admin registration
export const registerAdminController = async (req,res)=>{
    try {
        const {name,email,password,hint,role} = req.body
        const checkAdmin = await adminModel.findOne({name:name})
        if(checkAdmin){
            return res.status(401).send({
                success:false,
                message:"userName Already Taken"
            })
        }
        if(!role=="owner"||!role=="receptionist" || role == "") {
            return res.status(401).send({
                success:false,
                message:"Role Must Be 'owner' and 'receptionist'"
            })
        }
        if(password == hint ){
            return res.status(401).send({
                success:false,
                message:"Role and Password Doesn't Same "
            })
        }
        if(!name  || !email || !password || !hint ||!role){
            return res.status(401).send({
                success:false,
                message:"All Field Must Be Required"
            
            })
        }
        const admin = new adminModel ({
            name,email,password,hint,role
        })
        await admin.save();
        res.status(200).send({
            success:true,
            message:`Admin Created as ${role} `,
            admin
        })
    } catch (error) {
        console.log(error)
        res.status(401).send({
            success:false,
            message:"Error Admin Created API",
            error
        })
    }
}

//admin login
export const loginAdminController = async (req,res)=>{
    try {
        const { name, password } = req.body;
    //validation
    if (!name || !password) {
      return res.status(404).send({
        success: false,
        message: "Please Enter Name And Password Both",
      });
    }
    const admin = await adminModel.findOne({ name });
    if (!admin) {
      return res.status(404).send({
        success: false,
        message: "Admin Not Found",
      });
    }
    
    //check password
    const isMatch = await admin.comparePassword(password);
    //validation match
    if (!isMatch) {
      return res.status(404).send({
        success: false,
        message: "Password Not Match",
      });
    }
    //token
    const token = admin.generateToken();

    res
      .status(200)
      .cookie("admintoken", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "login successfully",
        token,
        admin,
      });

    } catch (error) {
        console.log(error)
        res.status(401).send({
            success:false,
            message:"Error Admin Login API",
            error
        })
    }
}

//get a hint for password
export const adminPasswordHintController = async(req,res)=>{
    try {
        const {name,email} = req.body
        if(!name || !email){
            return res.status(401).send({
                success:false,
                message:"All Fields Are Must Be Required"
            })
        }
        const admin = await adminModel.findOne({name,email})
        if(!admin)
        {
            return res.status(401).send({
                success:false,
                message:"Admin Not Exists"
            })
        }
        res.status(200).send({
            success:true,
            message:"Admin Hint",
            hint:admin.hint
        })
    } catch (error) {
        console.log(error)
        res.status(401).send({
            success:false,
            message:"Error in Admin Password Hint API",
            error
        })
    }
}

//get details of admin
export const adminDetailController = async(req,res)=>{
    try {
        const admin = await adminModel.findById(req.admin._id);
        res.status(200).send({
            success:true,
            message:"Admin Details",
            admin
        })
    } catch (error) {
        console.log(admin)
        res.status(401).send({
            success:false,
            message:"Error In Admin Details API",
            error
        })
    }
}
//get details of admin
export const adminLogoutController = async(req,res)=>{
    try {
        res
          .status(200)
          .cookie("admintoken", "", {
            expires: new Date(Date.now()),
            secure: process.env.NODE_ENV === "development" ? true : false,
            httpOnly: process.env.NODE_ENV === "development" ? true : false,
            sameSite: process.env.NODE_ENV === "development" ? true : false,
          })
          .send({
            success: true,
            message: "LogOut Successfully",
          });
      } catch (error) {
        console.log(`${error}`.bgRed.rainbow);
        res.status(500).send({
          success: false,
          message: "Error In Logout User Api",
          error,
        });
      }
}
//admin Update
export const updateAdminController = async (req,res)=>{
    try {
        const {name,email} = req.body
        const admin = await adminModel.findById(req.admin._id);
        if(!admin){
           return res.status(401).send({
                success:false,
                message:"User not Exists"
            })
        }
        const checkName = await adminModel.findOne({name});
        if(checkName){
            return res.status(401).send({
                success:false,
                message:"userName is Already Taken"
            })
        }
        if(name) admin.name = name
        if(email) admin.email = email
        await admin.save();
        res.status(200).send({
            success:true,
            message:"User Update Successfully",
            admin
        })

    } catch (error) {
        console.log(error)
        res.status(401).send({
            success:false,
            message:"Error in admin Update API"
        })
    }
}

//admin Password reset
export const adminResetPasswordController = async(req,res)=>{
    try {
        const {oldPassword,newPassword,newHint} = req.body
        if(!oldPassword||!newPassword||!newHint){
            return res.status(401).send({
                success:false,
                message:"All Fields Must Be Required"
            })
        }
        const admin = await adminModel.findById(req.admin._id)
        if(!admin){
            return res.status(401).send({
                success:false,
                message:"Admin Not Exists"
            })
        }
        if(oldPassword == newPassword){
            return res.status(401).send({
                success:false,
                message:"Old And New Password Aren't Same"
            })
        }
        const matchPassword = await admin.comparePassword(oldPassword)
        if(!matchPassword){
            return res.status(401).send({
                success:false,
                message:"oldPassword Not Match"
            })
        }
        if(newPassword) admin.password = newPassword;
        if(newHint) admin.hint = newHint;
        await admin.save();
        res.status(200).send({
            success:true,
            message:"Admin Password Successfully Reset",
            admin
        })
    } catch (error) {
        console.log(error)
        res.status(200).send({
            success:true,
            message:"Error in Reset Password Api",
            error
        })
    }
}