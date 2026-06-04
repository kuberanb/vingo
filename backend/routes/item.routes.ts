import express, { RequestHandler } from "express";
import isAuth from "../middlewares/isAuth";
import { upload } from "../middlewares/multer";
import {
  addItem,
  deleteItem,
  editItem,
  getItem,
  getItemsByCity,
  getItemsByShop,
  rating,
} from "../controllers/item.controllers";

const itemRouter = express.Router();
const handler = (fn: unknown): RequestHandler => fn as RequestHandler;

itemRouter.post("/create-item", isAuth, upload.single("image"), handler(addItem));
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), handler(editItem));
itemRouter.get("/get-item/:itemId", isAuth, handler(getItem));
itemRouter.delete("/item/:itemId", isAuth, handler(deleteItem));
itemRouter.get("/get-items-by-shop/:shopId", isAuth, handler(getItemsByShop));
itemRouter.get("/items", isAuth, handler(getItemsByCity));
itemRouter.post("/rating", isAuth, handler(rating));
export default itemRouter;
