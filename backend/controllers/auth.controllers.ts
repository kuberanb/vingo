import bcrypt from "bcryptjs";
import User from "../models/user.model";
import genToken from "../utils/token";
import { sendOtpMail } from "../utils/mail";

export const signup = async (req, res) => {
  const { fullName, email, password, mobile, role } = req.body;

  let user = await User.findOne({ email });

  try {
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (mobile.length < 10) {
      return res
        .status(400)
        .json({ message: "Mobile Number must be at least 10 digits long" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      fullName: fullName,
      email: email,
      password: hashedPassword,
      mobile: mobile,
      role: role,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  try {
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPassowrdMatch = await bcrypt.compare(password, user.password);

    if (!isPassowrdMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (isPassowrdMatch) {
      const token = await genToken(user._id);

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json(user);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Sign In Error : ${error.message}` });
  }
};

export const signOut = async (req, res) => {
  try {
    await res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Sign Out Sucessful" });
  } catch (error) {
    res.status(500).json({ message: `Sign Out Error : ${error.message}` });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and its expiration time in the database
    user.resetOtp = otp;
    user.otpExpired = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
    user.isOtpVerified = false;
    await user.save();

    // Send OTP to user's email
    await sendOtpMail({ to: email, otp: otp });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: `Send Otp Error : ${error.message}` });
  }
};

export const verifyOtp = async (req, res) => {
  const { otp, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    } else if (user.otpExpired < Date.now()) {
      return res.status(400).json({ message: "Otp Expired" });
    } else if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid Otp" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;

    await user.save();

    return res.status(200).json({ message: "Otp Verified" });
  } catch (error) {
    res.status(500).json({ message: `Verify Otp Error : ${error.message}` });
  }
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (!user.isOtpVerified) {
      return res.status(403).json({
        message: "OTP verification required before resetting password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      const newPasswordHash = await bcrypt.hash(password, 10);

      user.password = newPasswordHash;
      user.isOtpVerified = undefined;
      user.otpExpired = undefined;
      user.resetOtp = undefined;

      await user.save();

      res.status(200).json({ message: "Password Reset Sucessful" });
    } else {
      return res
        .status(400)
        .json({ message: "New password must be different from old password" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Reset Password Error : ${error.message}` });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { fullName, mobile, email, role } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: fullName,
        email: email,
        mobile: mobile,
        role: role,
      });
    }
    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Google Auth Error : ${error.message}` });
  }
};
