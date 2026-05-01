import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import DeliveryAssignment from "../models/deliveryassignment.model.js";
import { assign } from "nodemailer/lib/shared/index.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

const ORDER_STATUSES = ["pending", "preparing", "out of delivery", "delivered"];

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "cart is empty" });
    }

    if (
      !deliveryAddress.text ||
      !deliveryAddress.lattitude ||
      !deliveryAddress.longitude
    ) {
      return res.status(400).json({ message: "send complete address" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "payment method is required" });
    }

    const groupItemsbyShop = {};

    cartItems.forEach((item) => {
      if (!groupItemsbyShop[item.shop]) {
        groupItemsbyShop[item.shop] = [];
      }
      groupItemsbyShop[item.shop].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupItemsbyShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          return res.status(400).json({ message: "Shop not found" });
        }

        const items = groupItemsbyShop[shopId];

        const shopOrderItems = items.map((i) => ({
          item: i.id,
          price: i.price,
          quantity: i.quantity,
        }));

        const subTotal = items.reduce((sum, i) => {
          return sum + Number(i.price) * Number(i.quantity);
        }, 0);

        return {
          shop: shopId,
          owner: shop.owner._id,
          subTotal,
          shopOrderItems,
        };
      }),
    );

    const totalAmount = shopOrders.reduce((sum, i) => {
      return sum + Number(i.subTotal);
    }, 0);

    if (paymentMethod == "online") {
      const razorOrder = await instance.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: `reciept_${Date.now()}`,
      });

      const newOrder = await Order.create({
        user: req.userId,
        paymentMethod: paymentMethod,
        deliveryAddress: {
          text: deliveryAddress.text,
          lattitude: deliveryAddress.lattitude,
          longitude: deliveryAddress.longitude,
        },
        totalAmount: totalAmount,
        shopOrder: shopOrders,
        razorpayOrderId: razorOrder.id,
        payment: false,
      });

      return res.status(200).json({
        razorOrder,
        orderId: newOrder._id,
        key_is: process.env.RAZORPAY_KEY_ID,
      });
    }

    const order = await Order.create({
      user: req.userId,
      paymentMethod: paymentMethod,
      deliveryAddress: {
        text: deliveryAddress.text,
        lattitude: deliveryAddress.lattitude,
        longitude: deliveryAddress.longitude,
      },
      totalAmount: totalAmount,
      shopOrder: shopOrders,
    });

    await order.populate([
      { path: "shopOrder.shop" },
      { path: "shopOrder.shopOrderItems.item" },
      { path: "shopOrder.owner" },
      { path: "user", select: "fullName email mobile role" },
    ]);

    const io = req.app.get("io");

    if (io) {
      order.shopOrder.forEach((shopOrder) => {
        const ownerSocketId = shopOrder.owner.socketId;
        if (ownerSocketId) {
          const ownerFormattedOrder = {
            ...order.toObject(),
            shopOrder: [shopOrder], // same filtering like getOrders owner
          };

          io.to(ownerSocketId).emit("newOrder", ownerFormattedOrder);
        }
      });
    }

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json(`place order error : ${error}`);
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, orderId } = req.body;

    const payment = await instance.payments.fetch(razorpay_payment_id);

    if (!payment || payment.status != "captured") {
      return res.status(400).json({ message: "payment not captured" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }

    order.payment = true;
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    await order.populate([
      { path: "shopOrder.shop" },
      { path: "shopOrder.shopOrderItems.item" },
      { path: "shopOrder.owner" },
      { path: "user", select: "fullName email mobile role" },
    ]);

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ message: `verify payment error : ${error}` });
  }
};

export const getOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role === "user") {
      const userOrders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate([
          { path: "user" },
          { path: "shopOrder.shop" },
          { path: "shopOrder.shopOrderItems.item" },
          { path: "shopOrder.assignedDeliveryBoy" },
        ]);

      return res.status(200).json(userOrders);
    } else if (user.role === "owner") {
      const ownerOrders = await Order.find({
        "shopOrder.owner": req.userId,
      })
        .sort({ createdAt: -1 })
        .populate([
          { path: "user" },
          { path: "shopOrder.shop" },
          { path: "shopOrder.shopOrderItems.item" },
          {
            path: "shopOrder.assignedDeliveryBoy",
            select: "fullName email mobile",
          },
        ]);

      const filteredOrders = ownerOrders.map((order) => {
        order.shopOrder = order.shopOrder.filter((shop) =>
          shop.owner.equals(req.userId),
        );
        return order;
      });

      return res.status(200).json(filteredOrders);
    }
    return null;
  } catch (error) {
    return res.status(500).json({ message: `getOrders error : ${error}` });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrder.find((i) => i.shop.toString() == shopId);

    if (!shopOrder) {
      return res.status(400).json({ message: "Shop Order not found" });
    }

    if (!shopOrder.owner?.equals(req.userId)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this order" });
    }

    const previousStatus = shopOrder.status;
    let nextStatus = status;

    let deliveryBoysPayload = [];
    let message = "Order status updated successfully";

    if (status === "out of delivery" && !shopOrder.assignment) {
      const { lattitude, longitude } = order.deliveryAddress;

      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(lattitude)],
            },
            $maxDistance: 50000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((i) => i._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: "assigned",
      }).distinct("assignedTo");

      const busyIdsSet = new Set(busyIds.map((id) => String(id)));

      const availableBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdsSet.has(String(b._id)),
      );

      const candidiates = availableBoys.map((b) => b._id);

      if (candidiates.length === 0) {
        nextStatus = previousStatus;
        message =
          "No nearby available delivery boys were found. Ask the delivery boy to log in, allow location access, and stay within 50 km of the delivery address.";
      } else {
        let deliveryAssignment = await DeliveryAssignment.create({
          order: order._id,
          shop: shopId,
          shopOrderId: shopOrder._id,
          broadcastedTo: candidiates,
          status: "brodcasted",
        });
        deliveryAssignment = await deliveryAssignment.populate([
          { path: "order" },
          { path: "shop" },
        ]);
        shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;
        shopOrder.assignment = deliveryAssignment._id;

        deliveryBoysPayload = availableBoys.map((b) => ({
          id: b._id,
          fullName: b.fullName,
          longitude: b.location.coordinates?.[0],
          lattitude: b.location.coordinates?.[1],
          mobile: b.mobile,
        }));

        const io = req.app.get("io");

        if (io) {
          availableBoys.forEach((b) => {
            const socketId = b.socketId;

            if (socketId) {
              io.to(socketId).emit("newAssignment", {
                sentTo: b._id,
                assignmentId: deliveryAssignment._id,
                orderId: deliveryAssignment.order._id,
                shopName: deliveryAssignment.shop.name,
                deliveryAddress: deliveryAssignment.order?.deliveryAddress,
                items: shopOrder.shopOrderItems || [],
                subTotal: shopOrder.subTotal,
              });
            }
          });
        }
      }
    }

    shopOrder.status = nextStatus;

    if (nextStatus === "delivered" && shopOrder.assignment) {
      await DeliveryAssignment.findByIdAndUpdate(shopOrder.assignment, {
        status: "completed",
      });
    }

    await order.save();

    await order.populate([
      { path: "shopOrder.shop", select: "name" },
      { path: "shopOrder.shopOrderItems.item" },
      {
        path: "shopOrder.assignedDeliveryBoy",
        select: "fullName email mobile",
      },
      {
        path: "user",
        select: "socketId",
      },
    ]);

    const updatedShopOrder = order.shopOrder.find(
      (i) => i.shop._id.toString() == shopId,
    );

    const io = req.app.get("io");

    if (io) {
      const userSocketId = order.user.socketId;

      if (userSocketId) {
        io.to(userSocketId).emit("update-status", {
          orderId: order._id,
          shopId: updatedShopOrder.shop._id,
          status: updatedShopOrder.status,
          userId: order.user._id,
        });
      }
    }

    return res.status(200).json({
      message,
      shopOrder: updatedShopOrder,
      deliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoysPayload,
      assignment: updatedShopOrder?.assignment || null,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `updateOrderStatus error ${error} ` });
  }
};

export const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;

    const assignments = await DeliveryAssignment.find({
      broadcastedTo: deliveryBoyId,
      status: "brodcasted",
    })
      .sort({ createdAt: -1 })
      .populate("order")
      .populate("shop");

    const formatted = assignments.map((a) => {
      const shopOrder = a.order?.shopOrder?.find(
        (s) => s._id.toString() === a.shopOrderId.toString(),
      );

      return {
        assignmentId: a._id,
        orderId: a.order._id,
        shopName: a.shop.name,
        deliveryAddress: a.order?.deliveryAddress,
        items: shopOrder.shopOrderItems || [],
        subTotal: shopOrder.subTotal,
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ message: `getAssignment error ${error} ` });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await DeliveryAssignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: `assignment not found` });
    }

    if (assignment.status != "brodcasted") {
      return res.status(400).json({
        message: `assignment is expired`,
      });
    }

    const alreadyAssigned = await DeliveryAssignment.exists({
      assignedTo: req.userId,
      status: "assigned",
    });

    if (alreadyAssigned) {
      return res.status(400).json({
        message: `you are already assigned to another order`,
      });
    }

    assignment.assignedTo = req.userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();

    await assignment.save();

    const order = await Order.findById(assignment.order);

    if (!order) {
      return res.status(400).json({
        message: `order not found`,
      });
    }

    const shopOrder = order.shopOrder.find((so) =>
      so._id.equals(assignment.shopOrderId),
    );

    if (!shopOrder) {
      return res.status(400).json({
        message: `shop order not found`,
      });
    }

    shopOrder.assignedDeliveryBoy = req.userId;
    await order.save();

    return res.status(200).json({
      message: `order accepted `,
    });
  } catch (error) {
    return res.status(500).json({
      message: `accept order error : ${error}`,
    });
  }
};

export const getCurrentOrder = async (req, res) => {
  try {
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: "assigned",
    }).populate([
      { path: "shop", select: "name" },
      { path: "assignedTo", select: "fullName email mobile location " },
      {
        path: "order",
        select: "user deliveryAddress totalAmount shopOrder",
        populate: [
          {
            path: "user",
            select: "fullName email mobile location",
          },
          {
            path: "shopOrder.shop",
            select: "name",
          },
          {
            path: "shopOrder.shopOrderItems.item",
          },
          {
            path: "shopOrder.assignedDeliveryBoy",
            select: "fullName email mobile location",
          },
        ],
      },
    ]);

    if (!assignment) {
      return res.status(404).json({
        message: "assignment not found",
      });
    }

    if (!assignment.order) {
      return res.status(404).json({
        message: "order not found",
      });
    }

    const shopOrder = assignment.order.shopOrder.find(
      (s) => String(s._id) === String(assignment.shopOrderId),
    );

    if (!shopOrder) {
      return res.status(404).json({
        message: "Shop order not found",
      });
    }

    if ((!shopOrder.shop || !shopOrder.shop.name) && assignment.shop) {
      shopOrder.shop = assignment.shop;
    }

    let deliveryBoyLocation = { lat: null, lon: null };

    if (assignment.assignedTo.location.coordinates.length == 2) {
      deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1];
      deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0];
    }

    let customerLocation = { lat: null, lon: null };
    if (assignment.order.deliveryAddress) {
      customerLocation.lat = assignment.order.deliveryAddress.lattitude;
      customerLocation.lon = assignment.order.deliveryAddress.longitude;
    }

    return res.status(200).json({
      _id: assignment.order._id,
      user: assignment.order.user,
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation,
    });
  } catch (error) {
    return res.status(500).json({
      message: `get current order error : ${error}`,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    // const order = await Order.findById(orderId)
    //   .populate("user")
    //   .populate({
    //     path: "shopOrder",
    //     populate: [
    //       {
    //         path: "shop",
    //       },
    //       {
    //         path: "owner",
    //       },
    //       {
    //         path: "assignment",
    //       },
    //       {
    //         path: "assignedDeliveryBoy",
    //       },
    //       {
    //         path: "shopOrderItems",
    //         populate: {
    //           path: "item",
    //         },
    //       },
    //     ],
    //   })
    //   .lean();

    const order = await Order.findById(orderId)
      .populate("user")
      .populate({
        path: "shopOrder.shop",
        model: "Shop",
      })
      .populate({
        path: "shopOrder.assignedDeliveryBoy",
        model: "User",
      })
      .populate({
        path: "shopOrder.shopOrderItems.item",
        model: "Item",
      })
      .lean();

    if (!order) {
      return res.status(404).json({
        message: "order not found",
      });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({
      message: `get current order error :`,
      error,
    });
  }
};

export const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopId } = req.body;

    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return res.status(404).json({
        message: `order not found`,
      });
    }

    const shopOrder = order.shopOrder.find(
      (s) => String(s.shop) === String(shopId),
    );

    if (!shopOrder) {
      return res.status(404).json({
        message: `shop order not found`,
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await sendDeliveryOtpMail({ to: order.user.email, otp: otp });

    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    await order.save();

    return res.status(200).json({ message: `delivery otp sent sucessfully` });
  } catch (error) {
    return res.status(500).json({
      message: `send delivery otp error :`,
      error,
    });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopId, otp } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: `order not found`,
      });
    }

    const shopOrder = order.shopOrder.find(
      (s) => String(s.shop) === String(shopId),
    );

    if (!shopOrder) {
      return res.status(404).json({
        message: `shop order not found`,
      });
    }

    if (!shopOrder.deliveryOtp) {
      return res.status(400).json({
        message: "No active OTP",
      });
    }

    if (!shopOrder.otpExpires || Date.now() > shopOrder.otpExpires) {
      return res.status(400).json({
        message: `otp expired`,
      });
    }

    if (String(shopOrder.deliveryOtp) === String(otp)) {
      shopOrder.status = "delivered";
      shopOrder.deliveryOtp = null;
      shopOrder.otpExpires = null;

      shopOrder.deliveredAt = new Date();

      await order.save();
      await DeliveryAssignment.deleteOne({
        order: orderId,
        shop: shopId,
      });

      return res
        .status(200)
        .json({ message: `delivered otp verified sucessfully` });
    } else {
      return res.status(400).json({ message: `Incorrect Otp` });
    }
  } catch (error) {
    return res.status(500).json({
      message: `verify delivery otp error :`,
      error,
    });
  }
};
