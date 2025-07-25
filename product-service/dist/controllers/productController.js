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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductStock = exports.getProductsByIds = exports.getProductId = exports.productGet = exports.productAdd = void 0;
var Product_1 = __importDefault(require("../models/Product"));
var cloudinaryConfig_1 = require("../utils/cloudinaryConfig");
// ✅ Add a new product
var productAdd = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var productImagePath, productImageUrl, _a, name_1, description, price, category, stock, product, savedProduct, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                if (!req.file) {
                    return [2 /*return*/, res.status(400).json({ error: "Please provide product image" })];
                }
                productImagePath = req.file.path;
                return [4 /*yield*/, (0, cloudinaryConfig_1.uploadOnCloudinary)(productImagePath)];
            case 1:
                productImageUrl = _b.sent();
                if (!productImageUrl) {
                    return [2 /*return*/, res.status(500).json({
                            error: "Failed to upload image. Please try again.",
                        })];
                }
                _a = req.body, name_1 = _a.name, description = _a.description, price = _a.price, category = _a.category, stock = _a.stock;
                product = new Product_1.default({
                    name: name_1,
                    description: description,
                    price: price,
                    image: productImageUrl,
                    category: category,
                    stock: stock,
                });
                return [4 /*yield*/, product.save()];
            case 2:
                savedProduct = _b.sent();
                return [2 /*return*/, res.status(201).json({
                        message: "Product created successfully",
                        product: savedProduct,
                    })];
            case 3:
                error_1 = _b.sent();
                console.error("Error creating product:", error_1);
                return [2 /*return*/, res.status(500).json({
                        error: "An error occurred while creating the product",
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.productAdd = productAdd;
// ✅ Get all products
var productGet = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var products, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Product_1.default.find()];
            case 1:
                products = _a.sent();
                return [2 /*return*/, res.status(200).json(products)];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching products:", error_2);
                return [2 /*return*/, res.status(500).json({
                        error: "An error occurred while fetching products",
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.productGet = productGet;
// ✅ Get product by ID
var getProductId = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, product, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                if (!id) {
                    return [2 /*return*/, res.status(400).json({ error: "Product ID is required" })];
                }
                return [4 /*yield*/, Product_1.default.findById(id)];
            case 1:
                product = _a.sent();
                if (!product) {
                    return [2 /*return*/, res.status(404).json({ error: "Product not found" })];
                }
                return [2 /*return*/, res.status(200).json(product)];
            case 2:
                error_3 = _a.sent();
                console.error("Error fetching product:", error_3);
                return [2 /*return*/, res.status(500).json({
                        error: "An error occurred while fetching the product",
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProductId = getProductId;
// ✅ Get multiple products by IDs
var getProductsByIds = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, products, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.body.id;
                if (!id || !Array.isArray(id) || id.length === 0) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Product IDs are required and should be an array" })];
                }
                return [4 /*yield*/, Product_1.default.find({ _id: { $in: id } })];
            case 1:
                products = _a.sent();
                if (products.length === 0) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ error: "No products found for the provided IDs" })];
                }
                return [2 /*return*/, res.status(200).json(products)];
            case 2:
                error_4 = _a.sent();
                console.error("Error fetching products:", error_4);
                return [2 /*return*/, res.status(500).json({
                        error: "An error occurred while fetching the products",
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProductsByIds = getProductsByIds;
// ✅ Update stock after order
var updateProductStock = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, stock, product, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                productId = req.params.productId;
                stock = req.body.stock;
                if (stock < 0) {
                    return [2 /*return*/, res.status(400).json({
                            message: "Stock cannot be negative",
                        })];
                }
                return [4 /*yield*/, Product_1.default.findById(productId)];
            case 1:
                product = _a.sent();
                if (!product) {
                    return [2 /*return*/, res.status(404).json({
                            message: "Product not found with ID: ".concat(productId),
                        })];
                }
                product.stock = stock;
                return [4 /*yield*/, product.save()];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        message: "Product stock updated successfully",
                        product: product,
                    })];
            case 3:
                error_5 = _a.sent();
                console.error("Error updating product stock:", error_5);
                return [2 /*return*/, res.status(500).json({
                        message: "Failed to update product stock",
                        error: error_5.message,
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateProductStock = updateProductStock;
