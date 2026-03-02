import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createEditShop } from "../controllers/shop.controllers.js";
import { upload } from "../middlewares/multer.js";

const shopRouter = express.Router();

shopRouter.post("/create-edit-shop", upload.single("image"), isAuth, createEditShop);

export default shopRouter;
