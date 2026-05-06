import express from "express";
import isAuth from "../middlewares/isAuth";
import { upload } from "../middlewares/multer";
import {
  createEditShop,
  getCurrentShop,
  getShops,
} from "../controllers/shop.controllers";

const shopRouter = express.Router();

shopRouter.post(
  "/create-edit-shop",
  upload.single("image"),
  isAuth,
  createEditShop,
);
shopRouter.get("/current-shop", isAuth, getCurrentShop);
shopRouter.get("/shops", isAuth, getShops);
export default shopRouter;
