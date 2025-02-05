/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { connect } from "@/dbConfig/dbConfig";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";

// Connect to the database
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { userName, email, password } = reqBody;

    // Validate input
    if (!userName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Normalize email and check for existing user
    const normalizedEmail = email.toLowerCase();
    const existingUser = await UserModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { error: "Unable to create account. Please try again." },
        { status: 400 }
      );
    }

    // Generate userId in the format U001
    const lastUser = await UserModel.findOne().sort({ createdAt: -1 });



    let userId = "U001"; // Default userId if no users exist

    if (lastUser) {
      const lastUserId = lastUser.userId;
      const numericPart = parseInt(lastUserId.slice(1)) + 1;
      userId = `U${String(numericPart).padStart(3, "0")}`;
    }

    // Hash password and create user
    const hashedPassword = await hash(password, 12);
    const newUser = new UserModel({
      userId,
      userName,
      email: normalizedEmail,
      password: hashedPassword,
    });
  

    const user = await newUser.save();


    console.log(user);
    

    // Exclude sensitive fields from response
    const { password: _, ...userDetails } = user._doc;

    return NextResponse.json(
      { message: "User created successfully", user: userDetails },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}

