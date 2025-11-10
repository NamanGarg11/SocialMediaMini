import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center fixed top-0 left-0 z-50">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center space-x-2 cursor-pointer select-none"
      >
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 bg-blue-500 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-orange-500"></div>
          </div>
        </div>
        <h1 className="text-lg font-bold">
          <span className="text-orange-500">Task</span>
          <span className="text-blue-500">Planet</span>
        </h1>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6 text-gray-700 font-medium">
        <Link to="/" className="hover:text-blue-600 transition-colors duration-200">
          Feed
        </Link>
        <Link to="/create" className="hover:text-blue-600 transition-colors duration-200">
          Create
        </Link>
        <Link to="/login" className="hover:text-blue-600 transition-colors duration-200">
          Login
        </Link>
        <Link to="/register" className="hover:text-blue-600 transition-colors duration-200">
          Register
        </Link>
        <button
          onClick={handleLogout}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
