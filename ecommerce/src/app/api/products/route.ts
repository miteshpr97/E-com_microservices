// api/products.ts

import { connect } from "@/dbConfig/dbConfig";
import ProductModel from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const body = await req.json();
    const { name, description, price, image, category, stock } = body;
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
    return NextResponse.json(
      {
        message: "Product created successfully",
        product: savedProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);

    // Return error response
    return NextResponse.json(
      { message: "Failed to create product", error: String(error) },
      { status: 500 }
    );
  }
}



export async function GET() {
    try {
        await connect();  
        const products = await ProductModel.find();  
        return NextResponse.json(products, { status: 200 }); 
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { message: "Failed to fetch products", error: String(error) },
            { status: 500 }
        );  
    }
}