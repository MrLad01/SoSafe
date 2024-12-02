import React, { useState } from "react";
import SideBar from "../components/SideBar"; // Sidebar component for consistency

// Define an interface for the Contact type
interface Contact {
  hotline: string;
  email: string;
  headquarters: string;
  workingHours: string;
}

const AdminContact: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { hotline: "", email: "", headquarters: "", workingHours: "" },
  ]);

  const handleExecutiveChange = (index: number, field: keyof Contact, value: string ) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value as any;
    setContacts(updatedContacts);
  };


  const handleSubmit = () => {
    // Handle form submission logic
    console.log(contacts);
    alert("Data saved!");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-[#006838] text-white p-4 text-xl font-bold text-center">
          Admin Contact Page
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2">Contact Us</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Type here..."
              type="text"
            />
          </div>

          {/* Executives Section */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            {contacts.map((executive, index) => (
              <div key={index} className="grid grid-cols-3 grid-rows-3 gap-2 -mb-20">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Hotline"
                  value={executive.hotline}
                  onChange={(e) => handleExecutiveChange(index, "hotline", e.target.value)}
                />
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Email"
                  value={executive.email}
                  onChange={(e) => handleExecutiveChange(index, "email", e.target.value)}
                />
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Headquarters"
                  value={executive.headquarters}
                  onChange={(e) => handleExecutiveChange(index, "headquarters", e.target.value)}
                />
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Working Hours"
                  value={executive.workingHours}
                  onChange={(e) => handleExecutiveChange(index, "workingHours", e.target.value)}
                />
              </div>
            ))}
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

export default AdminContact;
