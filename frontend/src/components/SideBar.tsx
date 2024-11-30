import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.webp";

const SideBar: React.FC = () => {
  return (
    <div className="w-64 bg-[#006838] text-white h-full flex flex-col">
      {/* Logo Section */}
      <div className="flex justify-center items-center py-4 border-b border-green-800">
        <img 
          src={logo} 
          alt="Logo" 
          className="w-16 h-14 object-cover"
        />
      </div>

      {/* Navigation Links */}
      <ul className="flex-1 p-4 space-y-4">
        <li className="hover:bg-green-600 p-2 rounded">
          <Link to="/admin/news" className="block text-white">News & Updates</Link>
        </li>
        <li className="hover:bg-green-600 p-2 rounded">
          <Link to="/admin/agency" className="block text-white">Agency</Link>
        </li>
        <li className="hover:bg-green-600 p-2 rounded">
          <Link to="/admin/management-team" className="block text-white">Management Team</Link>
        </li>
        <li className="hover:bg-green-600 p-2 rounded">
          <Link to="/admin/contact" className="block text-white">Contact</Link>
        </li>
        <li className="hover:bg-green-600 p-2 rounded">
          <Link to="/admin/department" className="block text-white">Department</Link>
        </li>
        <li className="hover:bg-green-600 p-2 rounded">
          <Link to="/admin/personnel" className="block text-white">Personnel</Link>
        </li>
        <li className="hover:bg-green-600 p-2 rounded">
          <Link to="/login" className="block text-white">Log Out</Link>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
