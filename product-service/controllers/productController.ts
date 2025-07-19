import { Request, Response, NextFunction } from "express";
import ProductModel from "../models/Product";
import { uploadOnCloudinary } from "../utils/cloudinaryConfig";

// ✅ Add a new product
export const productAdd = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please provide product image" });
    }

    const productImagePath = (req.file as Express.Multer.File).path;

    const productImageUrl = await uploadOnCloudinary(productImagePath);

    if (!productImageUrl) {
      return res.status(500).json({
        error: "Failed to upload image. Please try again.",
      });
    }

    const { name, description, price, category, stock } = req.body;

    const product = new ProductModel({
      name,
      description,
      price,
      image: productImageUrl,
      category,
      stock,
    });

    const savedProduct = await product.save();

    return res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      error: "An error occurred while creating the product",
    });
  }
};

// ✅ Get all products
export const productGet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const products = await ProductModel.find();
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      error: "An error occurred while fetching products",
    });
  }
};

// ✅ Get product by ID
export const getProductId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      error: "An error occurred while fetching the product",
    });
  }
};

// ✅ Get multiple products by IDs
export const getProductsByIds = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.body;

    if (!id || !Array.isArray(id) || id.length === 0) {
      return res
        .status(400)
        .json({ error: "Product IDs are required and should be an array" });
    }

    const products = await ProductModel.find({ _id: { $in: id } });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ error: "No products found for the provided IDs" });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      error: "An error occurred while fetching the products",
    });
  }
};

// ✅ Update stock after order
export const updateProductStock = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;

    if (stock < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: `Product not found with ID: ${productId}`,
      });
    }

    product.stock = stock;
    await product.save();

    return res.status(200).json({
      message: "Product stock updated successfully",
      product,
    });
  } catch (error: any) {
    console.error("Error updating product stock:", error);
    return res.status(500).json({
      message: "Failed to update product stock",
      error: error.message,
    });
  }
};
