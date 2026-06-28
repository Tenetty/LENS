import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Admin from "../pages/Admin";
import VehicleHome from "../pages/vehicle/VehicleHome";
import VehicleBook from "../pages/vehicle/VehicleBook";
import VehiclePayment from "../pages/vehicle/VehiclePayment";
import Register from "../pages/Register";
import Userlist from "../pages/Userlist";
import ToursHome from "../pages/Tour/Home";
import TourDetails from "../pages/Tour/TourDetails";
import TourPayment from "../pages/Tour/TourPayment";
import TourView from "../pages/Tour/Admin/ViewTour";
import UpdateTour from "../pages/Tour/Admin/updateAddedTour";
import SearchResults from "../pages/Tour/SerachResults";
import AllTourCategories from "../components/Tour/AllTourCategories";
import AddTourPackage from "../pages/Tour/Admin/AddTourPackage";
import { AuthContext } from "../context/authContext";
import {
  hotelColumns,
  tourColumns,
  tourReservationColumns,
  trainColumns,
  userColumns,
  vehicleColumns,
  vehicleReservationColumns,
  resturentColumns,
} from "../components/datatable/datatablesource";
import Resturentslist from "../pages/Resturentslist";
import Vehiclelist from "../pages/Vehiclelist";
import Activity from "../pages/special_activity/Activity";
import PendingActivities from "../pages/special_activity/PendingActivities";
import FilterActivities from "../pages/special_activity/FilterActivities";
import ActivityForm from "../pages/special_activity/AddNewActivity";
import MyActivities from "../pages/special_activity/MyActivities";
import ReservationPage from "../pages/special_activity/Reservations";
import PendingReservationsPage from "../pages/special_activity/PendingReservations";
import UserpageA from "../pages/UserpageA";
import UpdateuserA from "../pages/UpdateuserA";
import Profile from "../pages/Profile";
import Profileupdate from "../pages/Profileupdate";

import TrainHome from "../pages/train/TrainHome";
import TrainBook from "../pages/train/TrainBook";
import AddNewTrain from "../pages/train/AddNewTrain";
import TrainHomeAdmmin from "../pages/train/TrainHomeAdmin";
import SingleTrainView from "../pages/train/SingleTrainView";
import AddPassengerDetails from "../pages/train/AddPassengerDetails";
import DoUpdateTrain from "../pages/train/DoUpdateTrain";

import Adduser from "../pages/Adduser";
import { HotelHome } from "../pages/hotel/HotelHome";
import AddHotel from "../pages/hotel/AddHotel";
import { AddRoom } from "../pages/hotel/AddRoom";
import UpdateHotel from "../pages/hotel/UpdateHotel";
import AddVehicle from "../pages/vehicle/AddVehicle";
import EditVehicle from "../pages/vehicle/EditVehicle";
import HotelView from "../components/hotel/HotelView";
import HotelOverView from "../components/hotel/HotelOverview";
import VehicleView from "../pages/vehicle/VehicleView";

import RestaurentForm from "../pages/Restaturant/RestaurantForm";
import HadminView from "../pages/hotel/HadminView";
import PendingHotels from "../pages/hotel/PendingHotels";
import HotelReserve from "../components/hotel/HotelReserve";
import Hotellist from "../pages/Hotellist";
import Tourlist from "../pages/Tourlist";
import Trainlist from "../pages/Trainlist";
import ContactUs from "../pages/ContactUs";
import HotelBook from "../pages/hotel/HotelBook";
import ResetPassword from "../pages/ResetPassword";
import Tourreservations from "../pages/Tourreservations";
import MyTourReservations from "../pages/MyTourReservations";
import MyHotelReservations from "../pages/hotel/MyHotelReservations";
import HotelManagerBookings from "../pages/hotel/HotelManagerBookings";
import AllReservations from "../pages/AllReservations";
import Vehiclereservation from "../pages/Vehiclereservation";
import MyVehicleReservations from "../pages/vehicle/MyVehicleReservations";
import ReviewTickets from "../pages/train/ReviewTickets";
import ReviewPanel from "../pages/train/ReviewPanel";
import MyTickets from "../pages/train/MyTickets";
import MyOneTicket from "../pages/train/MyOneTicket";
import TravelerHome from "../pages/train/TravelerHome";
import AddAdmin from "../pages/AddAdmin";

import { Main } from "../pages/Main";
import Refund from "../components/Refund";
import RefundReq from "../components/RefundReq";
import RefundUpdate from "../components/RefundUpdate";
import { SalaryCalculation } from "../pages/SalaryCalculation";
import { EmployeeList } from "../pages/EmployeeList";
import { SalarySheet } from "../pages/SalarySheet";
import { FinanceHealth } from "../pages/FinanceHealth";

const RouteTour = () => {
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const AdminRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
      return <Navigate to="/login" />;
    }
    if (user.role !== "Admin" && !user.isAdmin) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/add-admin"
        element={
          <AdminRoute>
            <AddAdmin />
          </AdminRoute>
        }
      />
      <Route path="/register" element={<Register />} />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Userlist columns={userColumns} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hotels"
        element={
          <ProtectedRoute>
            <Hotellist columns={hotelColumns} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tours"
        element={
          <ProtectedRoute>
            <Tourlist columns={tourColumns} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tourreservation/all"
        element={
          <ProtectedRoute>
            <Tourreservations columns={tourReservationColumns} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-tour-reservations"
        element={
          <ProtectedRoute>
            <MyTourReservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-hotel-reservations"
        element={
          <ProtectedRoute>
            <MyHotelReservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-reservations"
        element={
          <ProtectedRoute>
            <AllReservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/train"
        element={
          <ProtectedRoute>
            <Trainlist columns={trainColumns} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicle"
        element={
          <ProtectedRoute>
            <Vehiclelist columns={vehicleColumns} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurants"
        element={
          <ProtectedRoute>
            <Resturentslist columns={resturentColumns} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehiclereservation"
        element={
          <ProtectedRoute>
            <Vehiclereservation columns={vehicleReservationColumns} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-vehicle-reservations"
        element={
          <ProtectedRoute>
            <MyVehicleReservations />
          </ProtectedRoute>
        }
      />

      <Route path="/userpage" element={<UserpageA />} />
      <Route path="/update" element={<UpdateuserA />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/updateProfile" element={<Profileupdate />} />
      <Route path="/adduser" element={<Adduser />} />

      <Route path="/vehicles" element={<VehicleHome />} />
      <Route path="/vehicle/book/:id" element={<VehicleBook />} />
      <Route path="/vehicle/payment/" element={<VehiclePayment />} />
      <Route path="/vehicle/add" element={<AddVehicle />} />
      <Route path="/vehicle/edit/:id" element={<EditVehicle />} />
      <Route path="/vehicle/view/" element={<VehicleView />} />

      <Route path="/tours/home" element={<ToursHome />} />
      <Route path="/tours/:id" element={<TourDetails />} />
      <Route path="/tours/payment" element={<TourPayment />} />
      <Route
        path="/tours/search/:destination/:duration/:maxsize"
        element={<SearchResults />}
      />
      <Route path="/addtour" element={<AddTourPackage />} />
      <Route path="/tour/view" element={<TourView />} />
      <Route path="/tour/update" element={<UpdateTour />} />

      <Route path="/sunandbeach" element={<AllTourCategories />} />
      <Route path="/hikingandtrekking" element={<AllTourCategories />} />
      <Route path="/wildsafari" element={<AllTourCategories />} />
      <Route path="/special" element={<AllTourCategories />} />
      <Route path="/cultural" element={<AllTourCategories />} />
      <Route path="/festival" element={<AllTourCategories />} />

      <Route path="/contactus" element={<ContactUs />} />

      {/* Hansika */}
      <Route path="/add-new-activity" element={<ActivityForm />} />
      <Route path="/add-new-activity/:id" element={<ActivityForm />} />
      <Route path="/pending-activities" element={<PendingActivities />} />
      <Route
        path="/pending-reservations"
        element={<PendingReservationsPage />}
      />
      <Route path="/events" element={<FilterActivities />} />
      <Route path="/activities/:id" element={<Activity />} />
      <Route path="/my-activities" element={<MyActivities />} />
      <Route path="/my-reservations" element={<ReservationPage />} />


      <Route path="/train/book/:id" element={<TrainBook />} />
      <Route path="/admintrain/add" element={<AddNewTrain />} />
      <Route path="/adminTrain" element={<TrainHomeAdmmin />} />
      <Route path="/adminTrain/:id" element={<SingleTrainView />} />
      <Route path="/passengerDet" element={<AddPassengerDetails />} />
      <Route path="/train/book/:id" element={<TrainBook />} />
      <Route path="/train/update/:id" element={<DoUpdateTrain />} />
      <Route path="/TrainHome" element={<TravelerHome />} />
      <Route path="/adminTrain/reviewTicket/:id" element={<ReviewTickets />} />
      <Route path="/adminTrain/reviewPanel" element={<ReviewPanel />} />
      <Route path="/train/MyTickets" element={<MyTickets />} />
      <Route path="/train/MyTickets/:id" element={<MyOneTicket />} />

      <Route path="/addrestaurant" element={<RestaurentForm />} />

      <Route path="/train/book/:id" element={<TrainBook />} />
      <Route path="/train/add" element={<AddNewTrain />} />
      <Route path="/adminTrain" element={<TrainHomeAdmmin />} />
      <Route path="/adminTrain/:id" element={<SingleTrainView />} />
      <Route
        path="/train/book/passengerDet"
        element={<AddPassengerDetails />}
      />

      <Route path="/hotelhome" element={<HotelHome />} />
      <Route path="/hotels/new" element={<AddHotel />} />
      <Route path="/hotels/bookings" element={<HotelManagerBookings />} />
      <Route path="/rooms/new/:id" element={<AddRoom />} />
      <Route path="/hotels/update/:id" element={<UpdateHotel />} />
      <Route path="/hotel/:id" element={<HotelView />} />
      <Route path="/hoteloverview/:id" element={<HotelOverView />} />
      <Route path="/hoteladmin" element={<HadminView />} />
      <Route path="/hotelreserve/:id" element={<HotelReserve />} />
      <Route path="/hotelbooking" element={<HotelBook />} />
      <Route path="/pending-hotels" element={<AdminRoute><PendingHotels /></AdminRoute>} />

      {/* Navindi */}
      <Route path="/addrestaurants" element={<RestaurentForm />} />

      {/*Dinidu*/}
      <Route path="/finance" element={<Main />} />
      <Route path="/finance/salary" element={<SalaryCalculation />} />
      <Route path="/finance/employee" element={<EmployeeList />} />
      <Route path="/finance/salarySheet" element={<SalarySheet />} />
      <Route path="/finance/FinanceHealth" element={<FinanceHealth />} />
      {<Route path="/finance/refund" element={<Refund />} />}
      {<Route path="finance/addRefund" element={<RefundReq />} />}
      {<Route path="finance/updateRefund/:id" element={<RefundUpdate />} />}
    </Routes>
  );
};

export default RouteTour;
