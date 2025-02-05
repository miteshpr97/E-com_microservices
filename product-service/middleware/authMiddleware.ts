import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized, token missing" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized, invalid token" });
    }

    req.user = decoded;
    next();
  });
};
