import User from "../models/user.model";

import { Request, Response } from "express";

interface AuthRequest extends Request {
  userId?: string;
}

interface LocationBody {
  lat: number;
  lon: number;
}

// Get Current User
const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;


    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log("Cookies:", req.cookies);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json({ user });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `GetCurrentUser Error :${error?.message}` });
  }
};

export default getCurrentUser;




// Update User Location
const updateUserLocation = async (req: AuthRequest, res: Response) => {
  try {

    const { lat, lon } = req.body as LocationBody;
    if (!req.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (lat === undefined || lon === undefined) {
      return res.status(400).json({ message: "lat & lon are required" });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        location: {
          type: "Point",
          coordinates: [lon, lat],
        },
      },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `upadateUserLocation error : ${error}` });
  }
};

export { getCurrentUser, updateUserLocation };
