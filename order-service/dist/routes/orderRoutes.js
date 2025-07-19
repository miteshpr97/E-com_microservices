"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var orderController_1 = require("../controllers/orderController");
var router = (0, express_1.Router)();
// Explicitly cast loginUser to RequestHandler type
router.post("/add", orderController_1.orderAdd);
exports.default = router;
