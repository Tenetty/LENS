import React, { useContext } from "react";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { HotelHero } from "../../components/hotel/HotelHero";
import { HotelSearchBar } from "../../components/hotel/HotelSearchBar";
import HotelCard from "../../components/hotel/HotelCard";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import SearchCard from "../../components/hotel/SearchCard";
import { AuthContext } from "../../context/authContext";

export const HotelHome = () => {
  const location = useLocation();
  const {data, date} = location.state ?? {};
  

  return (
    <div>
      <HotelHero />
      <HotelSearchBar />
      {data?.map((item) => (
        <SearchCard
        name={item.name}
        city={item.city}
        cheapestPrice={item.cheapestPrice}
        HotelImg={item.HotelImg}
        _id= {item._id}
        date={date}
        />
      
        
      ))}
      <div className="flex justify-between items-center px-10 mt-8 mb-4">
        <h1 className="md:text-2xl font-bold text-[#272727]">
          Hotels guests love
        </h1>
        <Link
          to="/hotels/map"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-5 rounded-xl transition duration-200 shadow-md flex items-center gap-2 text-sm"
        >
          🗺️ View all on Map
        </Link>
      </div>
      <HotelCard />
      
    </div>
  );
};
