import { Response } from "express";
import { AuthedRequest } from "../middleware/auth";
import { User } from "../models/User";

const pick = (u: any) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
});

export const getMe = async (req: AuthedRequest, res: Response) => {
  const me = await User.findById(req.user!.sub);
  if (!me) return res.status(404).json({ message: "User not found" });
  res.json({ user: pick(me) });
};

export const updateMe = async (req: AuthedRequest, res: Response) => {
  const { name, email, password } = req.body;
  const me = await User.findById(req.user!.sub);
  if (!me) return res.status(404).json({ message: "User not found" });
  if (name) me.name = name;
  if (email) me.email = email;
  if (password) me.password = password;
  await me.save();
  res.json({ user: pick(me) });
};

export const deleteMe = async (req: AuthedRequest, res: Response) => {
  await User.findByIdAndDelete(req.user!.sub);
  res.status(204).send();
};
