// User model: Mongoose schema for user accounts synced from Firebase Auth
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      default: "",
      trim: true,
    },
    photoURL: {
      type: String,
      default: "",
    },
    provider: {
      type: String,
      enum: ["google", "email"],
      default: "email",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const User = mongoose.model("User", userSchema);
export default User;
