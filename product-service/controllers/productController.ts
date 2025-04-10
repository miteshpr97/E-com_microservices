import { Request, Response, NextFunction } from "express";
import ProductModel from "../models/Product";



//add new product 
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
