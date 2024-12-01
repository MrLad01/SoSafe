import React, { useState } from "react";
import SideBar from "../components/SideBar"; // Sidebar component for consistency

// Define an interface for the Impact type
interface Impact {
  title: string;
  stat: string;
  description: string;
}

const AdminAgency: React.FC = () => {
  const [milestones, setMilestones] = useState([{ year: "", event: "" }]);
  
  // Update impacts state to use the Impact interface
  const [impacts, setImpacts] = useState<Impact[]>([{ 
    title: "", 
    stat: "", 
    description: "" 
  }]);
  
  const [partnerships, setPartnerships] = useState([""]);

  const handleMilestoneChange = (index: number, field: "year" | "event", value: string) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index][field] = value;
    setMilestones(updatedMilestones);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { year: "", event: "" }]);
  };

  // Update handleImpactChange to work with the new Impact type
  const handleImpactChange = (
    index: number, 
    field: keyof Impact, 
    value: string
  ) => {
    const updatedImpacts = [...impacts];
    updatedImpacts[index][field] = value;
    setImpacts(updatedImpacts);
  };

  const addImpact = () => {
    setImpacts([...impacts, { 
      title: "", 
      stat: "", 
      description: "" 
    }]);
  };

  const handlePartnershipChange = (index: number, value: string) => {
    const updatedPartnerships = [...partnerships];
    updatedPartnerships[index] = value;
    setPartnerships(updatedPartnerships);
  };

  const addPartnership = () => {
    setPartnerships([...partnerships, ""]);
  };

  const handleSubmit = () => {
    // Handle form submission logic
    console.log({ milestones, impacts, partnerships });
    alert("Data saved!");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-[#006838] text-white p-4 text-xl font-bold text-center">
          Admin Agency Page
        </header>

        {/* About Section */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">About Ogun So-Safe Corps</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Type here..."
              type="text"
            />
          </div>

          {/* Our Establishment Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Our Establishment</h2>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter details..."
            ></textarea>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Establishment Act</h2>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter details..."
              type="text"
            />
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Constitutional Backing</h2>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter details..."
              type="text"
            />
          </div>

          {/* Milestones Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Milestones / Historical Timeline</h2>
            {milestones.map((milestone, index) => (
              <div key={index} className="flex space-x-4 mb-2">
                <input
                  type="number"
                  className="w-1/4 p-3 border border-gray-300 rounded-lg"
                  placeholder="Year"
                  value={milestone.year}
                  onChange={(e) => handleMilestoneChange(index, "year", e.target.value)}
                />
                <input
                  type="text"
                  className="w-3/4 p-3 border border-gray-300 rounded-lg"
                  placeholder="Event"
                  value={milestone.event}
                  onChange={(e) => handleMilestoneChange(index, "event", e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={addMilestone}
            >
              + Add More
            </button>
          </div>

          {/* Impacts Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Our Impact</h2>
            {impacts.map((impact, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Title"
                  value={impact.title}
                  onChange={(e) => handleImpactChange(index, "title", e.target.value)}
                />
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Stat"
                  value={impact.stat}
                  onChange={(e) => handleImpactChange(index, "stat", e.target.value)}
                />
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Description"
                  value={impact.description}
                  onChange={(e) => handleImpactChange(index, "description", e.target.value)}
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

          {/* Partnerships Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Government Partnership</h2>
            {partnerships.map((partnership, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder={`Partnership ${index + 1}`}
                  value={partnership}
                  onChange={(e) => handlePartnershipChange(index, e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={addPartnership}
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

export default AdminAgency;