import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import authRoutes from "./routes/authRoutes";

dotenv.config();
const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("Auth Service DB Connected"))
  .catch(err => console.error(err));

// Routes
// app.use("/api/auth", authRoutes);

app.listen(5001, () => console.log("Auth Service running on port 5001"));
