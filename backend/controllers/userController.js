const User = require("../models/userModel");

// @desc    Update a User
// @route   PUT /api/users/:id
// @access
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Delete a User
// @route   DELETE /api/users/:id
// @access
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Get a User
// @route   GET /api/users/:id
// @access
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Get all Users
// @route   GET /api/hotels
// @access
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const Hotel = require("../models/Hotel");
    const Vehicle = require("../models/Vehicle");
    const Tour = require("../models/tours");
    const HotelReservation = require("../models/hotelReservationModel");
    const VehicleReservation = require("../models/VehicleReservation");
    const ActivityReservation = require("../models/reservationModel");
    const TourReservation = require("../models/tourBook");

    const userCount = await User.countDocuments();
    const hotelCount = await Hotel.countDocuments();
    const vehicleCount = await Vehicle.countDocuments();
    const tourCount = await Tour.countDocuments();

    const hotelResCount = await HotelReservation.countDocuments();
    const vehicleResCount = await VehicleReservation.countDocuments();
    const activityResCount = await ActivityReservation.countDocuments();
    const tourResCount = await TourReservation.countDocuments();

    res.status(200).json({
      counts: {
        users: userCount,
        hotels: hotelCount,
        vehicles: vehicleCount,
        tours: tourCount,
      },
      reservations: {
        hotels: hotelResCount,
        vehicles: vehicleResCount,
        activities: activityResCount,
        tours: tourResCount,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  getAdminStats,
};
