import React from "react";
import SideBar from "../components/SideBar"; 
import BiodataDisplay from "../components/BiodataDisplay";


const AdminDatabase: React.FC = () => {


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <BiodataDisplay />
      </div>
    </div>
  );
};

export default AdminDatabase;
