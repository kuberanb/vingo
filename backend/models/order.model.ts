import mongoose, { Model, Schema, Types } from "mongoose";
import { IItem } from "./item.model";
import { IUser } from "./user.model";
import { IShop } from "./shop.model";

import { IDeliveryAssignment } from "./deliveryAssignment.model";


export interface IShopOrder {
  shop?: Types.ObjectId | IShop;
  owner?: Types.ObjectId | IUser;
  subTotal?: number;
  shopOrderItems: IshopOrderItem[];
  status: "pending" | "preparing" | "out of delivery" | "delivered";
  assignment?: Types.ObjectId | IDeliveryAssignment;
  assignedDeliveryBoy?: Types.ObjectId | IUser;
  deliveryOtp?: string;
  otpExpires?: Date;
  deliveredAt?: Date;
};

export interface IshopOrderItem {
  item?: Types.ObjectId | IItem;
  price: number;
  quantity: number;
}

export interface IOrder {
  user?: Types.ObjectId | IUser;
  paymentMethod: "cod" | "online";
  deliveryAddress?: {
    text: string;
    lattitude: number;
    longitude: number;
  };
  totalAmount?: number;
  shopOrder: IShopOrder[];
  payment: boolean;
  razorpayOrderId: string;
  razorpayPaymentId: string;
}

const shopOrderItemsSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    price: Number,
    quantity: Number,
  },
  { timestamps: true },
);

const shopOrderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subTotal: Number,
    shopOrderItems: [shopOrderItemsSchema],
    status: {
      type: String,
      enum: ["pending", "preparing", "out of delivery", "delivered"],
      default: "pending",
    },
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAssignment",
    },
    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliveryOtp: {
      type: String,
      default: null,
    },
    otpExpires: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    deliveryAddress: {
      text: String,
      lattitude: Number,
      longitude: Number,
    },
    totalAmount: {
      type: Number,
    },
    shopOrder: [shopOrderSchema],
    payment: {
      type: Boolean,
      default: false,
    },
    razorpayOrderId: {
      type: String,
      default: "",
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Order : Model<IOrder> = mongoose.model<IOrder>("Order", orderSchema);
export default Order;
