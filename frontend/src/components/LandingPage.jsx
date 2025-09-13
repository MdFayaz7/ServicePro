import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to ServicePro</h1>
      <Link
        to="/service-provider/register"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Be a Service Provider
      </Link>
    </div>
  );
}
