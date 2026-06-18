import bcrypt from "bcryptjs";
import User from "../models/user.model";
import genToken from "../utils/token";
import { sendOtpMail } from "../utils/mail";
import { Request, Response } from "express";

interface SignupBody {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  role: string;
}

interface SignInBody {
  email: string;
  password: string;
}

interface SendOtpBody {
  email: string;
}

interface verifyOtpBody {
  email: string;
  otp: string;
}

interface ResetPasswordBody {
  email: string;
  password: string;
}

interface GoogleAuthBody {
  fullName: string;
  mobile: string;
  email: string;
  role: string;
}


export const signup = async (req: Request<{}, {}, SignupBody>, res: Response) => {
  const { fullName, email, password, mobile, role } = req.body;


  try {
    let user = await User.findOne({ email });

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

export const signIn = async (req: Request<{}, {}, SignInBody>, res: Response) => {
  const { email, password } = req.body;


  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPassowrdMatch = await bcrypt.compare(password, user.password);

    if (!isPassowrdMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (isPassowrdMatch) {
      const token = await genToken(user._id.toString());

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json(user);
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Sign In Error : ${error.message}` });
  }
};

export const signOut = async (req: Request, res: Response): Promise<void> => {
  try {
    await res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Sign Out Sucessful" });
  } catch (error: any) {
    res.status(500).json({ message: `Sign Out Error : ${error.message}` });
  }
};

export const sendOtp = async (req: Request<{}, {}, SendOtpBody>, res: Response) => {
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
    user.otpExpired = new Date(Date.now() + 5 * 60 * 1000); // otp expires in 5 mins
    user.isOtpVerified = false;
    await user.save();

    // Send OTP to user's email
    await sendOtpMail({ to: email, otp: otp });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: `Send Otp Error : ${error.message}` });
  }
};

export const verifyOtp = async (req: Request<{}, {}, verifyOtpBody>, res: Response) => {
  const { otp, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    } else if (!user.otpExpired || user.otpExpired.getTime() < Date.now()) {
      return res.status(400).json({ message: "Otp Expired" });
    } else if (user.resetOtp.toString() !== otp.toString()) {
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

export const resetPassword = async (req: Request<{}, {}, ResetPasswordBody>, res: Response) => {
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

export const googleAuth = async (req: Request<{}, {}, GoogleAuthBody>, res: Response) => {
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
