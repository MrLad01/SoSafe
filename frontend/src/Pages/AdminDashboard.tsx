import React from "react";
import SideBar from "../components/SideBar";

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
        <SideBar />
      <div className="flex-1">
        {/* Header */}
        <header className="bg-[#006838] text-white p-4 text-xl font-bold text-center">
        OGUN SO-SAFE CORPS Admin Dashboard
        </header>

        {/* Main Content */}
        <div className="p-4">
          <div className="text-lg font-semibold">
            <h4>Welcome, <span className="text-yellow-300">Name of Admin</span></h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
