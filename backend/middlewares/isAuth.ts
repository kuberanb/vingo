import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  userId: string;
}

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}


const isAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({ message: "token not found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as CustomJwtPayload;

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(500).json({ message: "isAuth middleware error" });
  }
};

export default isAuth;
