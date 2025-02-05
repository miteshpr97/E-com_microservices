// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { connect } from "@/dbConfig/dbConfig";
// import OrderModel from "@/models/Order";
// import ProductModel from "@/models/Product";
// import { NextRequest, NextResponse } from "next/server";
// import { OrderStatus } from "@/models/Order";
// import mongoose from "mongoose";



// export async function POST(req: NextRequest) {
//   try {
//     // Connect to the database
//     await connect();
//     // Parse the request body
//     const { user, products, totalAmount, shippingAddress } = await req.json();

    

//     // Validate required fields
//     if (!user || !Array.isArray(products) || products.length === 0 || !totalAmount || !shippingAddress) {
//       return NextResponse.json(
//         { message: "Missing required fields: user, products, totalAmount, or shippingAddress" },
//         { status: 400 }
//       );
//     }

//     // Ensure each product has the necessary fields
//     for (const product of products) {
//       if (!product.name || !product.quantity || !product.price) {
//         return NextResponse.json(
//           { message: "Each product must have a 'product' ID, 'quantity', and 'price'." },
//           { status: 400 }
//         );
//       }
//     }
//     // Convert product IDs to MongoDB ObjectId
//     const formattedProducts = products.map((p) => ({
//       productId: new mongoose.Types.ObjectId(p.productId),
//       name: p.name,
//       quantity: p.quantity,
//       price: p.price,
//     }));


//     // Create a new order document
//     const newOrder = new OrderModel({
//       user: new mongoose.Types.ObjectId(user),
//       products: formattedProducts,
//       totalAmount,
//       shippingAddress,
//       status: OrderStatus.PENDING, // Default status
//     });

//     // Save the order to the database
//     // await newOrder.save();
//     // Return a successful response
//     return NextResponse.json(
//       { message: "Order created successfully", order: newOrder },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Error creating order:", error);
//     return NextResponse.json(
//       { message: "Failed to create order", error: error.message },
//       { status: 500 }
//     );
//   }
// }










/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from "@/dbConfig/dbConfig";
import OrderModel from "@/models/Order";
import ProductModel from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@/models/Order";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connect();

    // Parse the request body
    const { user, products, totalAmount, shippingAddress } = await req.json();



    // Validate required fields
    if (!user || !Array.isArray(products) || products.length === 0 || !totalAmount || !shippingAddress) {
      return NextResponse.json(
        { message: "Missing required fields: user, products, totalAmount, or shippingAddress" },
        { status: 400 }
      );
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
          return NextResponse.json(
            { message: "Each product must have a valid 'productId', 'quantity', and 'price'." },
            { status: 400 }
          );
        }

        // Find product in DB
        const product = await ProductModel.findById(p.productId).session(session);

     

        if (!product) {
          await session.abortTransaction();
          session.endSession();
          return NextResponse.json({ message: `Product not found: ${p.productId}` }, { status: 404 });
        }

        // Check stock availability
        if (product.stock < p.quantity) {
          await session.abortTransaction();   // ⛔️ Rollback if not enough stock
          session.endSession();    
          return NextResponse.json(
            { message: `Not enough stock for product: ${product.name}` },
            { status: 400 }
          );
        }

        // Deduct stock
        product.stock -= p.quantity;
        await product.save({ session });   // ✅ Save stock update in the transaction

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

      return NextResponse.json(
        { message: "Order created successfully", order: newOrder },
        { status: 201 }
      );
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error creating order:", error);
      return NextResponse.json(
        { message: "Failed to create order", error: error.message },
        { status: 500 }
      );
    }




  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Failed to create order", error: error.message },
      { status: 500 }
    );
  }
}
