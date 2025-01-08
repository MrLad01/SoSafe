import React, { useState } from "react";
import { officers } from "../data/Officers"; 
import SideBar from "../components/SideBar"; 
import BiodataDisplay from "../components/BiodataDisplay";

interface Officer {
  id: number;
  name: string;
  rank: string;
  zone: string;
  area: string;
}

const AdminDatabase: React.FC = () => {
  const [currentView, setCurrentView] = useState<"list" | "edit">("list");
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);

  // Handle edit button click
  const handleEdit = (officer: Officer) => {
    setSelectedOfficer(officer);
    setCurrentView("edit");
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedOfficer) {
      setSelectedOfficer({
        ...selectedOfficer,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Handle save button click
  const handleSave = () => {
    if (selectedOfficer) {
      console.log("Updated Officer Data:", selectedOfficer);
      alert("Officer data saved successfully!");
      setCurrentView("list");
      setSelectedOfficer(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* <header className="bg-[#006838] text-white p-4 text-xl font-bold text-center">
          {currentView === "list" ? "Ogun State Officer Data" : "Edit Officer"}
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {currentView === "list" ? (
            // Officer Data Table View
            <div className="p-6 bg-white shadow rounded-lg">
              <h1 className="text-xl font-bold mb-4">Officer Data</h1>
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Rank</th>
                    <th className="px-4 py-2 text-left">Zone</th>
                    <th className="px-4 py-2 text-left">Area</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {officers.map((officer) => (
                    <tr key={officer.id} className="border-b border-gray-200 last:border-b-0">
                      <td className="px-4 py-2">{officer.name}</td>
                      <td className="px-4 py-2">{officer.rank}</td>
                      <td className="px-4 py-2">{officer.zone}</td>
                      <td className="px-4 py-2">{officer.area}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEdit(officer)}
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Edit Officer Form View
            <div className="p-6 bg-white shadow rounded-lg">
              <h1 className="text-xl font-bold mb-4">Edit Officer</h1>
              {selectedOfficer && (
                <form className="space-y-4">
                  <div>
                    <label className="block font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedOfficer.name}
                      title="name"
                      readOnly
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Rank</label>
                    <input
                      type="text"
                      name="rank"
                      title="rank"
                      value={selectedOfficer.rank}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Zone</label>
                    <input
                      type="text"
                      name="zone"
                      title="zone"
                      value={selectedOfficer.zone}
                      onChange={handleInputChange}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="block font-medium">Area</label>
                    <input
                      type="text"
                      name="area"
                      title="area"
                      value={selectedOfficer.area}
                      readOnly
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="px-6 py-3 bg-green-800 text-white rounded-lg"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentView("list")}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div> */}
        <BiodataDisplay />
      </div>
    </div>
  );
};

export default AdminDatabase;
