import { Schema, model, Document } from "mongoose";

export interface IRefreshToken extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default model<IRefreshToken>("RefreshToken", refreshTokenSchema);
