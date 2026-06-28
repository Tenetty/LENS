import React, { useContext, useEffect, useState } from 'react'
import { FaFontAwesome, FaMinusCircle, FaWind, FaWindowClose } from 'react-icons/fa'
import useFetch from '../../hooks/useFetch'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../context/authContext';


const HotelReserve = ({setOpen,hotelId,checkInDate,checkOutDate,date_difference}) => {

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [selectedRooms, setSelectedRooms] = useState([]);
  const {data,loading,error} = useFetch(`/hotels/room/${hotelId}`)
  const [totalPrice, setTotalPrice] = useState(0);
  const [hotelName, setHotelName] = useState("");
  const [cheapestPrice, setCheapestPrice] = useState(0);
  const userName = user?.name;
  const totalDays = date_difference;

  // Fetch hotel name and cheapestPrice
  useEffect(() => {
    const fetchHotelInfo = async () => {
      try {
        const res = await axios.get(`/hotels/find/${hotelId}`);
        setHotelName(res.data.name || "Unknown Hotel");
        setCheapestPrice(res.data.cheapestPrice || 0);
      } catch (err) {
        console.error("Failed to fetch hotel info:", err);
      }
    };
    fetchHotelInfo();
  }, [hotelId]);

  // Filter out null entries (rooms that may have been deleted)
  const rooms = (data || []).filter(item => item !== null);

  useEffect(() => {
    if (selectedRooms.length > 0 && rooms.length > 0) {
      let price = 0;
      rooms.forEach((item) => {
        item.roomNumbers.forEach((roomNumber) => {
          if (selectedRooms.includes(roomNumber._id)) {
            price += item.price;
          }
        });
      });
      setTotalPrice(price * date_difference);
    } else {
      // Fallback to cheapestPrice when no individual rooms are selected
      setTotalPrice(cheapestPrice * date_difference);
    }
  }, [selectedRooms, data, date_difference, cheapestPrice]);

  if (!user) return null; // Avoid rendering if redirecting

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }
    return dates;
  };


  const alldates = getDatesInRange(checkInDate, checkOutDate);


  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );

    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };


  const handleClick = () => {
    if (selectedRooms.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No rooms selected",
        text: "Please select at least one room to proceed.",
      });
      return;
    }
    navigate("/hotelbooking", {
      state: {
        hotelId,
        hotelName,
        roomType: "Room Selection",
        checkInDate,
        checkOutDate,
        userName,
        userId: user._id,
        totalPrice,
        totalDays,
        selectedRooms,
        alldates
      }
    });
    setOpen(false);
  };

  return (
    <div class="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
  <div class="bg-white rounded-md p-8 max-w-md w-full h-[600px] overflow-y-auto">
    <div class="flex justify-end">
      <FaWindowClose
        class="text-gray-600 text-2xl cursor-pointer hover:text-red-500 transition-all duration-200"
        onClick={() => setOpen(false)}
      />
    </div>
    <div class="font-bold text-xl mb-2">{hotelName}</div>
    <div class="text-gray-500 mb-4">
      {checkInDate} → {checkOutDate} ({totalDays} days)
    </div>

    {loading ? (
      <div class="text-center py-8">Loading rooms...</div>
    ) : rooms.length === 0 ? (
      <div class="text-center py-8">
        <p class="text-gray-500 mb-4">No individual rooms configured for this hotel.</p>
        <p class="font-semibold">You can still reserve a stay at this hotel.</p>
      </div>
    ) : (
      <>
        <div class="font-bold text-lg mb-4">Select your rooms:</div>
        {rooms.map((item) => (
          <div class="mb-6" key={item._id}>
            <div class="font-bold mb-2">{item.title}</div>
            <div class="text-gray-600 mb-4">{item.description}</div>
            <div class="flex items-center mb-4">
              <div class="font-semibold mr-2">Max people:</div>
              <div class="text-gray-600">{item.maxPeople}</div>
            </div>

            <div class="flex items-center mb-4">
              <div class="font-semibold mr-2">Price per day:</div>
              <div class="text-gray-600">Rs. {item.price}</div>
            </div>
            <div class="grid grid-cols-3 gap-4">
              {item.roomNumbers.map((roomNumber) => (
                <div class="flex flex-col items-center" key={roomNumber.number}>
                  <div class="font-bold mb-2">{roomNumber.number}</div>
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      value={roomNumber._id}
                      onChange={handleSelect}
                      disabled={!isAvailable(roomNumber)}
                      class="mr-2 cursor-pointer"
                    />
                    <div class={isAvailable(roomNumber) ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                      {isAvailable(roomNumber) ? "Available" : "Unavailable"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </>
    )}

    <div class="flex justify-between items-center mt-6">
      <div class="font-bold text-lg">Total Payment: Rs.{totalPrice}</div>
    </div>
    <button
      onClick={handleClick}
      class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-all duration-200 mt-6 w-full"
    >
      Reserve now
    </button>
  </div>
</div>

    );
    
    

};

export default HotelReserve