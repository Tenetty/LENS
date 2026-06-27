import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Searchbar = () => {
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    let searchUrl = "/vehicle";
    if (vehicleName.trim()) {
      searchUrl = `/vehicle/search/name/${vehicleName.trim()}`;
    } else if (pickupLocation.trim() && vehicleType) {
      searchUrl = `/vehicle/get/${vehicleType}/${pickupLocation.trim()}`;
    } else if (pickupLocation.trim()) {
      searchUrl = `/vehicle/location/get/${pickupLocation.trim()}`;
    } else if (vehicleType) {
      searchUrl = `/vehicle/type/get/${vehicleType}`;
    }

    try {
      const res = await axios.get(searchUrl);
      navigate("/vehicles", { state: res.data });
    } catch (err) {
      console.error("Vehicle search error", err);
      Swal.fire({
        icon: "error",
        title: "Search Failed",
        text: "Could not fetch vehicles. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white mt-4 lg:mt-[-52px] px-8 shadow-lg max-w-[950px] p-4 lg:text-left text-center h-full items-center mx-auto rounded-lg">
      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row justify-between px-4 items-end gap-4">
        <div className="flex flex-col w-full lg:w-auto">
          <label htmlFor="vehicleName" className="py-3 text-left font-semibold">
            Vehicle Name
          </label>
          <input
            type="text"
            className="border rounded-md p-3 lg:w-[200px] w-full"
            placeholder="e.g. Prius, Caravan"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-full lg:w-auto">
          <label htmlFor="vehicleType" className="py-3 text-left font-semibold">
            Vehicle Type
          </label>
          <select
            className="p-3 border rounded-md w-full lg:w-[150px]"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="">All</option>
            <option>E-Vehicles</option>
            <option>Car</option>
            <option>SUV</option>
            <option>Van</option>
            <option>Motor Bike</option>
            <option>Tuk Tuk</option>
            <option>Bus</option>
          </select>
        </div>

        <div className="flex flex-col w-full lg:w-auto">
          <label htmlFor="pickupLocation" className="py-3 text-left font-semibold">
            Pick-up Location
          </label>
          <input
            type="text"
            list="city"
            className="border rounded-md p-3 lg:w-[220px] w-full"
            placeholder="Boarding City"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          />
          <datalist id="city">
            <option value="Pune" />
            <option value="Nashik" />
            <option value="Matheran" />
            <option value="Mumbai" />
            <option value="Satara" />
            <option value="Kolhapur" />
            <option value="Nagpur" />
          </datalist>
        </div>

        <div className="lg:w-32 flex items-center w-full">
          <button
            type="submit"
            disabled={loading}
            className="font-bold text-white bg-[#41A4FF] hover:bg-blue-600 rounded-md p-3 text-center w-full transition duration-150"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Searchbar;
