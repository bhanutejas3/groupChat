import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWTTOKEN, (err, decoded) => {
    if (err) {
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      } else if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
    }

    req.user = decoded.user;
    next();
  });
};

export default verifyToken;
