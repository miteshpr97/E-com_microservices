import mongoose from "mongoose";

export async function connect() {
  try {
    
    // Ensure that the environment variable is accessed correctly
    const uri = process.env.MONGO_URI;

    // Check if MONGO_URI is defined
    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    // Connect to MongoDB using the URI
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: "NextApp", // ✅ enforce DB name casing
    });
    console.log("MongoDB connected successfully");

  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); // Exit the process if there's an error
  }
}
