import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { Types, Document } from "mongoose";
import User from "../models/User.js";
import type { IUser } from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import { sendEmail } from "../utils/sendEmail.js";

interface IUserWithId extends IUser, Document {
  _id: Types.ObjectId;
}

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const jwtSecret: string = process.env.JWT_SECRET || "";
const jwtExpiresIn: string = process.env.JWT_EXPIRES_IN || "15m";

const refreshSecret: string = process.env.REFRESH_TOKEN_SECRET || "";
const refreshExpiresIn: string = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

// Register User
export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = new User({ email, password: hashedPassword, otp, otpExpiresAt });
  await user.save();

  await sendEmail(
    email,
    "Your OTP Code",
    `Your OTP code is ${otp}. It expires in 10 minutes.`
  );

  res
    .status(201)
    .json({ message: "User registered, please verify OTP sent to email." });
};

// Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const user = (await User.findOne({ email })) as IUserWithId | null;
  if (!user) return res.status(400).json({ message: "User not found" });

  if (
    user.otp !== otp ||
    !user.otpExpiresAt ||
    user.otpExpiresAt < new Date()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.otp = "";
  user.otpExpiresAt = new Date();
  await user.save();

  res.json({ message: "OTP verified successfully. You can now login." });
};

// Login
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = (await User.findOne({ email })) as IUserWithId | null;
  if (!user || !user.isActive) {
    return res
      .status(401)
      .json({ message: "Invalid credentials or inactive user" });
  }
  if (user.otp) {
    return res
      .status(401)
      .json({ message: "Please verify your OTP before login" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const payload = { userId: user._id.toString(), roles: user.roles };
  const accessToken = jwt.sign(payload, jwtSecret as string, {
    expiresIn: jwtExpiresIn,
  });

  const refreshTokenValue = crypto.randomBytes(40).toString("hex");
  const refreshToken = new RefreshToken({
    userId: user._id,
    token: refreshTokenValue,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await refreshToken.save();

  res.json({ accessToken, refreshToken: refreshTokenValue });
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: refreshTokenValue } = req.body;
  if (!refreshTokenValue)
    return res.status(400).json({ message: "Refresh token required" });

  const storedToken = await RefreshToken.findOne({ token: refreshTokenValue });
  if (!storedToken || storedToken.expiresAt < new Date()) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }

  const user = (await User.findById(storedToken.userId)) as IUserWithId | null;
  if (!user || !user.isActive)
    return res.status(403).json({ message: "User not found or inactive" });

  const payload = { userId: user._id.toString(), roles: user.roles };
  const accessToken = jwt.sign(payload, jwtSecret as string, {
    expiresIn: jwtExpiresIn,
  });

  res.json({ accessToken });
};

// Logout
export const logoutUser = async (req: Request, res: Response) => {
  const { refreshToken: refreshTokenValue } = req.body;
  if (!refreshTokenValue)
    return res.status(400).json({ message: "Refresh token required" });

  await RefreshToken.deleteOne({ token: refreshTokenValue });
  res.json({ message: "Logged out successfully" });
};
