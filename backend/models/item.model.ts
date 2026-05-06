import mongoose, { Model, Schema, Types } from "mongoose";
import { IShop } from "./shop.model";

export const CATEGORY_ENUM = [
  "Snacks",
  "Main Course",
  "Desserts",
  "Pizza",
  "Burgers",
  "Sandwiches",
  "South Indian",
  "North Indian",
  "Chinese",
  "Fast Food",
  "Others",
] as const;

export const FOOD_TYPE_ENUM = ["Veg", "Non-Veg"] as const;

export type Category = typeof CATEGORY_ENUM[number];
export type FoodType = typeof FOOD_TYPE_ENUM[number];

export interface IItem {
  name: string;
  image: string;
  shop: Types.ObjectId | IShop;
  category: Category;
  price: number;
  rating: {
    average: number;
    count: number;
  };
  foodType: FoodType;
}

const itemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    category: {
      type: String,
      enum: CATEGORY_ENUM,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    foodType: {
      type: String,
      enum: FOOD_TYPE_ENUM,
      required: true,
    },
  },
  { timestamps: true },
);

const Item: Model<IItem> = mongoose.model<IItem>("Item", itemSchema);
export default Item;
