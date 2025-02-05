import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ProductModel from "../models/Product"; // Make sure to import ProductModel
import OrderModel from "../models/Order";
import { OrderStatus } from "../models/Order";

export const orderAdd = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Parse the request body
    const { user, products, totalAmount, shippingAddress } = req.body;

    // Validate required fields
    if (
      !user ||
      !Array.isArray(products) ||
      products.length === 0 ||
      !totalAmount ||
      !shippingAddress
    ) {
      return res.status(400).json({
        error: "Missing required fields: user, products, totalAmount, or shippingAddress",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check stock availability & prepare order items
      const formattedProducts = [];

      for (const p of products) {
        if (!p.productId || !p.quantity || !p.price) {
          await session.abortTransaction();
          session.endSession();

          return res.status(400).json({
            message: "Each product must have a valid 'productId', 'quantity', and 'price'.",
          });
        }

        // Find product in DB
        const product = await ProductModel.findById(p.productId).session(session);

        if (!product) {
          await session.abortTransaction();
          session.endSession();
          return res.status(404).json({
            message: `Product not found: ${p.productId}`,
          });
        }

        // Check stock availability
        if (product.stock < p.quantity) {
          await session.abortTransaction();
          session.endSession();
          return res.status(400).json({
            message: `Not enough stock for product: ${product.name}`,
          });
        }

        // Deduct stock
        product.stock -= p.quantity;
        await product.save({ session }); // Save stock update in the transaction

        // Add to order
        formattedProducts.push({
          productId: new mongoose.Types.ObjectId(p.productId),
          name: p.name,
          quantity: p.quantity,
          price: p.price,
        });
      }

      // Create a new order document
      const newOrder = new OrderModel({
        user: new mongoose.Types.ObjectId(user),
        products: formattedProducts,
        totalAmount,
        shippingAddress,
        status: OrderStatus.PENDING, // Default status
      });

      // Save the order
      await newOrder.save({ session });

      // Commit transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        message: "Order created successfully",
        order: newOrder,
      });
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error creating order:", error);
      return res.status(500).json({
        message: "Failed to create order",
        error: error.message,
      });
    }
  } catch (error: any) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};
