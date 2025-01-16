import React, { useState } from "react";
import { NavLink, useNavigate  } from "react-router-dom";
import logo from "../assets/logo.webp";
import { Newspaper } from 'lucide-react';
import { Database } from 'lucide-react';
import { Group } from 'lucide-react';
import { Info } from 'lucide-react';
import { ClipboardList } from 'lucide-react';
import { Contact } from 'lucide-react';
import { Users } from 'lucide-react';
import { Activity } from 'lucide-react';
import { LogOut } from 'lucide-react';

const SideBar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    // Clear any authentication tokens or user data here if necessary
    console.log("User logged out");
    setIsModalOpen(false);
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login"); // Redirect to the login page
  };


  return (
    <div className="w-64 bg-[#006838] text-white text-[0.89rem] h-full flex flex-col relative">
      {/* Logo Section */}
      <NavLink to={`/admin`} className="flex justify-center items-center py-4 border-b border-green-800">
        <img src={logo} alt="Logo" className="w-16 h-14 object-cover" />
      </NavLink>

      {/* Navigation Links */}
      <ul className="flex-1 p-4 space-y-2">
        <li>
          <NavLink
            to="/admin/news"
            end
            className={({ isActive }) =>
              `flex p-2 rounded gap-2 ${isActive ? "bg-green-600" : "hover:bg-green-700 hover:shadow-sm"}`
            }
          >
            <Newspaper />
            News & Updates
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/agency"
            end
            className={({ isActive }) =>
              `flex p-2 rounded gap-2 ${isActive ? "bg-green-600" : "hover:bg-green-700 hover:shadow-sm"}`
            }
          >
            <Info />
            Agency
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/management-team"
            end
            className={({ isActive }) =>
              `flex p-2 rounded gap-2 ${isActive ? "bg-green-600" : "hover:bg-green-700 hover:shadow-sm"}`
            }
          >
            <ClipboardList />
            Management Team
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/contact"
            end
            className={({ isActive }) =>
              `flex p-2 rounded gap-2 ${isActive ? "bg-green-600" : "hover:bg-green-700 hover:shadow-sm"}`
            }
          >
            <Contact />
            Contact
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/departments"
            end
            className={({ isActive }) =>
              `flex p-2 rounded gap-2 ${isActive ? "bg-green-600" : "hover:bg-green-700 hover:shadow-sm"}`
            }
          >
            <Group />
            Department
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/personnel"
            end
            className={({ isActive }) =>
              `flex p-2 rounded gap-2 ${isActive ? "bg-green-600" : "hover:bg-green-700 hover:shadow-sm"}`
            }
          >
            <Users />
            Personnel
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/database"
            end
            className={({ isActive }) =>
              `flex p-2 rounded gap-2 ${isActive ? "bg-green-600" : "hover:bg-green-700 hover:shadow-sm"}`
            }
          >
            <Database />
            Database
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/tracking"
            end
            className={({ isActive }) =>
              `flex p-2 rounded gap-2 ${isActive ? "bg-green-600" : "hover:bg-green-700 hover:shadow-sm"}`
            }
          >
            <Activity />
            Tracking
          </NavLink>
        </li>
        <li>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex gap-2 p-2 w-full text-left rounded hover:bg-green-700 hover:shadow-sm"
          >
            <LogOut />
            Log Out
          </button>
        </li>
      </ul>

      {/* Logout Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center">
          <div className="bg-white py-8 px-10 rounded shadow-lg">
            <h3 className="text-xl text-black font-bold mb-4">Confirm Logout</h3>
            <p className="mb-6 text-black">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Yes
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
