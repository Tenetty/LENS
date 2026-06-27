const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      // required: true,
      // enum :["user","admin"],
      // default : "users"
    },
    role: {
      type: String,
      enum: ["Admin", "Tourist", "Hotel Manager", "Vehicle Owner", "Restaurant Owner"],
      default: "Tourist",
    },
    pic: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg",
    },
    hotelName: {
      type: String,
    },
    hotelAddress: {
      type: String,
    },
    hotelExperience: {
      type: String,
    },
    vehicleNumber: {
      type: String,
    },
    vehicleType: {
      type: String,
    },
    licenseNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ["APPROVED", "PENDING", "DECLINED"],
      default: "APPROVED",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
