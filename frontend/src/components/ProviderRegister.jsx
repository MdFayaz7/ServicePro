import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LocationPicker from "./LocatinPiker";
import axios from "axios";
const API_BASE = process.env.REACT_APP_API_URL; 


export default function ProviderRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    ownerName: "",
    workshopName: "",
    address: "",
    serviceType: "",
    imageURL: "",
    latitude: 28.6139,
    longitude: 77.209,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLocationSelect = (latlng) => {
    setFormData({ ...formData, latitude: latlng.lat, longitude: latlng.lng });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      // First register the user
      const userResponse = await axios.post("${API_BASE}/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        role: "provider"
      });

      // Then create provider profile
      const providerData = {
        ownerName: formData.ownerName,
        workshopName: formData.workshopName,
        address: formData.address,
        serviceType: formData.serviceType,
        imageURL: formData.imageURL,
        latitude: formData.latitude,
        longitude: formData.longitude,
        mobile: formData.mobile
      };

      await axios.post("${API_BASE}/api/providers", providerData, {
        headers: {
          Authorization: `Bearer ${userResponse.data.token}`
        }
      });

      setMessage("Registered successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/provider/login");
      }, 2000);
    } catch (error) {
      setMessage("Failed to register: " + (error.response?.data?.msg || error.message));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Register as Service Provider
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Create your provider account to start offering services
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Mobile
                </label>
                <input
                  type="tel"
                  name="mobile"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-accent">Business Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  name="ownerName"
                  required
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Business owner name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Workshop Name
                </label>
                <input
                  type="text"
                  name="workshopName"
                  required
                  value={formData.workshopName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Your workshop name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Service Type
                </label>
                <select
                  name="serviceType"
                  required
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select Service Type</option>
                  <option value="bike">Bike Mechanics</option>
                  <option value="car">Car Mechanics</option>
                  <option value="battery">Battery Shops</option>
                  <option value="carwash">Car Wash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Complete workshop address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="imageURL"
                  value={formData.imageURL}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Location Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Workshop Location
            </label>
            <div className="bg-gray-800 rounded-lg p-4">
              <LocationPicker onLocationSelect={handleLocationSelect} />
              <p className="mt-2 text-sm text-gray-400">
                Latitude: {formData.latitude.toFixed(4)}, Longitude: {formData.longitude.toFixed(4)}
              </p>
            </div>
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

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-primary hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register as Provider"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                to="/provider/login"
                className="font-medium text-primary hover:text-green-400"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
