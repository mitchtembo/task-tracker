import React from "react";
import { Link } from "react-router-dom";

const LandingNav = () => {
  return (
    <nav className="bg-transparent absolute w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              Clarity CMS
            </Link>
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default LandingNav;
