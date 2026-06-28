import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import useFetch from "../../hooks/useFetch";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";
import { BACKEND_URL } from "../../config";

// Fix default leaflet marker icon links in React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Helper component to smoothly center/zoom Leaflet map
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5
    });
  }, [center, zoom, map]);
  return null;
}

const cityCoords = {
  colombo: [6.9271, 79.8612],
  nashik: [19.9975, 73.7898],
  pune: [18.5204, 73.8567],
  anuradhapura: [8.3114, 80.4037],
  kandy: [7.2906, 80.6337],
  galle: [6.0535, 80.2210],
  sigiriya: [7.9570, 80.7600]
};

const HotelMapPage = () => {
  // Fetch all hotels from backend API
  const { data, loading } = useFetch("/hotels");
  
  // State for active map focus
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]); // Default center (Sri Lanka center / general)
  const [mapZoom, setMapZoom] = useState(8);
  const [activeHotelId, setActiveHotelId] = useState(null);

  // Auto-center map based on the first loaded hotel's city
  useEffect(() => {
    if (data && data.length > 0) {
      const approvedHotels = data.filter(h => h.isApproved);
      if (approvedHotels.length > 0) {
        const firstCity = approvedHotels[0].city?.toLowerCase();
        const matchedKey = Object.keys(cityCoords).find(key => firstCity.includes(key));
        if (matchedKey) {
          setMapCenter(cityCoords[matchedKey]);
          setMapZoom(9);
        }
      }
    }
  }, [data]);

  // Extract coordinates for a hotel based on its city with a deterministic offset so pins do not overlap
  const getHotelCoordinates = (hotel) => {
    const defaultCoords = [6.9271, 79.8612];
    if (!hotel.city) return defaultCoords;

    const cleanCity = hotel.city.toLowerCase();
    const matchedKey = Object.keys(cityCoords).find(key => cleanCity.includes(key));
    const baseCoords = matchedKey ? cityCoords[matchedKey] : defaultCoords;

    // Use hotel ID characters to generate a unique, consistent offset so multiple hotels in the same city are scattered
    const lastDigits = hotel._id ? hotel._id.slice(-6) : "123456";
    const offsetLat = (parseInt(lastDigits.slice(0, 3), 16) % 100) / 2500 - 0.02;
    const offsetLng = (parseInt(lastDigits.slice(3, 6), 16) % 100) / 2500 - 0.02;

    return [baseCoords[0] + offsetLat, baseCoords[1] + offsetLng];
  };

  const approvedHotels = (data || []).filter((h) => h !== null && h.isApproved);

  const handleFocusHotel = (hotel) => {
    const coords = getHotelCoordinates(hotel);
    setMapCenter(coords);
    setMapZoom(14);
    setActiveHotelId(hotel._id);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Left Side: Hotels Sidebar */}
        <div className="w-full md:w-[450px] bg-white border-r flex flex-col h-full overflow-y-auto p-6">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Explore Hotel Locations</h1>
          <p className="text-gray-500 mb-6 text-sm">Select a hotel to locate it on the map and view details.</p>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading hotels...</div>
          ) : approvedHotels.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No hotels found in the database.</div>
          ) : (
            <div className="space-y-4">
              {approvedHotels.map((hotel) => {
                const isSelected = activeHotelId === hotel._id;
                return (
                  <div
                    key={hotel._id}
                    onClick={() => handleFocusHotel(hotel)}
                    className={`flex gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <img
                      src={
                        hotel.HotelImg?.startsWith("http")
                          ? hotel.HotelImg
                          : `${BACKEND_URL}/api/hotels/images/${hotel.HotelImg}`
                      }
                      alt={hotel.name}
                      className="w-24 h-24 object-cover rounded-lg border bg-gray-50 flex-shrink-0"
                    />
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm md:text-base leading-tight">
                          {hotel.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium mt-1">{hotel.city}, {hotel.province}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-blue-600 font-extrabold text-sm">
                          Rs. {hotel.cheapestPrice?.toLocaleString()} / night
                        </span>
                        <Link
                          to={`/hoteloverview/${hotel._id}`}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Map Container */}
        <div className="flex-1 h-[400px] md:h-full relative bg-gray-100">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", zIndex: 1 }}
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {approvedHotels.map((hotel) => {
              const coords = getHotelCoordinates(hotel);
              return (
                <Marker key={hotel._id} position={coords}>
                  <Popup>
                    <div className="p-1 max-w-[200px]">
                      <img
                        src={
                          hotel.HotelImg?.startsWith("http")
                            ? hotel.HotelImg
                            : `${BACKEND_URL}/api/hotels/images/${hotel.HotelImg}`
                        }
                        alt={hotel.name}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1">{hotel.name}</h4>
                      <p className="text-xs text-gray-500 mb-1">{hotel.city}</p>
                      <div className="flex justify-between items-center mt-2 border-t pt-2">
                        <span className="text-blue-600 font-extrabold text-xs">
                          Rs. {hotel.cheapestPrice}
                        </span>
                        <Link
                          to={`/hoteloverview/${hotel._id}`}
                          className="text-xs text-blue-500 font-bold hover:underline"
                        >
                          Details →
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default HotelMapPage;
