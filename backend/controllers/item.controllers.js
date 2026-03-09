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

    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    let item = await Item.findOneAndUpdate(
      { _id: itemId, shop: shop._id },
      {
        name,
        category,
        price,
        foodType,
        image,
        shop: shop._id,
      },
      { new: true },
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await shop.populate("items owner");
    return res.status(200).json({ shop });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error editing item", error: error.message });
  }
};
