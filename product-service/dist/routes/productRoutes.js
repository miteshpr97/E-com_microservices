"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var productController_1 = require("../controllers/productController");
var multerConfiguration_1 = require("../utils/multerConfiguration");
var router = (0, express_1.Router)();
// Explicitly cast loginUser to RequestHandler type
router.post("/add", multerConfiguration_1.upload.single("image"), productController_1.productAdd);
// Route to create a new user (Registration)
router.get("/get", productController_1.productGet);
router.get("/get/:id", productController_1.getProductId);
router.post("/getbyids", productController_1.getProductsByIds);
// Route to update the product's stock
router.put("/update/:productId", productController_1.updateProductStock);
exports.default = router;
