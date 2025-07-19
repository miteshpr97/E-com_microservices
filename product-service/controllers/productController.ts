import { Request, Response, NextFunction } from "express";

// Extend the Request interface to include the 'file' property
declare global {
  namespace Express {
    interface Request {
      file?: {
        path: string;
      };
    }
  }
}
import ProductModel from "../models/Product";
import { uploadOnCloudinary } from "../utils/cloudinaryConfig";



//add new product 
export const productAdd = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  let productImagePath = null;

  try {
    // Validate if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "Please provide product image" });
    }

    productImagePath = req.file.path;

    // Upload image to Cloudinary
    const productImageUrl = await uploadOnCloudinary(req.file.path);

    if (!productImageUrl) {
      return res.status(500).json({
        error: "Failed to upload image. Please try again.",
      });
    }

    // Destructure fields from form-data body
    const { name, description, price, category, stock } = req.body;

    // Create new product document
    const product = new ProductModel({
      name,
      description,
      price,
      image: productImageUrl,
      category,
      stock,
    });

    // Save to MongoDB
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


// get all product data
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
      error: "An error occurred while updating the address",
    });
  }
};

// get indvual product data through id
export const getProductId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const id = req.params.id;

    // Validate _id
    if (!id) {
      return res.status(400).json({ error: "product ID is required" });
    }
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Return the product
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      error: "An error occurred while fetching the user. Please try again.",
    });
  }
};

// get multiple product data through id
export const getProductsByIds = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.body;

    // Validate ids
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

    // Return the products
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      error: "An error occurred while fetching the products. Please try again.",
    });
  }
};


// update stcok when place orders
export const updateProductStock = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("hjnmkk");

  try {
    const { productId } = req.params;
    const { stock } = req.body;

    console.log(productId, "productid...");
    console.log(stock, "stcko....");

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

    // Update the stock
    product.stock = stock;

    // Save the updated product
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
