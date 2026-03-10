import uploadOnCloudinary from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, price, foodType } = req.body;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    let item = await Item.create({
      name,
      category,
      price,
      foodType,
      image,
      shop: shop._id,
    });

    shop.items.push(item._id);
    await shop.save();
    await shop.populate("items owner");

    return res.status(201).json({ shop });
  } catch (error) {
    return res.status(500).json({
      message: "Error adding item",
      error: error.message,
    });
  }
};

export const editItem = async (req, res) => {
  try {
    const { name, category, price, foodType } = req.body;

    const { itemId } = req.params;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      return res.status(404).json({ message: "Shop Not found" });
    }

    const updateData = {
      name,
      category,
      price,
      foodType,
    };

    if (image) {
      updateData.image = image;
    }

    const item = await Item.findOneAndUpdate(
      {
        _id: itemId,
        shop: shop._id,
      },
      updateData,
      { new: true },
    );

    if (!item) {
      return res.status(404).json({ message: "Item Not Found" });
    }

    const updatedShop = await Shop.findById(shop._id)
      .populate("owner")
      .populate({
        path: "items",
        options: { sort: { updatedAt: -1 } },
      });

    return res.status(200).json({ shop: updatedShop });
  } catch (error) {
    console.log(` Error editing item : ${error}`);
    return res
      .status(500)
      .json({ message: "Error editing item", error: error.message });
  }
};

export const getItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    let item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item Not Found",
      });
    }

    return res.status(200).json({
      item,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `GetItem Error `, error: error.message });
  }
};
