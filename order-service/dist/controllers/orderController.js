"use strict";
// import { Request, Response, NextFunction } from "express";
// import axios from "axios";
// import OrderModel from "../models/Order";
// import { OrderStatus } from "../models/Order";
// import mongoose from "mongoose";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderAdd = void 0;
var axios_1 = __importDefault(require("axios"));
var Order_1 = __importDefault(require("../models/Order"));
var Order_2 = require("../models/Order");
var stripe_1 = __importDefault(require("stripe"));
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var gateway = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-01-27.acacia",
});
var orderAdd = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, user, products, totalAmount, shippingAddress, session, consumer, line_items, productIds, productResponse, productData_1, formattedProducts, _loop_1, _i, products_1, p, newOrder, checkoutSession, error_1;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = req.body, user = _a.user, products = _a.products, totalAmount = _a.totalAmount, shippingAddress = _a.shippingAddress;
                if (!user ||
                    !Array.isArray(products) ||
                    products.length === 0 ||
                    !totalAmount ||
                    !shippingAddress) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Missing required fields: user, products, totalAmount, or shippingAddress",
                        })];
                }
                return [4 /*yield*/, mongoose_1.default.startSession()];
            case 1:
                session = _e.sent();
                session.startTransaction();
                _e.label = 2;
            case 2:
                _e.trys.push([2, 9, , 11]);
                return [4 /*yield*/, gateway.customers.create({
                        name: user,
                        address: {
                            line1: shippingAddress.split(",")[0],
                            postal_code: ((_b = shippingAddress.split(",")[3]) === null || _b === void 0 ? void 0 : _b.trim()) || "",
                            city: ((_c = shippingAddress.split(",")[1]) === null || _c === void 0 ? void 0 : _c.trim()) || "",
                            state: ((_d = shippingAddress.split(",")[2]) === null || _d === void 0 ? void 0 : _d.trim()) || "",
                            country: "IN",
                        },
                    })];
            case 3:
                consumer = _e.sent();
                line_items = products.map(function (product) { return ({
                    price_data: {
                        currency: "inr",
                        unit_amount: product.price * 100,
                        product_data: {
                            name: product.name,
                        },
                    },
                    quantity: product.quantity,
                }); });
                productIds = products.map(function (p) { return p.productId; });
                return [4 /*yield*/, axios_1.default.post("http://localhost:5001/api/product/getbyids", { id: productIds })];
            case 4:
                productResponse = _e.sent();
                productData_1 = productResponse.data;
                formattedProducts = [];
                _loop_1 = function (p) {
                    var product = productData_1.find(function (prod) { return prod._id === p.productId; });
                    if (!product) {
                        throw new Error("Product not found: ".concat(p.productId));
                    }
                    if (product.stock < p.quantity) {
                        throw new Error("Not enough stock for product: ".concat(product.name));
                    }
                    formattedProducts.push({
                        productId: p.productId,
                        name: p.name,
                        quantity: p.quantity,
                        price: p.price,
                    });
                };
                for (_i = 0, products_1 = products; _i < products_1.length; _i++) {
                    p = products_1[_i];
                    _loop_1(p);
                }
                // Deduct stock using Promise.all() for efficiency
                return [4 /*yield*/, Promise.all(formattedProducts.map(function (p) { return __awaiter(void 0, void 0, void 0, function () {
                        var product, newStock, error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 4, , 5]);
                                    product = productData_1.find(function (prod) { return prod._id === p.productId; });
                                    if (!product) return [3 /*break*/, 2];
                                    newStock = product.stock - p.quantity;
                                    return [4 /*yield*/, axios_1.default.put("http://localhost:5001/api/product/update/".concat(p.productId), {
                                            stock: newStock,
                                        })];
                                case 1:
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    console.warn("Product with ID ".concat(p.productId, " not found in productData."));
                                    _a.label = 3;
                                case 3: return [3 /*break*/, 5];
                                case 4:
                                    error_2 = _a.sent();
                                    console.error("Failed to update stock for ".concat(p.name, ":"), error_2);
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 5:
                // Deduct stock using Promise.all() for efficiency
                _e.sent();
                newOrder = new Order_1.default({
                    user: new mongoose_1.default.Types.ObjectId(user),
                    products: formattedProducts,
                    totalAmount: totalAmount,
                    shippingAddress: shippingAddress,
                    status: Order_2.OrderStatus.PENDING,
                });
                return [4 /*yield*/, newOrder.save({ session: session })];
            case 6:
                _e.sent();
                return [4 /*yield*/, session.commitTransaction()];
            case 7:
                _e.sent();
                session.endSession();
                return [4 /*yield*/, gateway.checkout.sessions.create({
                        payment_method_types: ["card"],
                        customer: consumer.id,
                        line_items: line_items,
                        mode: "payment",
                        success_url: "https://your-app.com/success",
                        cancel_url: "https://your-app.com/cancel",
                    })];
            case 8:
                checkoutSession = _e.sent();
                if (checkoutSession.url) {
                    return [2 /*return*/, res.status(201).json({
                            message: "Payment session created",
                            url: checkoutSession.url
                        })];
                }
                return [2 /*return*/, res.status(201).json({
                        message: "Order created successfully",
                        order: newOrder,
                    })];
            case 9:
                error_1 = _e.sent();
                return [4 /*yield*/, session.abortTransaction()];
            case 10:
                _e.sent();
                session.endSession();
                console.error("Error creating order:", error_1);
                return [2 /*return*/, res.status(500).json({
                        message: "Failed to create order",
                        error: error_1.message,
                    })];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.orderAdd = orderAdd;
