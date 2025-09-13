import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const serviceImages = [
    {
      id: 1,
      title: "Bike Mechanics",
      description: "Professional bike repair and maintenance services",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      serviceType: "bike"
    },
    {
      id: 2,
      title: "Car Mechanics",
      description: "Expert car repair and servicing solutions",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      serviceType: "car"
    },
    {
      id: 3,
      title: "Battery Shops",
      description: "Car and bike battery replacement services",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      serviceType: "battery"
    },
    {
      id: 4,
      title: "Car Wash",
      description: "Professional car cleaning and detailing",
      image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      serviceType: "carwash"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % serviceImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [serviceImages.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Service Carousel */}
      <div className="relative h-screen overflow-hidden">
        {/* Carousel */}
        <div className="relative w-full h-full">
          {serviceImages.map((service, index) => (
            <div
              key={service.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${service.image})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="text-center text-white px-4 max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                      {service.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-gray-200">
                      {service.description}
                    </p>
                    <Link
                      to="/services"
                      className="inline-block bg-primary hover:bg-green-600 text-black font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                    >
                      Find Services Near You
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {serviceImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-primary' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Why Choose Our Platform?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Location-Based Search</h3>
              <p className="text-gray-400">Find service providers within 200km of your location</p>
            </div>

            <div className="text-center">
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Verified Providers</h3>
              <p className="text-gray-400">All service providers are verified and trusted</p>
            </div>

            <div className="text-center">
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Quick Service</h3>
              <p className="text-gray-400">Get connected with providers instantly</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-8">
            Whether you need a service or want to offer one, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="bg-primary hover:bg-green-600 text-black font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Find Services
            </Link>
            <Link
              to="/provider/register"
              className="bg-accent hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
