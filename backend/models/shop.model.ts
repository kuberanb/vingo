import mongoose, { Schema, type Model, Types } from "mongoose";
import { IUser } from "./user.model";
import { IItem } from "./item.model";

export interface IShop {
  name: string;
  image: string;
  owner: Types.ObjectId | IUser;
  city: string;
  state: string;
  address: string;
  items: (Types.ObjectId | IItem)[];
}


const shopSchema = new Schema<IShop>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
  },
  { timestamps: true },
);

const Shop: Model<IShop> = mongoose.model<IShop>("Shop", shopSchema);
export default Shop;
