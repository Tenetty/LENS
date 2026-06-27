const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");
const Resturent = require("./models/resturentModel");
const ResturentDistrict = require("./models/resturentDistrictModel");
const ResturentType = require("./models/resturentTypeModel");
const ResturentReservation = require("./models/resturentReservationModel");
require("dotenv").config();

const seedRestaurants = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/RTMS";
    console.log("Connecting to MongoDB:", mongoUri);
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully!");

    // Clear existing restaurant collections
    console.log("Clearing existing restaurants, districts, types, and reservations...");
    await Resturent.deleteMany({});
    await ResturentDistrict.deleteMany({});
    await ResturentType.deleteMany({});
    await ResturentReservation.deleteMany({});
    console.log("Collections cleared!");

    // Ensure the default restaurant manager user exists
    let restoOwner = await User.findOne({ email: "restaurant@dummy.com" });
    if (!restoOwner) {
      console.log("Default Restaurant Owner user not found. Creating one...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);
      restoOwner = await User.create({
        name: "Restaurant Owner User",
        email: "restaurant@dummy.com",
        password: hashedPassword,
        mobile: "1234567893",
        country: "India",
        role: "Restaurant Owner",
        isAdmin: false,
      });
      console.log("Restaurant Owner user created!");
    }

    const ownerId = restoOwner._id;

    // Seed Districts
    console.log("Seeding districts...");
    const districtsData = [
      { name: "Satara" },
      { name: "Kolhapur" },
      { name: "Ratnagiri" },
      { name: "Pune Rural" },
      { name: "Nashik" },
      { name: "Sindhudurg" },
    ];
    const createdDistricts = await ResturentDistrict.insertMany(districtsData);
    console.log(`Created ${createdDistricts.length} districts.`);

    // Seed Types
    console.log("Seeding restaurant types...");
    const typesData = [
      { name: "Traditional Maharashtrian" },
      { name: "Rural Farm-to-Table" },
      { name: "Coastal Malvani" },
      { name: "Multi-Cuisine Family Resto" },
      { name: "Local Highway Dhaba" },
    ];
    const createdTypes = await ResturentType.insertMany(typesData);
    console.log(`Created ${createdTypes.length} restaurant types.`);

    // Helper map to quickly find created IDs
    const getDistrictId = (name) => createdDistricts.find(d => d.name === name)._id;
    const getTypeId = (name) => createdTypes.find(t => t.name === name)._id;

    // Seed Restaurants
    console.log("Seeding budget rural restaurants...");
    const restaurantsData = [
      {
        user: ownerId,
        name: "Pawar Agri-Tourism & Dhaba",
        district: getDistrictId("Satara"),
        address: "NH4 Highway, Yavateshwar Hills, Satara, Maharashtra",
        pricePerHour: 150,
        tableCount: 12,
        chefQualification: "Traditional Home Cook (15+ Years Exp)",
        resturentImages: [
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
        ],
        registrationImages: [
          "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80"
        ],
        returentType: getTypeId("Rural Farm-to-Table"),
        staffAmount: 6,
        mobileNo: "9822116677",
        registrationNo: "REST-SAT-001",
        status: "APPROVED",
      },
      {
        user: ownerId,
        name: "Malvani Samudra Coastline Eat-out",
        district: getDistrictId("Ratnagiri"),
        address: "Bhatye Beach Road, Ratnagiri, Maharashtra",
        pricePerHour: 200,
        tableCount: 8,
        chefQualification: "Local Seafood Specialist",
        resturentImages: [
          "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80"
        ],
        registrationImages: [
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
        ],
        returentType: getTypeId("Coastal Malvani"),
        staffAmount: 4,
        mobileNo: "9960778899",
        registrationNo: "REST-RAT-002",
        status: "APPROVED",
      },
      {
        user: ownerId,
        name: "Sahyadri Bhakri Kendra",
        district: getDistrictId("Kolhapur"),
        address: "Fort Road, Near Panhala Fort, Kolhapur, Maharashtra",
        pricePerHour: 120,
        tableCount: 10,
        chefQualification: "Traditional Pitla-Bhakri Expert",
        resturentImages: [
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
        ],
        registrationImages: [
          "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80"
        ],
        returentType: getTypeId("Traditional Maharashtrian"),
        staffAmount: 5,
        mobileNo: "9850223344",
        registrationNo: "REST-KOL-003",
        status: "APPROVED",
      },
      {
        user: ownerId,
        name: "Shivar Highway Dhaba",
        district: getDistrictId("Pune Rural"),
        address: "Pune-Nashik Highway, Narayangaon, Pune Rural, Maharashtra",
        pricePerHour: 180,
        tableCount: 15,
        chefQualification: "Rural Dhaba Tandoor Chef",
        resturentImages: [
          "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80"
        ],
        registrationImages: [
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
        ],
        returentType: getTypeId("Local Highway Dhaba"),
        staffAmount: 8,
        mobileNo: "9921445566",
        registrationNo: "REST-PUN-004",
        status: "APPROVED",
      },
    ];

    const createdRestaurants = await Resturent.insertMany(restaurantsData);
    console.log(`Successfully seeded ${createdRestaurants.length} local budget restaurants!`);

    console.log("Restaurant seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding restaurants:", error);
    process.exit(1);
  }
};

seedRestaurants();
