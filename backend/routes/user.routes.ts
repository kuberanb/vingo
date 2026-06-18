import express from "express";
import getCurrentUser, {
  updateUserLocation,
} from "../controllers/user.controllers";
import isAuth from "../middlewares/isAuth";

const userRouter = express.Router();

userRouter.get("/get-current-user", isAuth, getCurrentUser);
userRouter.post("/update-location", isAuth, updateUserLocation);

export default userRouter;
