import type { Request, Response } from "express";
import User from "../models/User.js";

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().select("-password -otp -otpExpiresAt");
  res.json(users);
};

// Update any user (admin only)
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  Object.assign(user, updates);
  await user.save();
  res.json({ message: "User updated" });
};

// Delete (soft delete) any user (admin only)
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.deletedAt = new Date();
  user.isActive = false;
  await user.save();

  res.json({ message: "User deleted (soft delete)" });
};

// Activate/deactivate user
export const toggleUserActive = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isActive = !user.isActive;
  await user.save();
  res.json({ message: `User ${user.isActive ? "activated" : "deactivated"}` });
};
