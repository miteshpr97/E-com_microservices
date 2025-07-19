"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var requireAuth = function (req, res, next) {
    var token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized, token missing" });
    }
    jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).json({ error: "Unauthorized, invalid token" });
        }
        req.user = decoded;
        next();
    });
};
exports.requireAuth = requireAuth;
