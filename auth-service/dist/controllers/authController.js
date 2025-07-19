"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAddress = exports.getMe = exports.getUser = exports.loginUser = void 0;
var User_1 = __importDefault(require("../models/User")); // Ensure UserModel is correctly imported
var bcryptjs_1 = require("bcryptjs"); // For comparing password
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // For generating JWT
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Login User Controller
var loginUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, existingUser, isPasswordValid, tokenPayload, accessToken, _b, _, userDetails, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                // Check if email and password are provided
                if (!email || !password) {
                    return [2 /*return*/, res.status(400).json({ error: "All fields are required" })];
                }
                return [4 /*yield*/, User_1.default.findOne({ email: email.toLowerCase() })];
            case 1:
                existingUser = _c.sent();
                if (!existingUser) {
                    return [2 /*return*/, res.status(400).json({ error: "User does not exist" })];
                }
                return [4 /*yield*/, (0, bcryptjs_1.compare)(password, existingUser.password)];
            case 2:
                isPasswordValid = _c.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid email or password" })];
                }
                // If environment variable TOKEN_SECRET is missing, return an error
                if (!process.env.TOKEN_SECRET) {
                    console.error("TOKEN_SECRET is not defined in environment variables.");
                    return [2 /*return*/, res.status(500).json({ error: "Server configuration error" })];
                }
                tokenPayload = {
                    id: existingUser._id,
                    userId: existingUser.userId,
                    email: existingUser.email,
                    userName: existingUser.userName,
                    role: existingUser.role,
                };
                accessToken = jsonwebtoken_1.default.sign(tokenPayload, process.env.TOKEN_SECRET, {
                    expiresIn: "1h", // Token expiry time
                });
                _b = existingUser.toObject(), _ = _b.password, userDetails = __rest(_b, ["password"]);
                // Send the token in a cookie
                res.cookie("token", accessToken, {
                    httpOnly: false, // Cookie is only accessible by the server (not JS)
                    // secure: process.env.NODE_ENV === "production", // Set to true in production
                    // sameSite: "strict", // SameSite attribute for security
                });
                // Respond with success message and user details (without password)
                res.status(200).json({
                    message: "Login successful",
                    user: userDetails,
                    token: accessToken,
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _c.sent();
                console.error("Error during login:", error_1);
                // Pass error to next middleware or handle it directly
                next(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.loginUser = loginUser;
// Create User Controller (Registration)
var getUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userName, email, password, emailRegex, normalizedEmail, existingUser, lastUser, userId, lastUserId, numericPart, hashedPassword, newUser, user, _b, _, userDetails, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                _a = req.body, userName = _a.userName, email = _a.email, password = _a.password;
                // Validate input
                if (!userName || !email || !password) {
                    return [2 /*return*/, res.status(400).json({ error: "All fields are required" })];
                }
                emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid email format" })];
                }
                if (password.length < 8) {
                    return [2 /*return*/, res.status(400).json({ error: "Password must be at least 8 characters long" })];
                }
                normalizedEmail = email.toLowerCase();
                return [4 /*yield*/, User_1.default.findOne({ email: normalizedEmail })];
            case 1:
                existingUser = _c.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(400).json({ error: "Unable to create account. Please try again." })];
                }
                return [4 /*yield*/, User_1.default.findOne().sort({ createdAt: -1 })];
            case 2:
                lastUser = _c.sent();
                userId = "U001";
                if (lastUser) {
                    lastUserId = lastUser.userId;
                    numericPart = parseInt(lastUserId.slice(1)) + 1;
                    userId = "U".concat(String(numericPart).padStart(3, "0"));
                }
                return [4 /*yield*/, (0, bcryptjs_1.hash)(password, 12)];
            case 3:
                hashedPassword = _c.sent();
                newUser = new User_1.default({
                    userId: userId,
                    userName: userName,
                    email: normalizedEmail,
                    password: hashedPassword,
                });
                return [4 /*yield*/, newUser.save()];
            case 4:
                user = _c.sent();
                console.log(user);
                _b = user._doc, _ = _b.password, userDetails = __rest(_b, ["password"]);
                return [2 /*return*/, res.status(201).json({ message: "User created successfully", user: userDetails })];
            case 5:
                error_2 = _c.sent();
                console.error("Error during registration:", error_2);
                return [2 /*return*/, res.status(500).json({ error: "An error occurred during registration. Please try again." })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
// Get User Details (Me)
var getMe = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, _a, password, userData, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = req.params.userId;
                // Validate the userId
                if (!userId) {
                    return [2 /*return*/, res.status(400).json({ error: 'User ID is required' })];
                }
                return [4 /*yield*/, User_1.default.findOne({ userId: userId })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                }
                _a = user.toObject(), password = _a.password, userData = __rest(_a, ["password"]);
                // Send response with the user details (excluding the password)
                return [2 /*return*/, res.status(200).json(userData)];
            case 2:
                error_3 = _b.sent();
                console.error('Error fetching user:', error_3);
                return [2 /*return*/, res.status(500).json({ error: 'An error occurred while fetching the user. Please try again.' })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMe = getMe;
// address add 
var userAddress = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, address, isValidAddress, updatedUser, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, userId = _a.userId, address = _a.address;
                // Validate input
                if (!userId || !address) {
                    return [2 /*return*/, res.status(400).json({ error: "User ID and address are required" })];
                }
                isValidAddress = Array.isArray(address) &&
                    address.every(function (addr) {
                        return (typeof addr.street === "string" &&
                            typeof addr.city === "string" &&
                            typeof addr.state === "string" &&
                            typeof addr.postalCode === "string" &&
                            typeof addr.country === "string");
                    });
                if (!isValidAddress) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid address format" })];
                }
                return [4 /*yield*/, User_1.default.findOneAndUpdate({ userId: userId }, // Find user by userId
                    { $set: { address: address } }, // Set the new address array
                    { new: true, runValidators: true } // Return the updated user with validation
                    )];
            case 1:
                updatedUser = _b.sent();
                if (!updatedUser) {
                    return [2 /*return*/, res.status(400).json({ error: "User not found" })];
                }
                // Return success response
                return [2 /*return*/, res.status(200).json({
                        message: "Address updated successfully",
                        user: updatedUser,
                    })];
            case 2:
                error_4 = _b.sent();
                console.error("Address Update Error:", error_4);
                return [2 /*return*/, res.status(500).json({
                        error: "An error occurred while updating the address",
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.userAddress = userAddress;
// later on project
// export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
//   try {
//     // Extract JWT token from cookies or authorization header
//     const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ error: "No token provided, please log in" });
//     }
//     // Verify the token
//     const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
//     if (!decoded) {
//       return res.status(401).json({ error: "Invalid token, please log in again" });
//     }
//     // Fetch the user details using the decoded userId
//     const user = await UserModel.findById(decoded._id);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     // Remove sensitive fields (like password) and send the user data
//     const { password, ...userData } = user.toObject();
//     return res.status(200).json(userData);
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     return res.status(500).json({ error: "An error occurred while fetching user details" });
//   }
// };
