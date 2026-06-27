const router = require("express").Router();
const vehicleController = require("../controllers/vehicleController");
const { requireVehicleOwner, requireAdmin } = require("../middleware/authMiddleware");

router
        .route("/")
        .post(requireVehicleOwner, vehicleController.addVehicle) //add a new vehicle - vehicle owner                         
        .get(vehicleController.getAllVehicle)   //get all vehicles - vehicle admin                      
        
router
        .route("/:id")
        .get(vehicleController.getSpecificvehicle) //get a specific vehicle by id - vehicle admin           
        .delete(requireVehicleOwner, vehicleController.deleteVehicle) //delete a vehicle by id - vehicle owner/admin               
        .patch(requireVehicleOwner, vehicleController.updateVehicle) //update a vehicle - vehicle owner                      
        
router
        .route("/accept/:id")
        .get(requireAdmin, vehicleController.acceptVehicle) //accept a vehicle - vehicle admin                        

router
        .route("/myvehicles/:userId")
        .get(vehicleController.getMyVehicles) //get all vehicles of a specific user - vehicle owner  
        
//router to get vehicles by location and type 
router
        .route("/get/:vehicleType/:location")
        .get(vehicleController.getVehiclesByTypeAndLocation) //get all vehicles by location and type - vehicle admin


router
        .route("/type/get/:vehicleType")
        .get(vehicleController.getVehicleByType) //get all vehicles by type - vehicle admin postman tested

router
        .route("/location/get/:location")
        .get(vehicleController.getVehicleByLocation) //get all vehicles by location - vehicle admin postman tested
        
router
        .route("/search/name/:name")
        .get(vehicleController.getVehiclesByName) //get vehicles by brand or model

//tested by using postman. all routes working well.


module.exports = router;