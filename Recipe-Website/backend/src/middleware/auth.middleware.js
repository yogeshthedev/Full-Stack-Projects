import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided. Unauthorized" });
    }

    // 2️⃣ Verify the token
    const decoded = jwt.verify(token, process.env.JWTSECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // 3️⃣ Find user in DB (optional but safer)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 4️⃣ Attach user info to req for later use
    req.user = user;

    // 5️⃣ Move to next middleware/controller
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};
