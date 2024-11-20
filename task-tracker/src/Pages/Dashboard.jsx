import React from "react";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Your Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Client Management Card */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">Client Management</h2>
              <p className="text-blue-700 mb-4">Manage your client relationships and information.</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                View Clients
              </button>
            </div>

            {/* Project Tracking Card */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-green-900 mb-2">Project Tracking</h2>
              <p className="text-green-700 mb-4">Monitor and update your ongoing projects.</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                View Projects
              </button>
            </div>

            {/* Analytics Card */}
            <div className="bg-purple-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-900 mb-2">Analytics</h2>
              <p className="text-purple-700 mb-4">View insights and performance metrics.</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
