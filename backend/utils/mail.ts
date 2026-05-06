import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASS,
  },
});

export const sendOtpMail = async ({ to, otp }) => {
  const info = await transporter.sendMail({
    from: `${process.env.EMAIL}`, // sender address
    to: to,
    subject: "Otp for password reset", // Subject line
    text: `Your OTP for password reset is: ${otp}. Otp reset in 5 minutes`, // Plain-text version of the message
    html: `<p>  <b>Your OTP for password reset is: ${otp}</b> . Otp reset in 5 minutes  <p>`, // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
};

export const sendDeliveryOtpMail = async ({ to, otp }) => {
  const info = await transporter.sendMail({
    from: `${process.env.EMAIL}`, // sender address
    to: to,
    subject: "Otp for order delivery", // Subject line
    text: `Your OTP for order delivery is: ${otp}. Otp reset in 5 minutes`, // Plain-text version of the message
    html: `<p>  <b>Your OTP for order delivery is: ${otp}</b> . Otp reset in 5 minutes  <p>`, // HTML version of the message
  });

  console.log("Message sent:", info.messageId);
};
