import mongoose, { Model, Schema, Types } from "mongoose";
import { IOrder } from "./order.model";
import { IShop } from "./shop.model";
import { IUser } from "./user.model";

export interface IDeliveryAssignment {
  order?: Types.ObjectId | IOrder;
  shop?: Types.ObjectId | IShop;
  shopOrderId: Types.ObjectId;
  broadcastedTo: (Types.ObjectId | IUser)[];
  assignedTo?: Types.ObjectId | IUser;
  status: "brodcasted" | "assigned" | "completed";
  acceptedAt?: Date;
}

const deliveryAssignmentSchema = new Schema<IDeliveryAssignment>(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    shopOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    broadcastedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["brodcasted", "assigned", "completed"],
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const DeliveryAssignment: Model<IDeliveryAssignment> = mongoose.model<IDeliveryAssignment>(
  "DeliveryAssignment",
  deliveryAssignmentSchema,
);

export default DeliveryAssignment;
