import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { addItem, getItem } from "../controllers/item.controllers.js";
import { editItem } from "../controllers/item.controllers.js";

const itemRouter = express.Router();

itemRouter.post("/create-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRouter.get('/get-item/:itemId',isAuth,getItem);

export default itemRouter;
