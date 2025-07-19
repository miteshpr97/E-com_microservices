"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var authController_1 = require("../controllers/authController");
var router = (0, express_1.Router)();
// Explicitly cast loginUser to RequestHandler type
router.post("/login", authController_1.loginUser);
// Route to create a new user (Registration)
router.post("/register", authController_1.getUser);
// Route to get user details (me) by userId
router.get("/me/:userId", authController_1.getMe);
exports.default = router;
