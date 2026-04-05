import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import DeliveryAssignment from "../models/deliveryassignment.model.js";

const ORDER_STATUSES = ["pending", "preparing", "out of delivery", "delivered"];

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
      { path: "user" },
      { path: "shopOrder.shop" },
      { path: "shopOrder.shopOrderItems.item" },
    ]);

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json(`place order error : ${error}`);
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

    shopOrder.status = status;

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
        status: { $nin: ["brodcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdsSet = new Set(busyIds.map((b) => String(b)));

      const availableBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdsSet.has(String(b._id)),
      );

      const candidiates = availableBoys.map((b) => b._id);

      if (candidiates.length === 0) {
        message =
          "Order status updated, but no available delivery boys were found";
      } else {
        const deliveryAssignment = await DeliveryAssignment.create({
          order: order._id,
          shop: shopId,
          shopOrderId: shopOrder._id,
          broadcastedTo: candidiates,
          status: "brodcasted",
        });

        shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;
        shopOrder.assignment = deliveryAssignment._id;

        deliveryBoysPayload = availableBoys.map((b) => ({
          id: b._id,
          fullName: b.fullName,
          longitude: b.location.coordinates?.[0],
          lattitude: b.location.coordinates?.[1],
          mobile: b.mobile,
        }));
      }
    }

    await order.save();

    await order.populate([
      { path: "shopOrder.shop", select: "name" },
      { path: "shopOrder.shopOrderItems.item" },
      {
        path: "shopOrder.assignedDeliveryBoy",
        select: "fullName email mobile",
      },
    ]);

    const updatedShopOrder = order.shopOrder.find(
      (i) => i.shop._id.toString() == shopId,
    );

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
    }).sort({ createdAt: -1 })
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

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: { $nin: ["brodcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return res.status(400).json({
        message: `you are already assigned to another order`,
      });
    }

    assignment.assignedTo = req.userId;
    assignment.status = "assigned";
    assignment.createdAt = new Date();

    await assignment.save();

    const order = await Order.findById(assignment.order);

    if (!order) {
      return res.status(400).json({
        message: `order not found`,
      });
    }

    const shopOrder = order.shopOrder.map(
      (so) => so._id === assignment.shopOrderId,
    );

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
