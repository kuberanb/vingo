import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createEditShop } from "../controllers/shop.controllers.js";
import { upload } from "../middlewares/multer.js";
import { getCurrentShop } from "../controllers/shop.controllers.js";

const shopRouter = express.Router();

shopRouter.post(
  "/create-edit-shop",
  upload.single("image"),
  isAuth,
  createEditShop,
);
shopRouter.get("/current-shop", isAuth, getCurrentShop);

export default shopRouter;
