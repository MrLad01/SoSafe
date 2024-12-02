import React, { useState } from "react";
import SideBar from "../components/SideBar"; // Sidebar component for consistency

// Define an interface for the Department type
interface Department {
  title: string;
  description: string;
  head: string;
  image: File | null; // Image file
}

const AdminDepartments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([
    { title: "", description: "", head: "", image: null },
  ]);

  const handleDepartmentChange = (index: number, field: keyof Department, value: string | File | null) => {
    const updatedDepartments = [...departments];
    updatedDepartments[index][field] = value as any;
    setDepartments(updatedDepartments);
  };

  const addDepartment = () => {
    setDepartments([
      ...departments,
      { title: "", description: "", head: "", image: null },
    ]);
  };

  const handleSubmit = () => {
    // Handle form submission logic
    console.log(departments);
    alert("Data saved!");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-[#006838] text-white p-4 text-xl font-bold text-center">
          Admin Departments Page
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {/* Executives Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Departments</h2>
            {departments.map((department, index) => (
              <div key={index} className="grid grid-cols-2 grid-rows-3 gap-2 -mb-8">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Title"
                  value={department.title}
                  onChange={(e) => handleDepartmentChange(index, "title", e.target.value)}
                />
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Description"
                  value={department.description}
                  onChange={(e) => handleDepartmentChange(index, "description", e.target.value)}
                />
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  placeholder="Head"
                  value={department.head}
                  onChange={(e) => handleDepartmentChange(index, "head", e.target.value)}
                />
                <input
                  type="file"
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  onChange={(e) =>
                    handleDepartmentChange(index, "image", e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={addDepartment}
            >
              + Add More Department
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

export default AdminDepartments;
