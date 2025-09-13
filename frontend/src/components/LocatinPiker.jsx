import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

const LocationPicker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState([28.6139, 77.209]); // Default Delhi

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect(e.latlng);
      }
    });
    return <Marker position={position} />;
  }

  return (
    <MapContainer center={position} zoom={11} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default LocationPicker;
