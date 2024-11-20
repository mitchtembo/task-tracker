import React from "react";
import Navbar from "../components/Navbar";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../libs/supabaseClient";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? "bg-indigo-700" : "";
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-indigo-600 text-white md:min-h-screen flex-shrink-0">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Clarity CMS</h2>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className={`block py-2 px-4 hover:bg-indigo-700 rounded ${isActiveLink('/dashboard')}`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/clients"
                className={`block py-2 px-4 hover:bg-indigo-700 rounded ${isActiveLink('/dashboard/clients')}`}
              >
                Clients
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/projects"
                className={`block py-2 px-4 hover:bg-indigo-700 rounded ${isActiveLink('/dashboard/projects')}`}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/settings"
                className={`block py-2 px-4 hover:bg-indigo-700 rounded ${isActiveLink('/dashboard/settings')}`}
              >
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        {/* Main Area */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
