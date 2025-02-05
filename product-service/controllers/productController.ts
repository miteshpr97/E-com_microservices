import { Request, Response, NextFunction } from "express";
import ProductModel from "../models/Product";

export const productAdd = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const product = new ProductModel({
      name,
      description,
      price,
      image,
      category,
      stock,
    });

    // Save the product to the database
    const savedProduct = await product.save();

    // Return success response
    return res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    return res.status(500).json({
      error: "An error occurred while updating the address",
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
