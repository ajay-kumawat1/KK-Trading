import type { Request, Response } from "express";
import User from "../models/User.js";

// Get logged in user profile
export const getProfile = async (
  req: Request & { user?: any },
  res: Response
) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const user = await User.findById(req.user.userId).select(
    "-password -otp -otpExpiresAt"
  );
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Update user profile
export const updateProfile = async (
  req: Request & { user?: any },
  res: Response
) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const updates = req.body;
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  Object.assign(user, updates);
  await user.save();
  res.json({ message: "Profile updated" });
};

// Change password
export const changePassword = async (
  req: Request & { user?: any },
  res: Response
) => {
  const { oldPassword, newPassword } = req.body;
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const bcrypt = await import("bcrypt");
  const isValid = await bcrypt.compare(oldPassword, user.password);
  if (!isValid)
    return res.status(400).json({ message: "Old password does not match" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password changed successfully" });
};

// Soft delete user
export const deleteUser = async (
  req: Request & { user?: any },
  res: Response
) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.deletedAt = new Date();
  user.isActive = false;
  await user.save();

  res.json({ message: "User account deactivated" });
};
