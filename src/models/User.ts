import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  roles: string[];
  otp?: string;
  otpExpiresAt?: Date;
  isActive: boolean;
  deletedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: [String], default: ["user"] },
    otp: String,
    otpExpiresAt: Date,
    isActive: { type: Boolean, default: true },
    deletedAt: Date,
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
