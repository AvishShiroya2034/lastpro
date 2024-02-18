import express from "express";
import {
  adminDetailController,
  adminLogoutController,
  adminPasswordHintController,
  adminResetPasswordController,
  loginAdminController,
  registerAdminController,
  updateAdminController,
} from "../controller/adminController.js";
import { adminIsAuth } from "../middlewares/authMiddleware.js";
const router = express.Router();

//registeration
router.post("/register", registerAdminController);
//login
router.post("/login", loginAdminController);
//Get A Hint Of a password
router.get("/getHint", adminPasswordHintController);
//details
router.get("/detail", adminIsAuth, adminDetailController);
//logout
router.get("/logout", adminIsAuth, adminLogoutController);
//Update
router.put("/update", adminIsAuth, updateAdminController);
//Reset Admin Password Using Old Password
router.put("/reset-password", adminIsAuth, adminResetPasswordController);

export default router;
