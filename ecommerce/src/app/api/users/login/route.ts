/* eslint-disable @typescript-eslint/no-unused-vars */
import { connect } from "@/dbConfig/dbConfig";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";

import jwt from "jsonwebtoken";

// Connect to the database
connect();

export const POST = async (request: NextRequest) => {
  try {
    // Parse the request body
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }
    // Normalize email and check if the user exists
    const normalizedEmail = email.toLowerCase();
    const existingUser = await UserModel.findOne({ email: normalizedEmail });

    
    if (!existingUser) {
      return NextResponse.json(
        { error: "user is not exiest" },
        { status: 400 }
      );
    }

    // Compare the plaintext password with the hashed password
    const isPasswordValid = await compare(password, existingUser.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    // Generate JWT token
    const tokenPayload = {
      id: existingUser._id,
      userId:existingUser.userId,
      email: existingUser.email,
      userName: existingUser.userName,
      role: existingUser.role,
    };

    if (!process.env.TOKEN_SECRET) {
      console.error(
        "TOKEN_SECRET is not defined in the environment variables."
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const accessToken = jwt.sign(tokenPayload, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // Exclude the password from the user object before sending the response
    const { password: _, ...userDetails } = existingUser._doc;

    // Set the cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        // accessToken,
        // user: userDetails,
      },
      { status: 200 }
    );

    // response.cookies.set("token", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
    // return response;


    response.cookies.set("token", accessToken, {
      httpOnly: false,
  
    });


    return response;

  

       




  } catch (error) {
    // Log the error for debugging
    console.error("Error occurred during login:", error);

    // Return a generic error response
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
};


