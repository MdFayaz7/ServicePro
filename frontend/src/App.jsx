import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import ServicesPage from "./components/ServicesPage";
import ProviderLogin from "./components/ProviderLogin";
import ProviderRegister from "./components/ProviderRegister";
import ProviderDashboard from "./components/ProviderDashboard";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-gray-200">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/provider/login" element={<ProviderLogin />} />
          <Route path="/provider/register" element={<ProviderRegister />} />
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
