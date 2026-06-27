import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export const HotelSearchBar = ({ type }) => {
  const [city, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [loading, setLoading] = useState(false);

  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in yyyy-mm-dd format
  const tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]; //get tomorrow date

  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Destination",
        text: "Please enter a destination city to search."
      });
      return;
    }
    if (!checkInDate || !checkOutDate) {
      Swal.fire({
        icon: "warning",
        title: "Missing Dates",
        text: "Please select both check-in and check-out dates."
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`/hotels/get/${city}`);
      const date = { checkInDate, checkOutDate };
      navigate('/hotelhome', { state: { date, data: res.data } });
    } catch (err) {
      console.error("Hotel search error", err);
      Swal.fire({
        icon: "error",
        title: "Search Failed",
        text: "Something went wrong while searching for hotels. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white mt-4 lg:mt-[0px] px-8 shadow-lg max-w-[1240px] p-4 lg:text-left text-center h-full items-center mx-auto rounded-lg">
      <form onSubmit={handleSearch} className="flex flex-col lg:flex-row justify-between px-4 items-end gap-4">
        <div className="flex flex-col w-full lg:w-auto">
          <label htmlFor="Location" className="py-3 ml-5 text-left font-semibold">
            Location
          </label>
          <input
            type="text"
            className="border rounded-md p-3 lg:w-[300px] w-full"
            placeholder="Where are you going? (e.g. Satara, Kolhapur)"
            value={city}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-full lg:w-auto">
          <label htmlFor="checkInDate" className="py-3 ml-5 text-left font-semibold">
            Check-In Date
          </label>
          <input
            type="date"
            min={currentDate} 
            className="border rounded-md p-3 w-full lg:w-[220px]"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-full lg:w-auto">
          <label htmlFor="returnDate" className="py-3 ml-5 text-left font-semibold">
            Check-Out Date
          </label>
          <input 
            type="date" 
            className="border rounded-md p-3 w-full lg:w-[220px]"
            min={tomorrowDate}
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)} 
          />
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
  )
}
