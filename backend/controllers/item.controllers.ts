import uploadOnCloudinary from "../utils/cloudinary";
import Shop from "../models/shop.model";
import Item from "../models/item.model";
import { Request, Response } from "express";

interface AddItemBody {
  name: string;
  category: string;
  price: number;
  foodType: string;
}

interface EditItemBody {
  name: string;
  category: string;
  price: number;
  foodType: string;
}

interface RatingBody {
  itemId: string;
  rating: string;
}

interface EditItemParams {
  itemId: string;
}

interface GetItemParams {
  itemId: string;
}

interface DeleteItemParams {
  itemId: string;
}

interface GetItemsByCityQuery {
  city: string;
}

interface GetItemsByShopParams {
  shopId: string;
}

interface AuthRequest<P, T> extends Request<P, {}, T> {
  userId?: string;
  file?: Express.Multer.File;
}

export const addItem = async (req: AuthRequest<{}, AddItemBody>, res: Response): Promise<Response> => {
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
  } catch (error: any) {
    return res.status(500).json({
      message: "Error adding item",
      error: error.message,
    });
  }
};

export const editItem = async (req: AuthRequest<EditItemParams, EditItemBody>, res: Response): Promise<Response> => {
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

    const updateData: Partial<EditItemBody> & {
      image?: string;
    } = {
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
  } catch (error: any) {
    console.log(` Error editing item : ${error}`);
    return res
      .status(500)
      .json({ message: "Error editing item", error: error.message });
  }
};

export const getItem = async (req: Request<GetItemParams>, res: Response): Promise<Response> => {
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
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export const deleteItem = async (req: AuthRequest<DeleteItemParams, {}>, res: Response): Promise<Response> => {
  const { itemId } = req.params;

  try {
    const shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      return res.status(404).json({ message: "Shop Not Found" });
    }

    const item = await Item.findOneAndDelete({
      _id: itemId,
      shop: shop._id,
    });

    if (!item) {
      return res.status(404).json({ message: "Item Not found" });
    }

    shop.items = shop.items.filter(
      (id) => id.toString() !== itemId
    );

    await shop.save();

    const updatedShop = await Shop.findById(shop._id)
      .populate(`owner`)
      .populate({
        path: `items`,
        options: {
          sort: { updatedAt: -1 },
        },
      });
    return res.status(200).json({ shop: updatedShop });
  } catch (e: any) {
    return res.status(500).json({ error: e });
  }
};

export const getItemsByCity = async (req: Request<{}, {}, {}, GetItemsByCityQuery>, res: Response): Promise<Response> => {
  try {
    const { city } = req.query;

    // const shopList = await Shop.find({}).populate("items");
    const shopList = await Shop.find({
      city,
    }).populate("items");

    if (!shopList || shopList.length === 0) {
      return res.status(200).json({ message: "No Shop in the city" });
    }

    let itemsList: any[] = [];

    shopList.forEach((shop) => {
      itemsList.push(...shop.items);
    });

    if (!itemsList || itemsList.length === 0) {
      return res.status(404).json({ message: "No Food Items in the City" });
    }

    return res.status(200).json({ itemsList });
  } catch (error: any) {
    return res.status(500).json({ message: `getItems error : ${error}` });
  }
};

export const getItemsByShop = async (req: Request<GetItemsByShopParams>, res: Response): Promise<Response> => {
  try {
    const { shopId } = req.params;

    const shop = await Shop.findById(shopId).populate("items");

    if (!shop) {
      return res.status(404).json({ message: "shop not found" });
    }

    return res.status(200).json({
      shop: shop,
      items: shop.items,
    });
  } catch (error: any) {
    return res.status(500).json({ message: `getItemsByShop error : ${error}` });
  }
};

export const rating = async (req: AuthRequest<{}, RatingBody>, res: Response): Promise<Response> => {
  try {
    const { itemId, rating } = req.body;

    const numericRating = Number(rating);

    if (numericRating > 5 || numericRating < 1) {
      return res
        .status(400)
        .json({ message: `rating should be between 1 and 5` });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: `item not found` });
    }

    let newCount = item.rating.count + 1;

    let newAverageRating =
      (item.rating.average * item.rating.count + numericRating) / newCount;

    item.rating.average = Number(newAverageRating.toFixed(1));
    item.rating.count = newCount;

    await item.save();

    return res.status(200).json({
      rating: Number(newAverageRating.toFixed(1)),
      rating_count: newCount,
    });
  } catch (error: any) {
    return res.status(500).json({ message: `rating error : ${error}` });
  }
};
