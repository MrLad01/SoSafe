import React from "react";
import SideBar from "../components/SideBar";
import FileUploader from "../components/FileUploader";
import { useAuth } from "../context/AuthContext";


const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <SideBar />
      <div className="flex-1">
        <header className="bg-[#006838] text-white text-[0.85rem] p-4 text-xl font-bold text-center">
          OGUN SO-SAFE CORPS Admin Dashboard
        </header>

        <div className="p-4 pb-20 h-[100vh] relative overflow-y-scroll">
          <div className="text-lg font-semibold mb-6">
            <h4>Welcome, <span className="text-yellow-500 shadow-sm p-2">{user?.name}</span></h4>
          </div>

          <FileUploader />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;