import { Request, Response, NextFunction } from "express";
import ProductModel from "../models/Product";
import { uploadOnCloudinary } from "../utils/cloudinaryConfig";

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


export const productGet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const products = await ProductModel.find();
    console.log(products);
    

    return res.status(200).json(
        products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      error: "An error occurred while updating the address",
    });
  }
};
