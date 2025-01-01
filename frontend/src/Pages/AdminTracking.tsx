import SideBar from "../components/SideBar"; 

const AdminTracking: React.FC = () => {

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-[#006838] text-white p-4 text-xl font-bold text-center">
          Admin Tracking Page
        </header>
       <div className="flex justify-start items-center px-24 py-12">
        <div className=" flex align-middle text-center text-black font-bold border border-gray-700 rounded-xl w-6/12 h-[60px] p-4">
            <p>Admin logged in at 3:05 pm</p>
        </div>
       </div>
      </div>
    </div>
  );
};

export default AdminTracking;