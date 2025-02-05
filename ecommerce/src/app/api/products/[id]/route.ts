import { connect } from "@/dbConfig/dbConfig";
import ProductModel from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connect();

    const { id } = params;

    // Validate _id
    if (!id) {
      return NextResponse.json({ error: "_ID is required" }, { status: 400 });
    }
    const product = await ProductModel.findById(id);

   
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Return the product
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
  // Return error response
  return NextResponse.json(
    { message: "Failed to get product", error: String(error) },
    { status: 500 }
  );
  }
}
