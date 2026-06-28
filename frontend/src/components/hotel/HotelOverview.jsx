import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { BACKEND_URL } from "../../config";

const HotelOverview = () => {
  const [data, setData] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { id } = useParams();

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  useEffect(() => {
    axios
      .get(`/hotels/find/${id}`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleBookNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates");
      return;
    }
    navigate(`/hotel/${id}`, {
      state: {
        checkInDate,
        checkOutDate,
      },
    });
  };

  return (
    <div>
      <div className="lg:p-24 ">
        <h1 className="ml-18 md:ml-20 lg:ml-20 text-center lg:text-left py-5 font-bold text-3xl">
              {data.name} {data.type}
            </h1>
        <div className="flex justify-center items-center w-full flex-col lg:flex-row pt-12 lg:pt-0">
          <img
            src={data.HotelImg?.startsWith("http") ? data.HotelImg : `${BACKEND_URL}/api/hotels/images/${data.HotelImg}`}
            alt="Hotel Image"
            className=" w-[320px] md:w-[700px]  lg:w-[800px] rounded-lg mb-10"
          />

          <div className="lg:px-24">
            
            <h1 className="text-center md:text-left py-5 font-bold text-1.5xl">
              {data.title}
            </h1>
            <p className="max-w-[320px] md:max-w-[700px] lg:max-w-[600px] text-justify">
              {data.description}
            </p>
            <div className="flex items-center">
              <h1 className="font-bold py-5">City : </h1>
              <h1 className="px-4">{data.city}</h1>
            </div>

            

            <div className="flex flex-col md:flex-row py-4">
              <h1 className="text-[#41A4FF]">Free Cancellation available</h1>
            </div>

            <div className="flex flex-col md:flex-row py-4">
              <h1 className="text-[#636363]">
                {" "}
                Excellent location – {data.distance} Km from {data.city}
              </h1>
            </div>

            <div className="flex"></div>

            <div className="flex flex-col md:flex-row  py-4 justify-between lg:items-center">
              <div className="flex items-center">
                <h1 className="font-bold text-2xl">
                  Book a stay over Rs.{data.cheapestPrice}
                </h1>
                <h1 className="ml-3 md:text-1xl">/per day</h1>
              </div>
            </div>

            {/* Date Pickers and Book Now Button */}
            <div className="flex flex-col gap-3 mt-4 p-4 bg-gray-50 rounded-lg border">
              <h2 className="font-bold text-lg">Select Your Dates</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col">
                  <label className="font-semibold text-sm text-gray-600 mb-1">Check-in Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-semibold text-sm text-gray-600 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || new Date().toISOString().split("T")[0]}
                    className="border rounded-md p-2 w-full"
                  />
                </div>
              </div>
              <button
                onClick={handleBookNow}
                className="bg-[#41A4FF] text-white rounded-md font-bold p-3 mt-2 w-full md:w-[350px] lg:w-[300px] hover:bg-blue-600 transition-all duration-200"
              >
                Book Now
              </button>
            </div>
            
          </div>
        </div>
        
      </div>
      <h1 className="text-center lg:text-left py-5 font-bold text-2xl ml-10">
              Images of our hotel
            </h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-10">
  {data.HotelImgs &&
    data.HotelImgs.map((image, index) => (
      <img
        src={image?.startsWith("http") ? image : `${BACKEND_URL}/api/hotels/images/${image}`}
        alt={`Hotel Image ${index}`}
        key={index}
        class="ml-10 w-64 h-64 rounded-lg mb-2"
      />
    ))}
</div>

    </div>
  );
}; 

export default HotelOverview;