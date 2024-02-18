import colors from "colors";
import userModel from "../models/user.js";
import { sendMailOtp } from "../utils/mailOTP.js";
import { otpGenerate } from "../utils/otpGenerator.js";
//Create User
export const createUserController = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    //validation
    if (!name || !email || !mobile || !password) {
      return res.status(404).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    //check the email is unique
    const checkEmail = await userModel.findOne({ email });
    if (checkEmail) {
      if (checkEmail.isVerified === true) {
        return res.status(401).send({
          success: false,
          message: "Email Is Already Taken ! Please Provide Another Email",
        });
      } else {
        const OTP = otpGenerate();
        const sendMail = await sendMailOtp(email, OTP);
        return res
          .status(200)
          .cookie(
            "verification",
            { OTP: OTP, _id: checkEmail._id },
            {
              expires: new Date(Date.now() + 5 * 60 * 1000),
              secure: process.env.NODE_ENV === "development" ? true : false,
              httpOnly: process.env.NODE_ENV === "development" ? true : false,
              sameSite: process.env.NODE_ENV === "development" ? true : false,
            }
          )
          .send({
            success: true,
            message:
              "You Already Register! Please verified Your Email With OTP",
            checkEmail,
          });
      }
    }
    //create
    const user = await userModel.create({
      name,
      email,
      mobile,
      password,
    });
    const OTP = otpGenerate();
    const sendMail = await sendMailOtp(email, OTP);

    res
      .status(200)
      .cookie(
        "verification",
        { OTP: OTP, _id: user._id },
        {
          expires: new Date(Date.now() + 5 * 60 * 1000),
          secure: process.env.NODE_ENV === "development" ? true : false,
          httpOnly: process.env.NODE_ENV === "development" ? true : false,
          sameSite: process.env.NODE_ENV === "development" ? true : false,
        }
      )
      .send({
        success: true,
        message: "User Created Successfully",
        user,
      });
  } catch (error) {
    console.log(`${error}`.bgRed.rainbow);
    res.status(500).send({
      success: false,
      message: "Error In Create User Api",
      error,
    });
  }
};

//Check OTP Match OR Not
export const checkVerification = async (req, res) => {
  try {
    const { verification } = req.cookies;
    console.log(verification);

    if (!verification) {
      return res.status(401).send({
        success: false,
        message: "Your Otp Is Expired !",
      });
    }
    //check Otp
    console.log(req.body.otp == verification.OTP);
    if (req.body.otp == verification.OTP) {
      //isVerified Update
      const user = await userModel.findById(verification._id);
      const isVerified = true;
      if (isVerified) user.isVerified = isVerified;
      //save user;
      await user.save();
      if (!user.isVerified) {
        return res.status(401).send({
          success: false,
          message: "Please Try Again!",
        });
      }
      console.log(user);
    }
    res.status(200).send({
      success: true,
      message: "User Is Verified Successfully",
    });
  } catch (error) {
    console.log(`${error}`.bgRed.rainbow);
    res.status(500).send({
      success: false,
      message: "Error In Verification User Api",
      error,
    });
  }
};

//Login User With The If authentication True or False
export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Please Enter Email And Password Both",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }
    console.log(user.isVerified);
    if (!user.isVerified) {
      return res.status(404).send({
        success: false,
        message: "User Is Not Verified",
      });
    }
    //check password
    const isMatch = await user.comparePassword(password);
    //validation match
    if (!isMatch) {
      return res.status(404).send({
        success: false,
        message: "Password Not Match",
      });
    }
    //token
    const token = user.generateToken();

    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
        sameSite: process.env.NODE_ENV === "development" ? true : false,
      })
      .send({
        success: true,
        message: "login successfully",
        token,
        user,
      });
  } catch (error) {
    console.log(`${error}`.bgRed.rainbow);
    res.status(500).send({
      success: false,
      message: "Error In Login User Api",
      error,
    });
  }
};

//Get User Details
export const getUserDetailController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    res.status(200).send({
      success: true,
      message: "User Deatiled",
      user,
    });
  } catch (error) {
    console.log(`${error}`.bgRed.rainbow);
    res.status(500).send({
      success: false,
      message: "Error In Login User Api",
      error,
    });
  }
};

//logout
export const userLogoutController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
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
};

//UPDATE USER PROFILE
export const updateUserController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User Not Exist",
      });
    }
    const { name,  mobile, address, landmark, pincode, city, state } =
      req.body;
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (address) user.address = address;
    if (landmark) user.landmark = landmark;
    if (pincode) user.pincode = pincode;
    if (city) user.city = city;
    if (state) user.state = state;
    //save user data
    await user.save();
    res.status(200).send({
      success: true,
      message: "User Profile Update Successfully",
    });
  } catch (error) {
    console.log(`${error}`.bgRed.rainbow);
    res.status(500).send({
      success: false,
      message: "Error In Update User Api",
      error,
    });
  }
};

//RESET PASSWORD
export const resetPasswordController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "USER NOT FOUND",
      });
    }
    const { oldPassword, newPassword } = req.body;
    if (oldPassword === newPassword) {
      return res.status(401).send({
        success: false,
        message: "Old and New Password Are Can Not Be Match",
      });
    }
    //check password
    const isMatch = await user.comparePassword(oldPassword);
    //validation match
    if (!isMatch) {
      return res.status(404).send({
        success: false,
        message: "Old Password Not Match",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(`${error}`.bgRed.rainbow);
    res.status(500).send({
      success: false,
      message: "Error In Update User Api",
      error,
    });
  }
};

//send email for the forgot password
export const forgetPasswordOtpController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(401).send({
        success: false,
        message: "Please Provide Existing Email",
      });
    }
    const OTP = otpGenerate();
    const sendMail = await sendMailOtp(email, OTP);

    res
      .status(200)
      .cookie(
        "verification",
        { OTP: OTP, _id: user._id },
        {
          expires: new Date(Date.now() + 5 * 60 * 1000),
          secure: process.env.NODE_ENV === "development" ? true : false,
          httpOnly: process.env.NODE_ENV === "development" ? true : false,
          sameSite: process.env.NODE_ENV === "development" ? true : false,
        }
      )
      .send({
        success: true,
        message: "User Created Successfully",
        user,
      });
  } catch (error) {
    console.log(`${error}`.bgRed.rainbow);
    res.status(500).send({
      success: false,
      message: "Error In Send Email For The Forget Password",
      error,
    });
  }
};

//Forge Password OTP verifications
export const forgetPasswordCheckVerification = async (req, res) => {
  try {
    const { verification } = req.cookies;
    console.log(verification);

    if (!verification) {
      return res.status(401).send({
        success: false,
        message: "Your Otp Is Expired !",
      });
    }
    //check Otp
    console.log(req.body.otp == verification.OTP);
    if (req.body.otp == verification.OTP) {
      //isVerified Update
      return res
        .status(200)
        .cookie(
          "isVerified",
          { status: true, id: verification._id },
          {
            expires: new Date(Date.now() + 20 * 60 * 1000),
            secure: process.env.NODE_ENV === "development" ? true : false,
            httpOnly: process.env.NODE_ENV === "development" ? true : false,
            sameSite: process.env.NODE_ENV === "development" ? true : false,
          }
        )
        .send({
          success: true,
          message: "Email Verified",
        });
    } 
    else {
      return res.status(401).send({
        success: false,
        message: "Your Otp Is Not Right !",
      });
    }
    


 
  } catch (error) {
    console.log(`${error}`.bgRed.rainbow);
    res.status(500).send({
      success: false,
      message: "Error In Verification User Api",
      error,
    });
  }
};

// Forget Password Update

export const updateForgetPasswordController = async (req,res)=>{
  try {
    const {isVerified} = req.cookies;
    console.log(isVerified);
    const {password} = req.body;
    if(!password){
      return res.status(401).send({
        success:false,
        message:"Please Provide Password"
      })
    }
    if(isVerified.status){
      const user = await userModel.findById({_id:isVerified.id});
      user.password = password
      await user.save();
      res.status(200).send({
        success: true,
        message: "Password Updated Successfully",
      });
    }
  } catch (error) {
    console.log(`${error}`.bgRed.rainbow);
    res.status(500).send({
      success: false,
      message: "Error In Update User Api",
      error,
    });
  }
}