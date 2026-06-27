
const Room = require("../models/Room.js");
const Hotel = require("../models/Hotel.js");


const createRoom= async (req,res,next) =>{
    const hotelId=req.params.hotelid;
    
    // Check ownership
    try {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) return res.status(404).json({ message: "Hotel not found" });
        if (hotel.owner && req.user && hotel.owner.toString() !== req.user._id.toString() && req.user.role !== "Admin" && !req.user.isAdmin) {
            return res.status(403).json({ message: "You can only add rooms to your own hotel" });
        }
    } catch(err) {
        return next(err);
    }

    const newRoom=new Room(req.body)

    try{
            const savedRoom =await newRoom.save()
            try{
                await Hotel.findByIdAndUpdate(hotelId, {$push :{rooms: savedRoom._id}})
            }catch(err){
                next(err)
            }
            res.status(200).json(savedRoom);
    }catch(err){
        next(err)
    }   
}

const updateRoom =async (req,res,next)=>{
    try{
        // To properly check ownership, we'd need the hotel context. 
        // For security, checking if the user is a manager or admin is done in routes.
        const updatedRoom= await Room.findByIdAndUpdate(req.params.id, {$set:req.body}
            ,{new:true})
        res.status(200).json(updatedRoom);

    }catch(err){
        next(err);
    }
}

const updateRoomAvailability =async (req,res,next)=>{
    try{
        console.log(req.body.dates)
        await Room.updateOne({"roomNumbers._id":req.params.id},{
            
            $push:{
                
                "roomNumbers.$.unavailableDates": { $each: req.body.dates }
            }
        })
        res.status(200).json("room updatedd");

    }catch(err){
        next(err);
    }
}



const deleteRoom =async (req,res,next)=>{
    const hotelId=req.params.hotelid;
    
    // Check ownership
    try {
        if (hotelId) {
            const hotel = await Hotel.findById(hotelId);
            if (hotel && hotel.owner && req.user && hotel.owner.toString() !== req.user._id.toString() && req.user.role !== "Admin" && !req.user.isAdmin) {
                return res.status(403).json({ message: "You can only delete rooms from your own hotel" });
            }
        }
    } catch(err) {
        return next(err);
    }

    try{
        const deleteRoom= await Room.findByIdAndDelete(req.params.id);
        try{
            await Hotel.findByIdAndUpdate(hotelId, {$pull :{rooms: req.params.id}})
        }catch(err){
            next(err)
        }
        res.status(200).json("Room has been deleted.");

    }catch(err){
        res.status(500).json(err);
    }
}

const getRoom=async (req,res,next)=>{
    try{
        const viewRoom= await Room.findById(req.params.id);
        res.status(200).json(viewRoom);

    }catch(err){
        next(err);
    }
}

const getAllRoom =async (req,res,next)=>{
    try{
        const Rooms= await Room.find();
        res.status(200).json(Rooms);

    }catch(err){
        res.status(500).json(err);
    }
}

module.exports = {
    createRoom, updateRoom, deleteRoom, getRoom, getAllRoom,updateRoomAvailability
  };
