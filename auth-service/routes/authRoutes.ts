import express from "express";
import { loginUser } from "../controllers/authController";
import { RequestHandler } from "express";

const router = express.Router();

// Define types for Express route handlers
router.post("/login", loginUser as RequestHandler);

export default router;
