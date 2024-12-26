import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// user authorization middleware
export const authorized = (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    const userData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = userData;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized: Token has expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

// checks whether user is Admin or not?
export const isAdmin = (req, res, next) => {
  if (req.user.userType !== "admin") {
    return res.status(403).json({ error: "Access forbidden!" });
  }
  next();
};
