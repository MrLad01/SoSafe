import React from "react";
import { NavLink } from "react-router-dom";
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
        <li>
          <NavLink
            to="/admin/news"
            end
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? "bg-green-600" : "hover:bg-green-500"}`
            }
          >
            News & Updates
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/agency"
            end
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? "bg-green-600" : "hover:bg-green-500"}`
            }
          >
            Agency
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/management-team"
            end
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? "bg-green-600" : "hover:bg-green-500"}`
            }
          >
            Management Team
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/contact"
            end
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? "bg-green-600" : "hover:bg-green-500"}`
            }
          >
            Contact
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/department"
            end
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? "bg-green-600" : "hover:bg-green-500"}`
            }
          >
            Department
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/personnel"
            end
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? "bg-green-600" : "hover:bg-green-500"}`
            }
          >
            Personnel
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            end
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? "bg-green-600" : "hover:bg-green-500"}`
            }
          >
            Log Out
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
