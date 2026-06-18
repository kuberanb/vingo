import express from "express";
import {
  signIn,
  signOut,
  signup,
  sendOtp,
  verifyOtp,
  resetPassword,
  googleAuth,
} from "../controllers/auth.controllers";

const authRouter = express.Router();

authRouter.post("/signup", signup);

authRouter.post("/signin", signIn);

authRouter.get("/signout", signOut);

authRouter.post("/send-otp", sendOtp);

authRouter.post("/verify-otp", verifyOtp);

authRouter.post("/reset-password", resetPassword);

authRouter.post("/google-auth", googleAuth);

export default authRouter;
