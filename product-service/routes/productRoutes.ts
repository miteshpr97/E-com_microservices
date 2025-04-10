import { Router } from "express";
import { productAdd, productGet, getProductId, getProductsByIds, updateProductStock } from "../controllers/productController";
import { RequestHandler } from "express"; // Import RequestHandler type

const router = Router();

// Explicitly cast loginUser to RequestHandler type
router.post("/add", productAdd as RequestHandler);

// Route to create a new user (Registration)
router.get("/get", productGet);


router.get("/get/:id", getProductId)
router.post("/getbyids", getProductsByIds)



// Route to update the product's stock
router.put("/update/:productId", updateProductStock);



export default router;






