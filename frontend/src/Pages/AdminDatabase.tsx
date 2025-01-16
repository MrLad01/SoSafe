import React from "react";
// import { officers } from "../data/Officers"; 
import SideBar from "../components/SideBar"; 
import BiodataDisplay from "../components/BiodataDisplay";

// interface Officer {
//   id: number;
//   name: string;
//   rank: string;
//   zone: string;
//   area: string;
// }

const AdminDatabase: React.FC = () => {
  // const [currentView, setCurrentView] = useState<"list" | "edit">("list");
  // const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);


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
