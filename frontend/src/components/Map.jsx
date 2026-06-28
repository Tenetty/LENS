import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet marker icon mismatch in React builds
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// City coordinate lookup database
const cityCoords = {
  colombo: [6.9271, 79.8612],
  nashik: [19.9975, 73.7898],
  pune: [18.5204, 73.8567],
  anuradhapura: [8.3114, 80.4037],
  kandy: [7.2906, 80.6337],
  galle: [6.0535, 80.2210],
  sigiriya: [7.9570, 80.7600]
};

const Map = ({ city = "", popupText = "Location", lat = null, lng = null }) => {
  // Determine coordinates based on city string or direct lat/lng props
  let position = [6.9271, 79.8612]; // Default Colombo fallback

  if (lat !== null && lng !== null) {
    position = [lat, lng];
  } else if (city) {
    // Find the first city matching our lookup table in case the city string is a list or has commas
    const cleanCity = city.toLowerCase();
    const matchedKey = Object.keys(cityCoords).find(key => cleanCity.includes(key));
    if (matchedKey) {
      position = cityCoords[matchedKey];
    }
  }

  return (
    <div style={{ height: '300px', width: '100%', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0', marginTop: '10px' }}>
      <MapContainer 
        center={position} 
        zoom={12} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="font-semibold">{popupText}</div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
