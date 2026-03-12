import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
  createEditShop,
  getCurrentShop,
  getShops,
} from "../controllers/shop.controllers.js";

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
