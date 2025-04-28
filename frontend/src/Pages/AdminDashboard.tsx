import React from "react";
import SideBar from "../components/SideBar";
import FileUploader from "../components/FileUploader";
import { useAuth } from "../context/AuthContext";
import ZoneFileUploader from "../components/ZoneFileUploader";
import DivisionFileUploader from "../components/DivisionFileUploader";
import AreaFileUploader from "../components/AreaFileUploader";


const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <SideBar />
      <div className="flex-1">
        <header className="bg-[#006838] text-white text-[0.85rem] p-4 text-xl font-bold text-center">
          OGUN SO-SAFE CORPS Admin Dashboard
        </header>

        <div className="p-6 pb-20 h-[100vh] relative overflow-y-scroll">
          <div className="text-lg font-semibold mb-6">
            <h4>Welcome, <span className="text-yellow-500 shadow-sm p-2">{user?.name}</span></h4>
          </div>
          <div className="flex space-x-4 px-10">
            <div className="flex flex-col w-full space-y-3">
              <FileUploader />
              <DivisionFileUploader />
            </div>
            <div className="flex flex-col w-full space-y-3">
              <ZoneFileUploader />
              <AreaFileUploader />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;