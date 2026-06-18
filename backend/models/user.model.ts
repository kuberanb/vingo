import mongoose, { Schema, Types, type Model } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  fullName: string;
  email: string;
  password?: string;
  mobile: string;
  role: "user" | "owner" | "deliveryBoy";
  resetOtp?: string;
  otpExpired?: Date;
  isOtpVerified?: boolean;
  location?: {
    type: "Point",
    coordinates: [number, number]
  };
  socketId?: string;
  isOnline?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "owner", "deliveryBoy"],
      required: true,
    },
    resetOtp: {
      type: String,
    },
    otpExpired: {
      type: Date,
    },
    isOtpVerified: {
      type: Boolean,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    socketId: {
      type: String,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.index({ location: "2dsphere" });

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
