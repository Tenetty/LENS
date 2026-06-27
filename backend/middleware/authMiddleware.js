const jwt = require("jsonwebtoken");
//normal user
const User = require("../models/userModel.js");
require("dotenv").config();

// Generic role verification helper
const verifyRole = (roles) => {
  return async (req, res, next) => {
    try {
      console.log("--- verifyRole DEBUG ---");
      console.log("Method:", req.method, "URL:", req.originalUrl);
      console.log("Cookies:", req.cookies);
      console.log("Headers.authorization:", req.headers.authorization);

      // Accept token from cookie OR Authorization header
      let token = req.cookies.access_token;
      if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          token = parts[1];
        }
      }
      
      console.log("Extracted token:", !!token);

      if (!token) {
        console.log("401 FAILED: No token found");
        return res.status(401).json({ message: "Invalid Token" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        console.log("401 FAILED: User not found");
        return res.status(401).json({ message: "User not found" });
      }
      
      // Admin override (Admin can do everything or limit as needed)
      if (user.role && roles.includes(user.role)) {
        req.user = user; // Attach full user object for easy ID access in controllers
        console.log("Authenticated as:", user.role);
        return next();
      }

      // Fallback for legacy isAdmin prop
      if (roles.includes("Admin") && user.isAdmin) {
        req.user = user;
        console.log("Authenticated as Admin (legacy)");
        return next();
      }
      
      console.log("403 FAILED: Role not allowed. User role:", user.role);
      return res.status(403).json({ message: `Access denied. Requires one of: ${roles.join(", ")}` });
    } catch (err) {
      console.log("401 FAILED: Catch block error:", err.message);
      console.error(err);
      return res.status(401).json({ message: "Invalid Token" });
    }
  };
};

const requireAdmin = verifyRole(["Admin"]);
const requireHotelManager = verifyRole(["Hotel Manager", "Admin"]);
const requireVehicleOwner = verifyRole(["Vehicle Owner", "Admin"]);
const requireRestaurantOwner = verifyRole(["Restaurant Owner", "Admin"]);

const userMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.access_token;
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }
    if (!token) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid Token" });
  }
};
//admin
const adminMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.access_token;
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }
    if (!token) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id, { isAdmin: 1 });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }
    req.user = decoded.id;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid Token" });
  }
};
//activity organizer
const organizerMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.access_token;
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }
    if (!token) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id, { type: 1 });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.type !== "eventOrganizer") {
      return res.status(403).json({ message: "Access denied" });
    }
    req.user = decoded.id;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = {
  userMiddleware,
  adminMiddleware,
  organizerMiddleware,
  requireAdmin,
  requireHotelManager,
  requireVehicleOwner,
  requireRestaurantOwner
};
