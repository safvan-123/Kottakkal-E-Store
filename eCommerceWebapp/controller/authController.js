import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import { sendResetToken } from "../utils/sendResetToken.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // ✅ Field validation
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    if (!email && !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Email or phone is required" });
    }

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    // ✅ Check if user exists
    const queryConditions = [];
    if (email) queryConditions.push({ email });
    if (phone) queryConditions.push({ phone });

    const existingUser = await userModel.findOne({ $or: queryConditions });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already registered. Please login.",
      });
    }

    // ✅ Hash password
    const hashedPassword = await hashPassword(password);
    console.log("🔐 Plain password:", password);
    console.log("🔐 Hashed password:", hashedPassword);

    // ✅ Construct userData safely
    const userData = {
      name,
      password: hashedPassword,
      address,
      isGoogleUser: false,
    };

    // ✅ Add email/phone only if valid strings
    if (typeof email === "string" && email.trim() !== "") {
      userData.email = email.trim().toLowerCase();
    }

    if (typeof phone === "string" && phone.trim() !== "") {
      userData.phone = phone.trim();
    }

    // ✅ Hard remove undefined/null email/phone
    if (userData.email == null) delete userData.email;
    if (userData.phone == null) delete userData.phone;

    console.log("final userData", userData);

    // ✅ Save user
    const user = new userModel(userData);
    await user.save();
    console.log("✅ User saved in DB:", user);

    // ✅ Success response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        ...(user.email && { email: user.email }),
        ...(user.phone && { phone: user.phone }),
        address: user.address,
        role: user.role,
        blocked: user.blocked,
        isGoogleUser: user.isGoogleUser,
      },
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

// export const loginController = async (req, res) => {
//   try {
//     const { contact, password } = req.body; // contact = email or phone

//     if (!contact || !password) {
//       return res.status(400).send({
//         success: false,
//         message: "Email or phone and password are required",
//       });
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const query = emailRegex.test(contact)
//       ? { email: contact.toLowerCase().trim() }
//       : { phone: contact.trim() };

//     // Check user
//     const user = await userModel.findOne(query);
//     console.log("find user", user);

//     if (!user) {
//       return res.status(404).send({
//         success: false,
//         message: "Account not found. Please register.",
//       });
//     }

//     // Disallow traditional login for Google users
//     if (user.isGoogleUser) {
//       return res.status(401).send({
//         success: false,
//         message:
//           'This account was registered with Google. Please use "Sign in with Google".',
//       });
//     }

//     // Compare password
//     const match = await comparePassword(password, user.password);
//     console.log("🧠 Comparing:", password, "vs", user.password);
//     console.log("🔍 Match result:", match);

//     if (!match) {
//       console.log("❌ Invalid password for:", contact);
//       return res.status(401).send({
//         success: false,
//         message: "Invalid password",
//       });
//     }

//     // Generate token
//     const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.status(200).send({
//       success: true,
//       message: "Login successful",
//       user: {
//         _id: user._id,
//         name: user.name,
//         ...(user.email ? { email: user.email } : {}),
//         ...(user.phone ? { phone: user.phone } : {}),
//         address: user.address,
//         role: user.role,
//         blocked: user.blocked,
//         isGoogleUser: user.isGoogleUser,
//       },
//       token,
//     });
//   } catch (error) {
//     console.log("❌ Login error:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error in login",
//       error: error.message,
//     });
//   }
// };
//
export const loginController = async (req, res) => {
  try {
    const { contact, password } = req.body;

    if (!contact || !password) {
      return res.status(400).send({
        success: false,
        message: "Email/phone and password are required",
      });
    }

    // Determine if contact is email or phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const query = emailRegex.test(contact)
      ? { email: contact.toLowerCase().trim() }
      : { phone: contact.trim() };

    // Find user
    const user = await userModel.findOne(query);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Account not found. Please register.",
      });
    }

    // Disallow password login for Google accounts
    if (user.isGoogleUser) {
      return res.status(401).send({
        success: false,
        message:
          'This account was registered with Google. Please use "Sign in with Google".',
      });
    }

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }

    // ✅ Generate short-lived Access Token
    const accessToken = JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // only valid for 15 minutes
    );

    // ✅ Generate long-lived Refresh Token
    const refreshToken = JWT.sign(
      { _id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" } // valid for 7 days
    );

    // Store refresh token in httpOnly cookie (secure from JS access)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use HTTPS in prod
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response with access token + user data
    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        blocked: user.blocked,
        isGoogleUser: user.isGoogleUser,
      },
      accessToken, // frontend will use this
    });
  } catch (error) {
    console.log("❌ Login error:", error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

// ✅ Refresh Token Controller
export const refreshTokenController = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });
    }

    JWT.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid refresh token" });
      }

      // Issue new access token
      const newAccessToken = JWT.sign(
        { _id: decoded._id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.json({
        success: true,
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error refreshing token", error });
  }
};

// POST /api/v1/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { contact } = req.body;
  console.log(contact);

  if (!contact) {
    return res.status(400).json({ message: "Email or phone is required." });
  }

  const user = await userModel.findOne({
    $or: [{ email: contact }, { phone: contact }],
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 1000 * 60 * 30; // 30 mins
  await user.save();

  await sendResetToken({ user, token });

  res.status(200).json({ message: "Reset link has been sent." });
};

// POST /api/v1/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  console.log("🔐 Incoming token:", token);
  console.log("🕒 Current time:", new Date());
  const user = await userModel.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    console.log("❌ No valid user found with token or token expired");
    return res.status(400).json({ message: "Invalid or expired token." });
  }
  const hashedPassword = await hashPassword(password);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.status(200).json({ message: "Password has been reset successfully." });
};

//test controller
export const testController = (req, res) => {
  console.log("Protected routes");
  res.send("Protected routes");
};

// Controller to get all users
export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password -answer");
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

export const updateUserRoleController = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (role === undefined || (role !== 0 && role !== 1)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be 0 (user) or 1 (admin).",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      id,
      { role },
      { new: true, select: "-password -answer" }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Role updated to ${user.role === 1 ? "Admin" : "User"}`,
      user,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({
      success: false,
      message: "Error updating role",
      error: error.message,
    });
  }
};

export const toggleBlockStatusController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Toggle the blocked status
    user.blocked = !user.blocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User has been ${user.blocked ? "blocked" : "unblocked"}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        blocked: user.blocked,
        isGoogleUser: user.isGoogleUser,
      },
    });
  } catch (error) {
    console.error("Error toggling block status:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling block status",
      error: error.message,
    });
  }
};

//delete user
export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

//single user
export const getUserDetailsController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id).select("-password -answer");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details",
      error: error.message,
    });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginController = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await userModel.findOne({ email });

    if (!user) {
      // User does not exist, create a new one
      // Generate a secure random password for non-traditional login
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await hashPassword(randomPassword);

      user = await new userModel({
        name,
        email,
        googleId,
        password: hashedPassword,
        phone: "",
        address: "",
        answer: "",
        isGoogleUser: true,
      }).save();
    } else {
      // User exists, but might not have googleId (e.g., if they first registered with email)
      // If existing user does not have googleId, update it
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
      // If user is a traditional user and now logging in with Google, you might want to link accounts.
      // For now, if they are not marked as a Google user, we mark them if email matches
      if (!user.isGoogleUser) {
        user.isGoogleUser = true;
        await user.save();
      }
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Google login successful",
      user: {
        // Exclude sensitive info from response
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        blocked: user.blocked,
        isGoogleUser: user.isGoogleUser,
      },
      token,
    });
  } catch (error) {
    console.log("Google Login Error:", error);
    res.status(401).send({
      success: false,
      message: "Invalid Google token or authentication failed.",
      error: error.message,
    });
  }
};

// update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update the fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        blocked: user.blocked,
        isGoogleUser: user.isGoogleUser,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
