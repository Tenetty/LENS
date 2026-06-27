const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Hotel = require("./models/Hotel");
const Room = require("./models/Room");
const hotelReservation = require("./models/hotelReservationModel");
const User = require("./models/userModel");
require("dotenv").config();

const seedHotels = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/RTMS";
    console.log("Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully!");

    // Clear existing hotel, room, and booking data
    console.log("Clearing existing hotels, rooms, and hotel reservations...");
    await Hotel.deleteMany({});
    await Room.deleteMany({});
    await hotelReservation.deleteMany({});
    console.log("Collections cleared!");

    // Ensure the default hotel manager user exists
    let hotelOwner = await User.findOne({ email: "hotel@dummy.com" });
    if (!hotelOwner) {
      console.log("Default Hotel Manager user not found. Creating one...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);
      hotelOwner = await User.create({
        name: "Hotel Manager User",
        email: "hotel@dummy.com",
        password: hashedPassword,
        mobile: "1234567891",
        country: "India",
        role: "Hotel Manager",
        isAdmin: false,
      });
      console.log("Hotel Manager user created!");
    }

    const ownerId = hotelOwner._id;

    // Define rural, budget hotels in Maharashtra, India
    const budgetHotelsData = [
      {
        name: "Matheran Eco-Cottage",
        title: "Rustic Green Stay in No-Vehicle Zone",
        type: "Boutique",
        city: "Matheran",
        province: "Maharashtra",
        zip: 410102,
        address: "Near Charlotte Lake, Matheran Hill Station",
        distance: "0.5km from Charlotte Lake",
        contactName: "Ramesh Pawar",
        contactNo: 9822114455,
        numberOfRoomTypes: 2,
        HotelImg: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        HotelImgs: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
          "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd"
        ],
        description: "Quiet and eco-friendly cottage nestled in the dense forests of Matheran. A peaceful retreat with organic local meals and rustic settings.",
        cheapestPrice: 1800,
        rating: 4.6,
        isApproved: true,
        sustainability: true,
        featured: true,
      },
      {
        name: "Kaas Pathar Homestay",
        title: "Cozy Valley Stay near Valley of Flowers",
        type: "Homestay",
        city: "Satara",
        province: "Maharashtra",
        zip: 415001,
        address: "Kaas Road, Yavateshwar, Satara",
        distance: "3km from Kaas Plateau",
        contactName: "Anandrao Shinde",
        contactNo: 9960773322,
        numberOfRoomTypes: 2,
        HotelImg: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
        HotelImgs: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
        ],
        description: "Experience genuine Maharashtrian hospitality right next to the UNESCO Kaas Plateau. Enjoy home-cooked Pithla Bhakri and warm farm hospitality.",
        cheapestPrice: 1200,
        rating: 4.4,
        isApproved: true,
        sustainability: false,
        featured: true,
      },
      {
        name: "Maratha Heritage Lodge",
        title: "Budget Stay Near Historical Kolhapur Forts",
        type: "Lodge",
        city: "Kolhapur",
        province: "Maharashtra",
        zip: 416012,
        address: "Shivaji Udyam Nagar, near Rankala Lake, Kolhapur",
        distance: "1.5km from Mahalaxmi Temple",
        contactName: "Digvijay Jadhav",
        contactNo: 8888223311,
        numberOfRoomTypes: 2,
        HotelImg: "https://images.unsplash.com/photo-1542314831-c6a4d14d8c53",
        HotelImgs: [
          "https://images.unsplash.com/photo-1445019980597-93fa8acb246c"
        ],
        description: "Affordable and clean rooms close to historical landmarks in Kolhapur. Famous for serving local Tambda and Pandhra Rassa meals by request.",
        cheapestPrice: 1500,
        rating: 4.2,
        isApproved: true,
        sustainability: false,
        featured: true,
      },
      {
        name: "Bhandardara Lakeside Camping & Lodges",
        title: "Rustic Lakeside Tents and Wooden Cabins",
        type: "Cabin",
        city: "Bhandardara",
        province: "Maharashtra",
        zip: 422604,
        address: "Shendi Village, near Arthur Lake, Bhandardara",
        distance: "0.1km from Arthur Lake",
        contactName: "Santosh Kadam",
        contactNo: 7755998811,
        numberOfRoomTypes: 2,
        HotelImg: "https://images.unsplash.com/photo-1584132967334-10e028bd69f4",
        HotelImgs: [
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9"
        ],
        description: "Perfect spot for nature enthusiasts, stargazers, and campers. Affordable lakeside wooden cabins and tent accommodation run by local villagers.",
        cheapestPrice: 1000,
        rating: 4.5,
        isApproved: true,
        sustainability: true,
        featured: true,
      },
      {
        name: "Godavari Agri-Tourism Farm",
        title: "Agro-Tourism Farm Stay in Vineyard Countryside",
        type: "Farmstay",
        city: "Nashik",
        province: "Maharashtra",
        zip: 422003,
        address: "Trimbakeshwar Road, rural Nashik",
        distance: "8km from Trimbakeshwar Temple",
        contactName: "Balu Patil",
        contactNo: 9112233445,
        numberOfRoomTypes: 2,
        HotelImg: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        HotelImgs: [
          "https://images.unsplash.com/photo-1551882547-ff40c0d13c11"
        ],
        description: "Stay in a traditional farm environment amidst grape vineyards and pomegranate fields. Quiet, clean, and perfect for family weekend gateways.",
        cheapestPrice: 2200,
        rating: 4.7,
        isApproved: true,
        sustainability: true,
        featured: true,
      }
    ];

    for (const hotelData of budgetHotelsData) {
      // 1. Create Rooms for the hotel
      console.log(`Creating rooms for: ${hotelData.name}...`);
      
      const room1 = new Room({
        title: "Standard Non-AC Room",
        price: hotelData.cheapestPrice,
        description: "Affordable room with fan, double bed, and attached bathroom. Daily local tea included.",
        maxPeople: 2,
        roomNumbers: [
          { number: 101, unavailableDates: [] },
          { number: 102, unavailableDates: [] }
        ]
      });
      const savedRoom1 = await room1.save();

      const room2 = new Room({
        title: "Deluxe AC Room",
        price: hotelData.cheapestPrice + 800,
        description: "Air-conditioned room with cooler, flat-screen television, free WiFi, and scenic window views.",
        maxPeople: 3,
        roomNumbers: [
          { number: 201, unavailableDates: [] },
          { number: 202, unavailableDates: [] }
        ]
      });
      const savedRoom2 = await room2.save();

      // 2. Create the Hotel referencing these rooms
      const hotel = new Hotel({
        ...hotelData,
        owner: ownerId,
        rooms: [savedRoom1._id.toString(), savedRoom2._id.toString()]
      });
      await hotel.save();
      console.log(`Seeded hotel: ${hotel.name} with room IDs: [${savedRoom1._id}, ${savedRoom2._id}]`);
    }

    console.log("Hotels and Rooms seeding finished successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedHotels();
