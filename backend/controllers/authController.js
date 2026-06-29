const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createError } = require("../middleware/error");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid token");
  }
};


// @desc    Register new user
// @route   POST /api/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    // Prevent registering as an Admin publicly
    if (req.body.role === "Admin" || req.body.isAdmin === true || req.body.isAdmin === "true") {
      return res.status(400).json({ message: "Admin registration is not allowed through this signup page." });
    }

    var salt = await bcrypt.genSaltSync(10);
    var hash = await bcrypt.hashSync(req.body.password, salt);

    const isPendingRole = req.body.role === "Hotel Manager" || req.body.role === "Vehicle Owner";

    const newUser = new User({
      ...req.body,
      password: hash,
      role: req.body.role || "Tourist",
      isAdmin: false, // Force isAdmin to false for public registration
      status: isPendingRole ? "PENDING" : "APPROVED",
    });

    await newUser.save();
    res.status(200).send("User created successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Register new Admin
// @route   POST /api/auth/register-admin
// @access  Private (Admin only)
const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, mobile, country, password } = req.body;
    
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "Missing required fields for admin registration." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists." });
    }

    var salt = await bcrypt.genSaltSync(10);
    var hash = await bcrypt.hashSync(password, salt);

    const newAdmin = new User({
      name,
      email,
      mobile,
      country,
      password: hash,
      role: "Admin",
      isAdmin: true,
    });

    await newAdmin.save();
    res.status(200).send("Admin user created successfully");
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      return res.status(404).send("wrong password");
    }

    if (user.role === "Hotel Manager" || user.role === "Vehicle Owner") {
      if (user.status === "PENDING") {
        return res.status(403).send("Your registration is pending approval by the Admin.");
      }
      if (user.status === "DECLINED") {
        return res.status(403).send("Your registration has been declined by the Admin.");
      }
    }

    //create the token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin, token });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/logout
// @access  Private
const logoutUser = (req, res) => {
  res.clearCookie("access_token"); // clear the access_token cookie
  if (req.session) {
    req.session.destroy(); // destroy the session
  }
  res.status(200).send("Logged out successfully"); // send a response to the client
};

//rest password request
const resetpasswordrequest = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = generateToken({ userId: user._id });
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER || "girishdhanawade12@gmail.com",
        pass: process.env.EMAIL_PASS || "rtqqugjhuleexpxb",
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.EMAIL_USER || "girishdhanawade12@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `Please click on the following link to reset your password: ${resetLink}`,
    });

    console.log("Message sent: %s", info.messageId);

    res.json({ message: "Reset password email sent", token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//rest password
const resetpassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const { userId } = verifyToken(token);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    var salt = await bcrypt.genSaltSync(10);
    var hash = await bcrypt.hashSync(password, salt);

    user.password = hash;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkEmailExists = async (req, res, next) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "Email already exists" });
    }
    return res.status(200).json({ message: "Email is available" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  registerAdmin,
  loginUser,
  logoutUser,
  resetpasswordrequest,
  resetpassword,
  checkEmailExists,
};
