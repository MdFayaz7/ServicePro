import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState('');
  const [providers, setProviders] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const serviceTypes = [
    { value: 'bike', label: 'Bike Mechanics' },
    { value: 'car', label: 'Car Mechanics' },
    { value: 'battery', label: 'Battery Shops' },
    { value: 'carwash', label: 'Car Wash' }
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location services.');
        }
      );
    }
  }, []);

  const searchProviders = async () => {
    if (!selectedService || !userLocation) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:3001/api/providers/nearby`, {
        params: {
          serviceType: selectedService,
          lat: userLocation.lat,
          lng: userLocation.lng,
          radius: 25 // 200km radius
        }
      });
      setProviders(response.data);
    } catch (error) {
      setError('Failed to fetch providers. Please try again.');
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Find Service Providers</h1>

        {/* Service Selection */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <label className="text-lg font-semibold">Select Service Type:</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
            >
              <option value="">Choose a service...</option>
              {serviceTypes.map(service => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
            <button
              onClick={searchProviders}
              disabled={!selectedService || !userLocation || loading}
              className="bg-primary hover:bg-green-600 disabled:bg-gray-600 text-black font-bold py-2 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Searching...' : 'Find Providers'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {providers.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Providers List */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Nearby Providers</h2>
              {providers.map((provider, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  {/* Provider Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-primary">{provider.workshopName}</h3>
                      <p className="text-gray-400">Owner: {provider.ownerName}</p>
                      <p className="text-gray-400">Contact: {provider.mobile}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-accent text-white px-3 py-1 rounded-full text-sm">
                        {provider.serviceType}
                      </span>
                      {userLocation && (
                        <p className="text-sm text-gray-300 mt-2">
                          {calculateDistance(
                            userLocation.lat, userLocation.lng,
                            provider.latitude, provider.longitude
                          ).toFixed(1)} km away
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Provider Image */}
                  

                  
  <img
    src={provider.imageURL}
    alt={provider.workshopName}
    className="w-full h-20 object-cover rounded-lg mb-4"
  />


                    


                  {/* Provider Details */}
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-300">
                      <span className="font-semibold">Address:</span> {provider.address}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold">Coordinates:</span> {provider.latitude.toFixed(4)}, {provider.longitude.toFixed(4)}
                    </p>
                  </div>

                  {/* Services Offered */}
                  {provider.services && provider.services.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold text-white mb-3">Services Offered:</h4>
                      <div className="space-y-3">
                        {provider.services.map((service, serviceIndex) => (
                          <div key={serviceIndex} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="text-primary font-semibold">{service.name}</h5>
                              <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                                ₹{service.price}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{service.description}</p>
                            {service.imageURL && (
                              <img
                              src={service.imageURL}
                              alt={service.name}
                              className="w-full h-80 object-cover rounded shadow-md border border-gray-300"
                            />
                            
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="h-[400px] lg:h-full">
              <MapContainer
                center={userLocation || [28.6139, 77.209]}
                zoom={10}
                className="h-full w-full rounded-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* User location marker */}
                {userLocation && (
                  <Marker position={[userLocation.lat, userLocation.lng]}>
                    <Popup>Your Location</Popup>
                  </Marker>
                )}

                {/* Provider markers */}
                {providers.map((provider, index) => (
                  <Marker
                    key={index}
                    position={[provider.latitude, provider.longitude]}
                  >
                    <Popup>
                      <div className="max-w-xs">
                        <h3 className="font-bold text-lg">{provider.workshopName}</h3>
                        <p className="text-sm text-gray-600">Owner: {provider.ownerName}</p>
                        <p className="text-sm text-gray-600">Phone: {provider.mobile}</p>
                        <p className="text-sm text-gray-600">{provider.address}</p>
                        {userLocation && (
                          <p className="text-sm font-semibold text-green-600">
                            {calculateDistance(
                              userLocation.lat, userLocation.lng,
                              provider.latitude, provider.longitude
                            ).toFixed(1)} km away
                          </p>
                        )}
                        {provider.services && provider.services.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-semibold">Services:</p>
                            <ul className="text-xs text-gray-600">
                              {provider.services.slice(0, 3).map((service, serviceIndex) => (
                                <li key={serviceIndex}>• {service.name} - ₹{service.price}</li>
                              ))}
                              {provider.services.length > 3 && (
                                <li className="text-gray-500">... and {provider.services.length - 3} more</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}

        {providers.length === 0 && selectedService && !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No providers found for this service in your area.</p>
          </div>
        )}
      </div>
    </div>
  );
}
