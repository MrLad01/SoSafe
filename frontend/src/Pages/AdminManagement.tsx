import React, { useState } from "react";
import SideBar from "../components/SideBar"; // Sidebar component for consistency

// Define an interface for the Executive type
interface Executive {
  name: string;
  position: string;
  description: string;
  responsibilities: string;
  image: File | null; // Image file
}

const AdminManagement: React.FC = () => {
  const [executives, setExecutives] = useState<Executive[]>([
    { name: "", position: "", description: "", responsibilities: "", image: null },
  ]);

  const handleExecutiveChange = (index: number, field: keyof Executive, value: string | File | null) => {
    const updatedExecutives = [...executives];
    updatedExecutives[index][field] = value as any;
    setExecutives(updatedExecutives);
  };

  const addImpact = () => {
    setExecutives([
      ...executives,
      { name: "", position: "", description: "", responsibilities: "", image: null },
    ]);
  };

  const handleSubmit = () => {
    // Handle form submission logic
    console.log(executives);
    alert("Data saved!");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-[#006838] text-white p-4 text-xl font-bold text-center">
          Admin Management Page
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Our Management Team</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Type here..."
              type="text"
            />
          </div>

          {/* Executives Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Executive Leadership</h2>
            {executives.map((executive, index) => (
              <div key={index} className="grid grid-cols-2 grid-rows-3 gap-2 mb-8">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Name"
                  value={executive.name}
                  onChange={(e) => handleExecutiveChange(index, "name", e.target.value)}
                />
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Position"
                  value={executive.position}
                  onChange={(e) => handleExecutiveChange(index, "position", e.target.value)}
                />
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Description"
                  value={executive.description}
                  onChange={(e) => handleExecutiveChange(index, "description", e.target.value)}
                />
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Responsibilities"
                  value={executive.responsibilities}
                  onChange={(e) => handleExecutiveChange(index, "responsibilities", e.target.value)}
                />
                <input
                  type="file"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  onChange={(e) =>
                    handleExecutiveChange(index, "image", e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={addImpact}
            >
              + Add More
            </button>
          </div>

          {/* Save Button */}
          <div>
            <button
              type="button"
              className="px-6 py-3 bg-green-800 text-white rounded-lg"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
