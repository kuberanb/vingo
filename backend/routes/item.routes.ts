import express from "express";
import isAuth from "../middlewares/isAuth";
import { upload } from "../middlewares/multer";
import {
  addItem,
  getItem,
  getItemsByShop,
  rating,
} from "../controllers/item.controllers";
import { editItem } from "../controllers/item.controllers";
import { deleteItem } from "../controllers/item.controllers";
import { getItemsByCity } from "../controllers/item.controllers";

const itemRouter = express.Router();

itemRouter.post("/create-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRouter.get("/get-item/:itemId", isAuth, getItem);
itemRouter.delete("/item/:itemId", isAuth, deleteItem);
itemRouter.get("/get-items-by-shop/:shopId", isAuth, getItemsByShop);
itemRouter.get("/items", isAuth, getItemsByCity);
itemRouter.post("/rating",isAuth,rating);
export default itemRouter;
