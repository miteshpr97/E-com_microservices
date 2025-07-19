"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var authRoutes_1 = __importDefault(require("./routes/authRoutes"));
var db_1 = require("./config/db");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 5000;
var corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: 'GET,POST,PUT,DELETE', // Allowed methods
    allowedHeaders: 'Content-Type,Authorization', // Allowed headers
    credentials: true, // Allow credentials (cookies)
};
app.use((0, cors_1.default)(corsOptions)); // Use the CORS middleware with the configured options
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Database Connection
(0, db_1.connect)();
// Routes
app.use("/api/auth", authRoutes_1.default);
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
