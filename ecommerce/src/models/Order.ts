// import mongoose, { Document, Schema } from "mongoose";

// export enum OrderStatus {
//     PENDING = 'pending',
//     COMPLETED = 'completed',
//     SHIPPED = 'shipped',
//     CANCELLED = 'cancelled',
// }

// export interface Order extends Document {
//     user: string;
//     products: string; // Reference to Product Model, not embedding schema
//     totalAmount: number;
//     shippingAddress: string;
//     status: OrderStatus;
//     createdAt: Date;
//     updatedAt: Date;
// }

// // Order Schema
// const OrderSchema: Schema = new Schema({
//     user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//     products: {type: String, required: true},
//     totalAmount: { type: Number, required: true },
//     shippingAddress: { type: String, required: true },
//     status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now },
// });

// // Order Model
// const OrderModel = mongoose.models.Order || mongoose.model<Order>("Order", OrderSchema);
// export default OrderModel;




import mongoose, { Document, Schema } from "mongoose";

export enum OrderStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    SHIPPED = "shipped",
    CANCELLED = "cancelled",
}

interface ProductItem {
    productId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
}

export interface Order extends Document {
    user: mongoose.Types.ObjectId;
    products: ProductItem[]; // Array of ProductItem objects
    totalAmount: number;
    shippingAddress: string;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;
}

// Define Product Schema (Embedded in Order)

const ProductSchema = new Schema<ProductItem>(
    {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
    },
    { _id: false } // Place _id: false inside schema options
);

// Order Schema
const OrderSchema = new Schema<Order>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        products: { type: [ProductSchema], required: true }, // ✅ Correct array type
        totalAmount: { type: Number, required: true },
        shippingAddress: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
    },
    { timestamps: true }
);

// Order Model
const OrderModel =
    mongoose.models.Order || mongoose.model<Order>("Order", OrderSchema);
export default OrderModel;
