import { Router } from "express";
import { productAdd, productGet } from "../controllers/productController";
import { RequestHandler } from "express"; // Import RequestHandler type

const router = Router();

// Explicitly cast loginUser to RequestHandler type
router.post("/add", productAdd as RequestHandler);

// Route to create a new user (Registration)
router.get("/get", productGet);



export default router;
