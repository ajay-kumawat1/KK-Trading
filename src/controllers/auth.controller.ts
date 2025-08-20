import { Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { User } from "../models/User";
import { RefreshToken } from "../models/RefreshToken";
import { env } from "../config/env";
import { addDays } from "date-fns";

function signAccessToken(id: string, role: "user" | "admin") {
  return sign({ sub: id, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

function signRefreshToken(id: string, role: "user" | "admin") {
  return sign({ sub: id, role }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

function refreshCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: env.COOKIE_SECURE,
    path: "/api/auth",
  };
}

function pickUser(u: any) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already in use" });
  const user = await User.create({ name, email, password, role: "user" });

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: addDays(new Date(), 7),
    userAgent: req.get("user-agent") || undefined,
    ip: req.ip,
  });

  res.cookie("refreshToken", refreshToken, refreshCookieOptions());
  res.status(201).json({ user: pickUser(user), accessToken });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = signAccessToken(user.id, user.role);
  const refreshToken = signRefreshToken(user.id, user.role);
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: addDays(new Date(), 7),
    userAgent: req.get("user-agent") || undefined,
    ip: req.ip,
  });

  res.cookie("refreshToken", refreshToken, refreshCookieOptions());
  res.json({ user: pickUser(user), accessToken });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Missing refresh token" });

  // Check token in DB (proof of possession)
  const stored = await RefreshToken.findOne({ token });
  if (!stored || stored.revokedAt)
    return res.status(401).json({ message: "Refresh token revoked" });

  try {
    const payload = verify(token, env.JWT_REFRESH_SECRET) as any;

    // Rotate: revoke old, issue new
    const newRefresh = signRefreshToken(payload.sub, payload.role);
    stored.revokedAt = new Date();
    stored.replacedByToken = newRefresh;
    await stored.save();

    await RefreshToken.create({
      user: payload.sub,
      token: newRefresh,
      expiresAt: addDays(new Date(), 7),
      userAgent: req.get("user-agent") || undefined,
      ip: req.ip,
    });

    const accessToken = signAccessToken(payload.sub, payload.role);
    res.cookie("refreshToken", newRefresh, refreshCookieOptions());
    return res.json({ accessToken });
  } catch {
    // Invalidate on verify failure
    await RefreshToken.updateOne(
      { token },
      { $set: { revokedAt: new Date() } }
    );
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token)
    await RefreshToken.updateOne(
      { token },
      { $set: { revokedAt: new Date() } }
    );
  res.clearCookie("refreshToken", refreshCookieOptions());
  res.json({ message: "Logged out" });
};
