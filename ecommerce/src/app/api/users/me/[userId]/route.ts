/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { connect } from "@/dbConfig/dbConfig";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// Ensure database connection
connect();

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;

   
  
    // Validate the userId
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch the user by ID from the database
    const user = await UserModel.findOne({userId});



    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return the user data (excluding sensitive fields like password)
    const { password, ...userData } = user.toObject();

    return NextResponse.json(userData);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the user. Please try again.' },
      { status: 500 }
    );
  }
}
