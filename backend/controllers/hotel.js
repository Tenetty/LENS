const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const multer = require("multer");
const path = require("path");

//img upload part
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jfif|jpg|jpeg|png)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
}).fields([
  { name: "HotelImg", maxCount: 1 },
  { name: "HotelImgs", maxCount: 5 },
  { name: "certificates", maxCount: 2 },
]);

// Create a new hotel

const createHotel = async (req, res) => {
  try {
    // Use Multer middleware to handle file upload
    upload(req, res, async (err) => {
      if (err) {
        console.log("Multer error:", err);
        return res.status(500).json({ message: err.message });
      }

      // Check if files are uploaded
      if (
        !req.files ||
        !req.files.HotelImg ||
        !req.files.HotelImgs ||
        !req.files.certificates
      ) {
        console.log("Required files are missing");
        return res.status(400).json({ message: "Required files are missing" });
      }

      // Extract the file names from the request object
      const hotelImg = req.files.HotelImg[0].filename;
      const HotelImgs = req.files.HotelImgs.map((file) => file.filename);
      const certificates = req.files.certificates.map((file) => file.filename);

      console.log("Files uploaded:", { hotelImg, HotelImgs, certificates });

      try {
        // Check if all required fields are present in the request body
      const requiredFields = [
        "name",
        "title",
        "city",
        "province",
        "zip",
        "address",
        "distance",
        "contactName",
        "contactNo",
        "numberOfRoomTypes",
        "description",
        "cheapestPrice",
      ];

      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        console.log(`Missing required fields: ${missingFields.join(", ")}`);
        return res.status(400).json({
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }

      // Create a new hotel object from the request body and file names
      const newHotel = new Hotel({
        ...req.body,
        owner: req.user ? req.user._id : undefined,
        HotelImg: hotelImg,
        HotelImgs: HotelImgs,
        certificates: certificates,
      });

      // Save the new hotel to the database
      await newHotel.save();

      console.log("New hotel created:", newHotel);

      // Send a response with the new hotel object
      res.status(200).json(newHotel);
      } catch (innerErr) {
        console.log("Inner catch block error:", innerErr);
        res.status(500).json({ message: innerErr.message });
      }
    });
  } catch (err) {
    console.log("Catch block error:", err);
    res.status(500).json({ message: err.message });
  }
};

// const createHotel = async (req, res) => {
//   try {
//     // Use Multer middleware to handle file upload
//     upload(req, res, async (err) => {
//       if (err) {
//         console.log("Multer error:", err);
//         return res.status(500).json({ message: err.message });
//       }

//       // Check if files are uploaded
//       if (
//         !req.files ||
//         !req.files.HotelImg ||
//         !req.files.HotelImgs ||
//         !req.files.certificates
//       ) {
//         return res.status(400).json({ message: "Required files are missing" });
//       }

//       // Extract the file names from the request object
//       const hotelImg = req.files.HotelImg[0].filename;
//       const HotelImgs = req.files.HotelImgs.map((file) => file.filename);
//       const certificates = req.files.certificates.map((file) => file.filename);

//       console.log("Files uploaded:", { hotelImg, HotelImgs, certificates });

//       // Check if all required fields are present in the request body
//       const requiredFields = [
//         "name",
//         "title",
//         "city",
//         "province",
//         "zip",
//         "address",
//         "distance",
//         "contactName",
//         "contactNo",
//         "numberOfRoomTypes",
//         "description",
//         "cheapestPrice",
//       ];

//       const missingFields = requiredFields.filter((field) => !req.body[field]);

//       if (missingFields.length > 0) {
//         return res
//           .status(400)
//           .json({
//             message: `Missing required fields: ${missingFields.join(", ")}`,
//           });
//       }

//       // Create a new hotel object from the request body and file names
//       const newHotel = new Hotel({
//         ...req.body,
//         HotelImg: hotelImg,
//         HotelImgs: HotelImgs,
//         certificates: certificates,
//       });

//       // Save the new hotel to the database
//       await newHotel.save();

//       console.log("New hotel created:", newHotel);

//       // Send a response with the new hotel object
//       res.status(200).json(newHotel);
//     });
//   } catch (err) {
//     console.log("Catch block error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// update Hotel
const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    // Only owner or Admin can update
    if (hotel.owner && req.user && hotel.owner.toString() !== req.user._id.toString() && req.user.role !== "Admin" && !req.user.isAdmin) {
      return res.status(403).json({ message: "You can only update your own hotel" });
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};

//delete Hotel
const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    // Only owner or Admin can delete
    if (hotel.owner && req.user && hotel.owner.toString() !== req.user._id.toString() && req.user.role !== "Admin" && !req.user.isAdmin) {
      return res.status(403).json({ message: "You can only delete your own hotel" });
    }

    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
};

//get Hotel
const getHotel = async (req, res, next) => {
  try {
    const viewHotel = await Hotel.findById(req.params.id);
    res.status(200).json(viewHotel);
  } catch (err) {
    next(err);
  }
};

//get all Hotels
const getAllHotel = async (req, res, next) => {
  const { min, max, ...others } = req.query;
  try {
    const hotels = await Hotel.find({
      ...others,
      isApproved: true,
      cheapestPrice: { $gt: min | 1, $lt: max || 100000 },
    }).limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get hotels owned by the logged-in hotel manager (includes unapproved)
const getMyHotels = async (req, res, next) => {
  try {
    console.log("Fetching hotels for owner ID:", req.user._id);
    const hotels = await Hotel.find({ owner: req.user._id }).populate("owner", "name email");
    console.log("Found:", hotels.length);
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json(err);
  }
};

//count by city
const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city, isApproved: true });
      })
    );

    res.status(200).json(list);
  } catch (err) {
    res.status(500).json(err);
  }
};

//count by type
const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "Hotel", isApproved: true });
    const apratmentCount = await Hotel.countDocuments({ type: "apartment", isApproved: true });
    const resortCount = await Hotel.countDocuments({ type: "resort", isApproved: true });
    const villaCount = await Hotel.countDocuments({ type: "villa", isApproved: true });
    const cabinCount = await Hotel.countDocuments({ type: "cabin", isApproved: true });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartment", count: apratmentCount },
      { type: "resort", count: resortCount },
      { type: "villa", count: villaCount },
      { type: "cabin", count: cabinCount },
    ]);
  } catch (err) {
    res.status(500).json(err);
  }
};

// get hotel by hotel type and city

const getHotelbyCity = async (req, res) => {
  const city = req.params.city;
  console.log(city);
  try {
    const hotels = await Hotel.find({
      city: { $regex: city, $options: "i" },
      isApproved: true
    });
    console.log(hotels);
    res.send(hotels);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

// Admin: get all hotels (including unapproved)
const getAllHotelsAdmin = async (req, res, next) => {
  try {
    const hotels = await Hotel.find().populate("owner", "name email");
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Admin approve hotel
const approveHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).populate("owner");

    if (updatedHotel && updatedHotel.owner && updatedHotel.owner.email) {
      const sendEmail = require("../utils/sendEmail");
      const emailText = `Hello ${updatedHotel.owner.name || "Hotel Partner"},\n\nWe are pleased to inform you that your hotel listing "${updatedHotel.name}" has been reviewed and APPROVED by our administrator.\n\nIt is now live on our platform and users can begin booking stays.\n\nThank you for partnering with LENS!\n\nBest regards,\nLENS Administration Team`;
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
          <h2 style="color: #2b6cb0;">Congratulations!</h2>
          <p>Hello <strong>${updatedHotel.owner.name || "Hotel Partner"}</strong>,</p>
          <p>We are pleased to inform you that your hotel listing "<strong>${updatedHotel.name}</strong>" has been reviewed and <strong>APPROVED</strong> by our administrator.</p>
          <p>It is now live on our platform and users can begin booking stays.</p>
          <br>
          <p>Thank you for partnering with LENS!</p>
          <p>Best regards,<br><strong>LENS Administration Team</strong></p>
        </div>
      `;

      sendEmail(updatedHotel.owner.email, `Hotel Listing Approved - ${updatedHotel.name}`, emailText, emailHtml)
        .catch(err => console.error("Failed to send hotel approval email:", err));
    }

    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};

// Admin reject/unapprove hotel
const rejectHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { isApproved: false },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createHotel,
  updateHotel,
  deleteHotel,
  getHotel,
  getAllHotel,
  getMyHotels,
  getAllHotelsAdmin,
  countByCity,
  countByType,
  getHotelbyCity,
  getHotelRooms,
  approveHotel,
  rejectHotel,
};
