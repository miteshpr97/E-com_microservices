// import { Request, Response, NextFunction } from "express";
// import axios from "axios";
// import OrderModel from "../models/Order";
// import { OrderStatus } from "../models/Order";
// import mongoose from "mongoose";

// export const orderAdd = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     const { user, products, totalAmount, shippingAddress } = req.body;

//     if (
//       !user ||
//       !Array.isArray(products) ||
//       products.length === 0 ||
//       !totalAmount ||
//       !shippingAddress
//     ) {
//       return res.status(400).json({
//         error:
//           "Missing required fields: user, products, totalAmount, or shippingAddress",
//       });
//     }

//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // Get all product details in ONE API call
//       const productIds = products.map((p) => p.productId);

//       const productResponse = await axios.post(
//         "http://localhost:5001/api/product/getbyids",
//         { id: productIds }
//       );
//       const productData = productResponse.data; // Assuming the API returns an array of products

//       const formattedProducts = [];

//       for (const p of products) {
//         const product = productData.find(
//           (prod: { _id: any }) => prod._id === p.productId
//         );

//         if (!product) {
//           throw new Error(`Product not found: ${p.productId}`);
//         }

//         if (product.stock < p.quantity) {
//           throw new Error(`Not enough stock for product: ${product.name}`);
//         }

//         formattedProducts.push({
//           productId: p.productId,
//           name: p.name,
//           quantity: p.quantity,
//           price: p.price,
//         });
//       }

//       // Deduct stock using Promise.all() for efficiency
//       await Promise.all(
//         formattedProducts.map(async (p) => {
          
//           try {
//             const product = productData.find((prod: { _id: any }) => prod._id === p.productId);
            
//             if (product) {
//               const newStock = product.stock - p.quantity;

              
              
//               await axios.put(`http://localhost:5001/api/product/update/${p.productId}`, {
//                 stock: newStock,
//               });
//             } else {
//               console.warn(`Product with ID ${p.productId} not found in productData.`);
//             }
//           } catch (error) {
//             console.error(`Failed to update stock for ${p.name}:`, error);
//           }
//         })
//       );
      

//         // Create the order
//         const newOrder = new OrderModel({
//           user: new mongoose.Types.ObjectId(user),
//           products: formattedProducts,
//           totalAmount,
//           shippingAddress,
//           status: OrderStatus.PENDING,
//         });

//         await newOrder.save({ session });

//         await session.commitTransaction();
//         session.endSession();

//         return res.status(201).json({
//           message: "Order created successfully",
//           order: newOrder,
//         });
//     } catch (error: any) {
//       await session.abortTransaction();
//       session.endSession();
//       console.error("Error creating order:", error);
//       return res.status(500).json({
//         message: "Failed to create order",
//         error: error.message,
//       });
//     }
//   } catch (error: any) {
//     console.error("Error creating order:");
//     return res.status(500).json({
//       message: "Failed to create order",
//       error: error.message,
//     });
//   }
// };























import { Request, Response, NextFunction } from "express";
import axios from "axios";
import OrderModel from "../models/Order";
import { OrderStatus } from "../models/Order";
import Stripe from "stripe";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();



const gateway = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});



interface Product {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  user: string;
  products: Product[];
  totalAmount: number;
  shippingAddress: string;
}




export const orderAdd = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  
    const { user, products, totalAmount, shippingAddress }:Order = req.body;

    if (
      !user ||
      !Array.isArray(products) ||
      products.length === 0 ||
      !totalAmount ||
      !shippingAddress
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: user, products, totalAmount, or shippingAddress",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

      const consumer = await gateway.customers.create({
        name: user,
        address: {
          line1: shippingAddress.split(",")[0],
          postal_code: shippingAddress.split(",")[3]?.trim() || "",
          city: shippingAddress.split(",")[1]?.trim() || "",
          state: shippingAddress.split(",")[2]?.trim() || "",
          country: "IN",
        },
      });
  
      const line_items = products.map((product) => ({
        price_data: {
          currency: "inr",
          unit_amount: product.price * 100,
          product_data: {
            name: product.name,
          },
        },
        quantity: product.quantity,
      }));








      // Get all product details in ONE API call
      const productIds = products.map((p) => p.productId);

      const productResponse = await axios.post(
        "http://localhost:5001/api/product/getbyids",
        { id: productIds }
      );
      const productData = productResponse.data; // Assuming the API returns an array of products

      const formattedProducts = [];

      for (const p of products) {
        const product = productData.find(
          (prod: { _id: any }) => prod._id === p.productId
        );

        if (!product) {
          throw new Error(`Product not found: ${p.productId}`);
        }

        if (product.stock < p.quantity) {
          throw new Error(`Not enough stock for product: ${product.name}`);
        }

        formattedProducts.push({
          productId: p.productId,
          name: p.name,
          quantity: p.quantity,
          price: p.price,
        });
      }

      // Deduct stock using Promise.all() for efficiency
      await Promise.all(
        formattedProducts.map(async (p) => {
          
          try {
            const product = productData.find((prod: { _id: any }) => prod._id === p.productId);
            
            if (product) {
              const newStock = product.stock - p.quantity;

              
              
              await axios.put(`http://localhost:5001/api/product/update/${p.productId}`, {
                stock: newStock,
              });
            } else {
              console.warn(`Product with ID ${p.productId} not found in productData.`);
            }
          } catch (error) {
            console.error(`Failed to update stock for ${p.name}:`, error);
          }
        })
      );
      

        // Create the order
        const newOrder = new OrderModel({
          user: new mongoose.Types.ObjectId(user),
          products: formattedProducts,
          totalAmount,
          shippingAddress,
          status: OrderStatus.PENDING,
        });

        await newOrder.save({ session });

        await session.commitTransaction();
        session.endSession();

        const checkoutSession = await gateway.checkout.sessions.create({
          payment_method_types: ["card"],
          customer: consumer.id,
          line_items,
          mode: "payment",
          success_url: "https://your-app.com/success",
          cancel_url: "https://your-app.com/cancel",
        });
    
        if (checkoutSession.url) {
          return res.status(201).json({
            message: "Payment session created",
            url: checkoutSession.url  
          });
  
      
      
        }



        
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
  
  
};
