import mongoose, { Types } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      default: undefined, // ⬅️ this avoids null
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      default: undefined, // ⬅️ this avoids null
    },

    password: {
      type: String,
      required: function () {
        return !this.isGoogleUser;
      },
    },

    address: {
      type: String,
    },

    role: {
      type: Number,
      enum: [0, 1], // 0 - user, 1 - admin
      default: 0,
    },

    blocked: {
      type: Boolean,
      default: false,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    resetToken: String,
    resetTokenExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// ✅ Custom validator to ensure at least one of email or phone is present
userSchema.pre("validate", function (next) {
  if (!this.email && !this.phone) {
    this.invalidate("email", "Either email or phone number is required");
  }
  next();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("users", userSchema);
