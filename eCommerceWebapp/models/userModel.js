import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // allows multiple nulls
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true, // allows multiple nulls
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

export default mongoose.model("users", userSchema);
