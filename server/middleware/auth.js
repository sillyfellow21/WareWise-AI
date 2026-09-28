import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authorization = req.header("Authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authorization.slice(7).trim();
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id).select("_id role").lean();
    if (!user) {
      return res.status(401).json({ message: "User session is no longer valid" });
    }

    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired authentication token" });
  }
};

export const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Insufficient permissions" });
  }
  next();
};

export const requireSelf = (parameterName) => (req, res, next) => {
  if (req.user?.role === "admin" || req.user?.id === req.params[parameterName]) {
    return next();
  }
  return res.status(403).json({ message: "You can only access your own resources" });
};
