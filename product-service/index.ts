import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes";
import { connect } from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: 'GET,POST,PUT,DELETE', // Allowed methods
  allowedHeaders: 'Content-Type,Authorization', // Allowed headers
  credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions)); // Use the CORS middleware with the configured options


// Middleware

app.use(express.json());
app.use(cookieParser()); 

// Routes
app.use("/api/product", productRoutes);

// Database Connection
const startServer = async () => {
  await connect();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();










// npm install express mongoose bcryptjs jsonwebtoken cookie-parser dotenv cors
// npm install --save-dev @types/express @types/mongoose @types/bcryptjs @types/jsonwebtoken @types/cookie-parser @types/cors
