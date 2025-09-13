import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
const API_BASE = process.env.REACT_APP_API_URL; 
//1 line cgpt

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function ProviderDashboard() {
  const [user, setUser] = useState(null);
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    imageURL: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/provider/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchProviderData();
    fetchServices();
  }, [navigate]);

  const fetchProviderData = async () => {
    try {
      const token = localStorage.getItem('token');
      //const response = await axios.get('http://localhost:3001/api/providers/my-profile', {
      //headers: { Authorization: `Bearer ${token}` }
      //});

       const response = await axios.get(`${API_BASE}/api/providers/my-profile`, {
       headers: { Authorization: `Bearer ${token}` }
       });
       //above 3 cgpt
     
      
      setProvider(response.data);
    } catch (error) {
      console.error('Error fetching provider data:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      //const response = await axios.get('http://localhost:3001/api/services/my-services', {
      //  headers: { Authorization: `Bearer ${token}` }
      //});

     const response = await axios.get(`${API_BASE}/api/services/my-services`, {
     headers: { Authorization: `Bearer ${token}` }
     });



      
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Removed handleLocationSelect - services will use provider's registered coordinates

  const handleAddService = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      // Use provider's registered coordinates for the service
      const serviceData = {
        ...newService,
        latitude: provider.latitude,
        longitude: provider.longitude
      };
      
      //await axios.post('http://localhost:3001/api/services', serviceData, {
        //headers: { Authorization: `Bearer ${token}` }
      //});
      await axios.post(`${API_BASE}/api/services`, serviceData, {
      headers: { Authorization: `Bearer ${token}` }
      });

      
      setMessage('Service added successfully!');
      setNewService({
        name: '',
        description: '',
        price: '',
        imageURL: ''
      });
      setShowAddService(false);
      fetchServices();
    } catch (error) {
      setMessage('Failed to add service: ' + (error.response?.data?.msg || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/provider/login');
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Provider Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Provider Info */}
        {provider && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Your Profile</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-white">{provider.workshopName}</h3>
                <p className="text-gray-400">{provider.ownerName}</p>
                <p className="text-gray-400">{provider.address}</p>
                <p className="text-gray-400">Phone: {provider.mobile}</p>
                <span className="inline-block bg-accent text-white px-3 py-1 rounded-full text-sm mt-2">
                  {provider.serviceType}
                </span>
              </div>
              {provider.imageURL && (
                <div>
                  <img
                    src={provider.imageURL}
                    alt={provider.workshopName}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Services Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Services List */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Your Services</h2>
              <button
                onClick={() => setShowAddService(!showAddService)}
                className="bg-primary hover:bg-green-600 text-black font-bold py-2 px-4 rounded-lg transition-colors"
              >
                {showAddService ? 'Cancel' : 'Add Service'}
              </button>
            </div>

            {/* Add Service Form */}
            {showAddService && (
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Add New Service</h3>
                <form onSubmit={handleAddService} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Service Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="e.g., Oil Change, Brake Repair"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Describe your service..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Service Location
                    </label>
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-300 mb-2">
                        <span className="font-semibold">Workshop Location:</span> {provider?.address}
                      </p>
                      <p className="text-sm text-gray-400">
                        Lat: {provider?.latitude?.toFixed(4)}, Lng: {provider?.longitude?.toFixed(4)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Services will be offered from your registered workshop location
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={newService.imageURL}
                      onChange={(e) => setNewService({ ...newService, imageURL: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="https://example.com/service-image.jpg"
                    />
                  </div>

                  {message && (
                    <div className={`rounded-md p-4 ${
                      message.includes('successfully') 
                        ? 'bg-green-900/50 text-green-200' 
                        : 'bg-red-900/50 text-red-200'
                    }`}>
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Service'}
                  </button>
                </form>
              </div>
            )}

            {/* Services List */}
            <div className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-primary">{service.name}</h3>
                      <p className="text-gray-400">{service.description}</p>
                    </div>
                    <span className="bg-accent text-white px-3 py-1 rounded-full text-sm">
                      ₹{service.price}
                    </span>
                  </div>
                  
                  {service.imageURL && (
                    <img
                      src={service.imageURL}
                      alt={service.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold">Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        service.status === 'active' 
                          ? 'bg-green-900 text-green-200' 
                          : 'bg-red-900 text-red-200'
                      }`}>
                        {service.status}
                      </span>
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold">Location:</span> {provider?.address}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold">Coordinates:</span> {service.latitude.toFixed(4)}, {service.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="h-96 lg:h-full">
            <h3 className="text-xl font-semibold text-white mb-4">Service Locations</h3>
            <MapContainer
              center={provider ? [provider.latitude, provider.longitude] : [28.6139, 77.209]}
              zoom={12}
              className="h-full w-full rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Provider location */}
              {provider && (
                <Marker position={[provider.latitude, provider.longitude]}>
                  <Popup>
                    <div>
                      <h3 className="font-bold">{provider.workshopName}</h3>
                      <p>{provider.address}</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Service locations */}
              {services.map((service, index) => (
                <Marker
                  key={index}
                  position={[service.latitude, service.longitude]}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{service.name}</h3>
                      <p>{service.description}</p>
                      <p>Price: ₹{service.price}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

