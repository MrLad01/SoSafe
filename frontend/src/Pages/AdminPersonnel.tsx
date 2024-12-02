import React, { useState } from "react";
import SideBar from "../components/SideBar"; // Sidebar component for consistency

// Define an interface for the Stat type
interface Stat {
  value: string;
  label: string;
}

// Define an interface for the Feature type
interface Feature {
  title: string;
  description: string;
}

const AdminPersonnel: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([{ 
    value: "", 
    label: "", 
  }]);
  
  const [features, setFeatures] = useState<Feature[]>([{ 
    title: "", 
    description: "" 
  }]);

  const handleStatChange = (
    index: number, 
    field: keyof Stat, 
    value: string
  ) => {
    const updatedStats = [...stats];
    updatedStats[index][field] = value;
    setStats(updatedStats);
  };

  const addStat = () => {
    setStats([...stats, { 
      value: "", 
      label: "", 
    }]);
  };

  const handleFeatureChange = (
    index: number, 
    field: keyof Feature, 
    value: string
  ) => {
    const updatedFeatures = [...features];
    updatedFeatures[index][field] = value;
    setFeatures(updatedFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, { 
      title: "", 
      description: "" 
    }]);
  };



  const handleSubmit = () => {
    // Handle form submission logic
    console.log({  
      stats, 
      features, 
    });
    alert("Data saved!");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-[#006838] text-white p-4 text-xl font-bold text-center">
          Admin Personnel Page
        </header>

        {/* About Section */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Ogun So-Safe Corps Personnel</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Type here..."
              type="text"
            />
          </div>

          {/* Stats Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Stat</h2>
            {stats.map((stat, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Value"
                  value={stat.value}
                  onChange={(e) => handleStatChange(index, "value", e.target.value)}
                />
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Label"
                  value={stat.label}
                  onChange={(e) => handleStatChange(index, "label", e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={addStat}
            >
              + Add More Stat
            </button>
          </div>

          {/* Features Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            {features.map((feature, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Title"
                  value={feature.title}
                  onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                />
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Description"
                  value={feature.description}
                  onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={addFeature}
            >
              + Add More Feature
            </button>
          </div>

          {/*Quote Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Quote</h2>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter quote..."
            />
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

export default AdminPersonnel;