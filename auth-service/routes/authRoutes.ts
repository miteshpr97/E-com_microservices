import { Router } from "express";
import { loginUser, getUser, getMe } from "../controllers/authController";
import { RequestHandler } from "express"; // Import RequestHandler type

const router = Router();

// Explicitly cast loginUser to RequestHandler type
router.post("/login", loginUser as RequestHandler);

// Route to create a new user (Registration)
router.post("/register", getUser);

// Route to get user details (me) by userId
router.get("/me/:userId", getMe);

export default router;
