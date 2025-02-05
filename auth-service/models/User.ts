import mongoose, { Document, Schema } from "mongoose";

// Define the Address sub-schema
const addressSchema: Schema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
},
{ _id: false } // Disable the _id field for addresses
);

export interface User extends Document {
  userId: string;
  userName: string;
  email: string;
  password: string;
  role: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
    address: {
      type: [addressSchema],
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel =
  mongoose.models.User || mongoose.model<User>("User", userSchema);

export default UserModel;
