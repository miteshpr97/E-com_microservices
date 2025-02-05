import { Router } from "express";
import { orderAdd } from "../controllers/orderController";
import { RequestHandler } from "express"; // Import RequestHandler type

const router = Router();

// Explicitly cast loginUser to RequestHandler type
router.post("/add", orderAdd as RequestHandler);





export default router;
