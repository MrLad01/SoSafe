import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import Footer from '../components/Footer';
import { Department, departmentData } from '../data/departmentData';

const DepartmentsPage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const handleDepartmentClick = (department: Department) => {
    setSelectedDepartment(department);
  };

  return (
    <div className="">
        <NavBar />
        <div className="flex min-h-screen bg-gray-100">
        {/* Main Content */}
        <div className="flex-1 p-8">
            {selectedDepartment ? (
            <div className="bg-white shadow-md rounded-md">
                <div className="overflow-hidden rounded-t-md">
                <img
                    src={selectedDepartment.image}
                    alt={selectedDepartment.title}
                    className="w-full h-64 object-cover"
                />
                </div>
                <div className="p-8">
                <h2 className="text-3xl font-bold mb-4">{selectedDepartment.title}</h2>
                <p className="text-gray-700 leading-relaxed">{selectedDepartment.description}</p>
                <h2 className="text-lg font-bold my-8">Head of Department: {selectedDepartment.head}</h2>
                </div>
            </div>
            ) : (
            <div className="flex justify-center items-center h-full">
                <p className="text-gray-500 text-3xl opacity-20">Please select a department from the sidebar.</p>
            </div>
            )}
        </div>

        {/* Sidebar */}
        <div className="bg-white shadow-md p-6 flex-shrink-0 w-64 hidden md:block">
            <h2 className="text-2xl font-bold mb-6">Departments</h2>
            <nav>
            {departmentData.map((department, index) => (
                <a
                key={index}
                href="#"
                onClick={() => handleDepartmentClick(department)}
                className={`flex items-center justify-between py-3 px-4 rounded-md hover:bg-green-50 transition-colors ${selectedDepartment === department ? 'bg-green-50 text-green-800' : 'text-gray-700'}`}
                >
                <span>{department.title}</span>
                <ChevronLeft className="w-5 h-5 text-green-600" />
                </a>
            ))}
            </nav>
        </div>
        </div>
        <Footer />
    </div>
  );
};

export default DepartmentsPage;