/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { connect } from "@/dbConfig/dbConfig";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// Connect to the database
connect();

export async function PATCH(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { userId, address } = reqBody;

    // Validate input
    if (!userId || !address) {
      return NextResponse.json(
        { error: "User ID and address are required" },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: "Invalid address format" },
        { status: 400 }
      );
    }

    // Find the user and update the address
    const updatedUser = await UserModel.findOneAndUpdate(
      { userId }, // Find user by userId
      { $set: { address } }, // Set the new address array
      { new: true, runValidators: true } // Return the updated user with validation
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      { message: "Address updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Address Update Error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the address" },
      { status: 500 }
    );
  }
}
