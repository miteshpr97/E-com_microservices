
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User"; // Ensure UserModel is correctly imported
import { compare, hash } from "bcryptjs"; // For comparing password
import jwt from "jsonwebtoken"; // For generating JWT
import dotenv from "dotenv";

dotenv.config();

// Login User Controller
export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find if the user exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });

    if (!existingUser) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Check if the password is correct
    const isPasswordValid = await compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // If environment variable TOKEN_SECRET is missing, return an error
    if (!process.env.TOKEN_SECRET) {
      console.error("TOKEN_SECRET is not defined in environment variables.");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Prepare token payload with user details
    const tokenPayload = {
      id: existingUser._id,
      userId:existingUser.userId,
      email: existingUser.email,
      userName: existingUser.userName,
      role: existingUser.role,
      
    };

    // Create the JWT token
    const accessToken = jwt.sign(tokenPayload, process.env.TOKEN_SECRET, {
      expiresIn: "1h", // Token expiry time
    });

    // Remove password from user object before sending it in the response
    const { password: _, ...userDetails } = existingUser.toObject();

    // Send the token in a cookie
    res.cookie("token", accessToken, {
      httpOnly: false, // Cookie is only accessible by the server (not JS)
      // secure: process.env.NODE_ENV === "production", // Set to true in production
      // sameSite: "strict", // SameSite attribute for security
    });

    // Respond with success message and user details (without password)
    res.status(200).json({
      message: "Login successful",
      user: userDetails,
      token: accessToken,
    });
  } catch (error) {
    console.error("Error during login:", error);
    // Pass error to next middleware or handle it directly
    next(error); 
  }
};



// Create User Controller (Registration)
export const getUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
 
  try {
    const { userName, email, password } = req.body;

    // Validate input
    if (!userName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }

    // Normalize email and check for existing user
    const normalizedEmail = email.toLowerCase();
    const existingUser = await UserModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({ error: "Unable to create account. Please try again." });
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

    return res.status(201).json({ message: "User created successfully", user: userDetails });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ error: "An error occurred during registration. Please try again." });
  }
}



// Get User Details (Me)
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const userId = req.params.userId;

    // Validate the userId
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Fetch the user by ID from the database
    const user = await UserModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data (excluding sensitive fields like password)
    const { password, ...userData } = user.toObject();

    // Send response with the user details (excluding the password)
    return res.status(200).json(userData);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ error: 'An error occurred while fetching the user. Please try again.' });
  }
};


// address add 

export const userAddress = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { userId, address } = req.body; 

    // Validate input
    if (!userId || !address) {
      return res.status(400).json({ error: "User ID and address are required" });
    }

    const isValidAddress =
      Array.isArray(address) &&
      address.every((addr) => {
        return (
          typeof addr.street === "string" &&
          typeof addr.city === "string" &&
          typeof addr.state === "string" &&
          typeof addr.postalCode === "string" &&
          typeof addr.country === "string"
        );
      });

    if (!isValidAddress) {
      return res.status(400).json({ error: "Invalid address format" });
    }

    // Find the user and update the address
    const updatedUser = await UserModel.findOneAndUpdate(
      { userId }, // Find user by userId
      { $set: { address } }, // Set the new address array
      { new: true, runValidators: true } // Return the updated user with validation
    );

    if (!updatedUser) {
      return res.status(400).json({ error: "User not found" });
    }

    // Return success response
    return res.status(200).json({
      message: "Address updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Address Update Error:", error);
    return res.status(500).json({
      error: "An error occurred while updating the address",
    });
  }
};


























// later on project

// export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//   try {
//     // Extract JWT token from cookies or authorization header
//     const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ error: "No token provided, please log in" });
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);

//     if (!decoded) {
//       return res.status(401).json({ error: "Invalid token, please log in again" });
//     }

//     // Fetch the user details using the decoded userId
//     const user = await UserModel.findById(decoded._id);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Remove sensitive fields (like password) and send the user data
//     const { password, ...userData } = user.toObject();
//     return res.status(200).json(userData);
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     return res.status(500).json({ error: "An error occurred while fetching user details" });
//   }
// };

