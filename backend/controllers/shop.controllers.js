import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let shop = await Shop.findOne({ owner: req.userId });

    if (shop) {
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        { name, city, state, address, image },
        { new: true },
      );
    } else {
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    }

    await shop.populate("owner items");
    return res.status(201).json({ shop });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating or editing shop",
      error: error.message,
    });
  }
};

export const getCurrentShop = async (req, res) => {
  try {
    let shop = await Shop.findOne({ owner: req.userId }).populate(
      "owner items",
    );

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    return res.status(200).json({ shop });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error getting current shop : ${error.message}` });
  }
};
