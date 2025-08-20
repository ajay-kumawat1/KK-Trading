import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
  user: Schema.Types.ObjectId;
  token: string; // store the raw token or a hash if desired
  expiresAt: Date;
  revokedAt?: Date;
  replacedByToken?: string;
  userAgent?: string;
  ip?: string;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: { type: String, required: true, index: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date },
    replacedByToken: { type: String },
    userAgent: String,
    ip: String,
  },
  { timestamps: true }
);

export const RefreshToken = mongoose.model<IRefreshToken>(
  "RefreshToken",
  refreshTokenSchema
);
