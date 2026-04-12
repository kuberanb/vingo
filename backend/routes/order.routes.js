import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  acceptOrder,
  getCurrentOrder,
  getDeliveryBoyAssignment,
  getOrderById,
  getOrders,
  placeOrder,
  sendDeliveryOtp,
  updateOrderStatus,
  verifyDeliveryOtp,
} from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/place-order", isAuth, placeOrder);
orderRouter.get("/my-orders", isAuth, getOrders);
orderRouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus);
orderRouter.get("/get-assignments", isAuth, getDeliveryBoyAssignment);
orderRouter.post("/accept-order/:assignmentId", isAuth, acceptOrder);
orderRouter.get("/get-current-order", isAuth, getCurrentOrder);
orderRouter.get("/get-order-by-id/:orderId", isAuth, getOrderById);
orderRouter.post("/send-delivery-otp", isAuth, sendDeliveryOtp);
orderRouter.post("/verify-delivery-otp", isAuth, verifyDeliveryOtp);

export default orderRouter;
