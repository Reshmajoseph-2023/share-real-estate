import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create User Controller
export const register = asyncHandler(async (req, res) => {
  console.log("creating a user");

  const { username, password,email, role } = req.body; 
  const hashedPassword = await bcrypt.hash(password, 10);
  if (!username || !email || !password) {
  return res.status(400).json({ message: "Username, email, and password are required." });
}
  try {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists." });
    }

    // 2. Create the new user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || "user", // optional fallback
      },
    });

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error during registration." });
  }
});


//Login User
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});
