// HomePage.jsx
import React from "react";
import Navbar from "";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <Navbar />
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl mb-4">
            Simplify Client Management
          </h1>
          <p className="text-lg sm:text-xl mb-6">
            Your all-in-one solution to manage client relationships and track
            projects effortlessly.
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100">
            Get Started Now
          </button>
        </div>
      </header>
    </div>
  );
};

export default HomePage;
