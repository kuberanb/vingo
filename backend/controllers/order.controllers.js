import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";

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

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(400).json({ message: "shop not found" });
    }

    const shopOrder = order.shopOrder.find((i) => i.shop.toString() == shopId);

    if (!shopOrder) {
      return res.status(400).json({ message: "Shop Order not found" });
    }

    shopOrder.status = status;

    if (status == "out of delivery" || !shopOrder.assignment) {

      
    }

    await order.save();

    // await shopOrder.populate("shopOrderItems.item", "name image price");

    await order.populate("shopOrder.shopOrderItems.item", "name image price");

    return res.status(200).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `updateOrderStatus error ${error} ` });
  }
};
