const multer = require("multer");
const Vehicle = require("../models/Vehicle");
//const AcceptedVehicle = require("../models/AcceptedVehicle");
const path = require("path");

//image uploading path to diskStorage
const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "images")
    },
    filename : (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname) );
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('Only image files are allowed!'));
      }
      cb(null, true);
    }
  }).fields([
    { name: 'vehicleMainImg', maxCount: 1 },
    { name: 'insuranceImgs', maxCount: 2 },
    { name: 'vehicleImgs', maxCount: 5 }
  ]);



//add a vehicle - postman checked. working well.
exports.addVehicle = async(req, res) => {

    try {
        upload(req, res, async(err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Error uploading images" });
            }
            
    
            const newVehicle = new Vehicle({
                ...req.body,
                owner: req.user ? req.user._id : undefined,
                isAccepted: false,
                isApproved: false,
                vehicleMainImg: req.files.vehicleMainImg[0].filename,
                insuranceImgs: req.files.insuranceImgs.map(file => file.filename),
                vehicleImgs: req.files.vehicleImgs.map(file => file.filename)
            })

            await newVehicle.save();
            res.status(200).json(newVehicle);
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({message : err.message});
    }
}



//get all vehicles - vehicle admin             //postman checked. working well.
exports.getAllVehicle = async(req, res) => {
    try{
        const vehicles = await Vehicle.find();
        res.send(vehicles);
    }catch (err) {
        res.status(500).send(err.message);
    }
}


//get a specific vehicle by id - vehicle admin       postman checked. working well.
exports.getSpecificvehicle = async(req, res) => {
    const {id} = req.params;
    try{
        const specificVehicle = await Vehicle.findById({_id: id});     //without _id, it will not work ???
        res.send(specificVehicle);
    }catch(err){
        res.status(500).send(err.message);
    }
}



//delete a specific vehicle by id (Reject a vehicle from pending collection) - vehicle admin / owner
exports.deleteVehicle = async (req, res) => {
    const { id } = req.params;
    try {
      const dbVehicle = await Vehicle.findById(id);
      if (!dbVehicle) return res.status(404).send('Vehicle not found');

      // Only owner or Admin can delete
      if (dbVehicle.owner && req.user && dbVehicle.owner.toString() !== req.user._id.toString() && req.user.role !== "Admin" && !req.user.isAdmin) {
        return res.status(403).json({ message: "You can only delete your own vehicle" });
      }

      const vehicle = await Vehicle.findByIdAndDelete(id);
      res.send(vehicle);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };


//accept a vehicle by isAccepted change to true - vehicle admin
exports.acceptVehicle = async(req, res) => {
    const {id} = req.params;
    try{
        const vehicle = await Vehicle.findById(id);
        if(!vehicle){
            return res.status(404).send("Vehicle not found");
        }

        const accept = await Vehicle.findByIdAndUpdate(id, {isAccepted: true, isApproved: true}, {new: true}).populate("owner");

        if (accept && accept.owner && accept.owner.email) {
            const sendEmail = require("../utils/sendEmail");
            const emailText = `Hello ${accept.owner.name || "Vehicle Owner"},\n\nWe are pleased to inform you that your vehicle listing "${accept.brand} ${accept.model}" has been reviewed and APPROVED by our administrator.\n\nIt is now live on our platform and users can begin booking it.\n\nThank you for partnering with LENS!\n\nBest regards,\nLENS Administration Team`;
            
            const emailHtml = `
              <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
                <h2 style="color: #2b6cb0;">Congratulations!</h2>
                <p>Hello <strong>${accept.owner.name || "Vehicle Owner"}</strong>,</p>
                <p>We are pleased to inform you that your vehicle listing "<strong>${accept.brand} ${accept.model}</strong>" has been reviewed and <strong>APPROVED</strong> by our administrator.</p>
                <p>It is now live on our platform and users can begin booking it.</p>
                <br>
                <p>Thank you for partnering with LENS!</p>
                <p>Best regards,<br><strong>LENS Administration Team</strong></p>
              </div>
            `;

            sendEmail(accept.owner.email, `Vehicle Listing Approved - ${accept.brand} ${accept.model}`, emailText, emailHtml)
              .catch(err => console.error("Failed to send vehicle approval email:", err));
        }

        res.send(accept);

  }catch(err){
      res.status(500).send(err.message);
  }
}


//retrieve all my vehicle details - vehicle owner
exports.getMyVehicles = async(req, res) => {
    const { userId } = req.params;
    try{
        const myVehicles = await Vehicle.find({userId: userId});
        if(!myVehicles){
            res.status(404).send("No vehicles found");
        }
        res.send(myVehicles);
    }catch{
        res.status(500).send(err.message);
    }
}


//edit a specific vehicle details - vehicle owner 
exports.updateVehicle = async (req, res) => {
  const { id } = req.params;
  const  update = { price, description, location } = req.body;
  update.isAccepted = false; 
  update.isApproved = false;

  try {
    const dbVehicle = await Vehicle.findById(id);
    if (!dbVehicle) return res.status(404).send('Vehicle not found');

    if (dbVehicle.owner && req.user && dbVehicle.owner.toString() !== req.user._id.toString() && req.user.role !== "Admin" && !req.user.isAdmin) {
      return res.status(403).json({ message: "You can only update your own vehicle" });
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, update, { new: true });    //may be wrong
    
    res.send(updatedVehicle);
  } catch (err) {
    res.status(500).send(err.message);
  }
};



exports.availableVehicles = async (req, res) => {

  try{
      const availablevehicles = await Vehicle.aggregate([
          {
              $lookup: {
                  from: "reservations",
                  localField: "_id",
                  foreignField: "vehicleId",
                  as: "reservations"
              }
          },
          {
              $match: {
                  $and: [
                      { "reservations.pickupDate": { $lt: new Date(req.body.pickupDate) } },
                      { "reservations.returnDate": { $lt: new Date(req.body.pickupDate) } },
                      { "reservations.pickupDate": { $gt: new Date(req.body.returnDate) } },
                      { "reservations.returnDate": { $gt: new Date(req.body.returnDate) } },
                      { "location": req.body.location },
                      { "vehicleType": req.body.vehicleType }
                  ]
              }
          }
      ]);

      res.send(availablevehicles);
  }catch(err){
      res.status(500).send(err.message);

    }

}


//retrieve vehicles by vehicle type and location - vehicle owner
exports.getVehiclesByTypeAndLocation = async(req, res) => {
    const { vehicleType, location } = req.params;
    try{
        const vehicles = await Vehicle.find({
            vehicleType: vehicleType,
            location: { $regex: location, $options: "i" }
        });
        res.send(vehicles);
    }catch(err){
        res.status(500).send(err.message);
    }
}


//retrieve vehicles by vehicle type
exports.getVehicleByType = async (req, res) => {
    const {vehicleType} = req.params;
    try{
        const vehicles = await Vehicle.find({vehicleType: vehicleType});
        res.send(vehicles);
    }catch(err){
        res.status(500).send(err.message);
    }
}

//retrieve vehicles by location
exports.getVehicleByLocation = async (req, res) => {
    const {location} = req.params;
    try{
        const vehicles = await Vehicle.find({
            location: { $regex: location, $options: "i" }
        });
        res.send(vehicles);
    }catch(err){
        res.status(500).send(err.message);
    }
}

//retrieve vehicles by brand or model name
exports.getVehiclesByName = async (req, res) => {
    const { name } = req.params;
    try {
        const vehicles = await Vehicle.find({
            $or: [
                { brand: { $regex: name, $options: "i" } },
                { model: { $regex: name, $options: "i" } }
            ]
        });
        res.send(vehicles);
    } catch(err) {
        res.status(500).send(err.message);
    }
}






