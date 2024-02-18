import express from 'express';
import { checkVerification, createUserController, forgetPasswordCheckVerification, forgetPasswordOtpController, getUserDetailController, resetPasswordController, updateForgetPasswordController, updateUserController, userLoginController, userLogoutController } from '../controller/userController.js';
import { isAuth } from '../middlewares/authMiddleware.js';
const router = express.Router();

//create user
router.post('/register',createUserController)
//Check OTP
router.post('/verification',checkVerification)
//login user
router.post('/login',userLoginController)
//get User Details
router.get('/detail',isAuth,getUserDetailController)
//logout
router.get('/logout', isAuth,userLogoutController)
//Update Profile
router.put('/update',isAuth,updateUserController)
//Update Password
router.put('/reset-password',isAuth,resetPasswordController)
//Forgot Password OTP
router.post('/forget-password/email',forgetPasswordOtpController)
//Forget Password OTP verified
router.post('/forget-password/verification',forgetPasswordCheckVerification)
//Forget Password Update
router.put('/forget-password/update',updateForgetPasswordController)

export default router