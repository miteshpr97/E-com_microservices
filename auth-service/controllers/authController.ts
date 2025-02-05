import { Request, Response } from "express";
import UserModel from "../models/User";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { connect } from "../config/db"


export const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    await connect();
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });

    if (!existingUser) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const isPasswordValid = await compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (!process.env.TOKEN_SECRET) {
      console.error("TOKEN_SECRET is not defined in environment variables.");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const tokenPayload = {
      id: existingUser._id,
      email: existingUser.email,
      userName: existingUser.userName,
      role: existingUser.role,
    };

    const accessToken = jwt.sign(tokenPayload, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // Remove password from response
    const { password: _, ...userDetails } = existingUser.toObject();

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Login successful",
      user: userDetails,
      token: accessToken,
    });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};
