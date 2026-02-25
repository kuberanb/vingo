import User from "../models/user.model.js";

const getCurrentUser = (req, res) => {
  try {
  } catch (error) {
    return res
      .status(500)
      .json({ message: `GetCurrentUser Error :${error?.message}` });
  }

  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: "userId not found" });
  }

  const user = User.findById(userId);

  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }

  return res.status(200).json({ user });
};

export default getCurrentUser;
