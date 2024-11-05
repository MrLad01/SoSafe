import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import Footer from '../components/Footer';
import { Department, departmentData } from '../data/departmentData';

const DepartmentsPage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDepartmentClick = (department: Department) => {
    setSelectedDepartment(department);
    setMobileMenuOpen(false);
  };

    // Add viewport height fix for iOS
    useEffect(() => {
        // Function to update CSS variable for viewport height
        const updateVH = () => {
          const vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
    
        // Initial call
        updateVH();
    
        // Update on resize and orientation change
        window.addEventListener('resize', updateVH);
        window.addEventListener('orientationchange', updateVH);
    
        return () => {
          window.removeEventListener('resize', updateVH);
          window.removeEventListener('orientationchange', updateVH);
        };
      }, []);

  // Mobile accordion content
  const MobileAccordion = () => (
    <div className="md:hidden w-full bg-white shadow-md rounded-md mb-6">
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="w-full flex items-center justify-between p-4 bg-green-50 rounded-t-md"
      >
        <span className="text-lg font-semibold text-green-800">
          {selectedDepartment ? selectedDepartment.title : 'Select Department'}
        </span>
        {mobileMenuOpen ? (
          <ChevronUp className="w-5 h-5 text-green-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-green-600" />
        )}
      </button>
      {mobileMenuOpen && (
        <div className="border-t border-gray-100">
          {departmentData.map((department, index) => (
            <button
              key={index}
              onClick={() => handleDepartmentClick(department)}
              className={`w-full flex items-center justify-between p-4 hover:bg-green-50 transition-colors ${
                selectedDepartment === department ? 'bg-green-50 text-green-800' : 'text-gray-700'
              } ${index !== departmentData.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span>{department.title}</span>
              <ChevronLeft className="w-5 h-5 text-green-600" />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Desktop sidebar content
  const DesktopSidebar = () => (
    <div className="bg-white shadow-md p-6 flex-shrink-0 w-64 hidden md:block rounded-md">
      <h2 className="text-2xl font-bold mb-6">Departments</h2>
      <nav>
        {departmentData.map((department, index) => (
          <button
            key={index}
            onClick={() => handleDepartmentClick(department)}
            className={`w-full flex justify-between py-3 px-4 rounded-md hover:bg-green-50 transition-colors ${
              selectedDepartment === department ? 'bg-green-50 text-green-800' : 'text-gray-700'
            } mb-2`}
          >
            <span className='text-left'>{department.title}</span>
            <ChevronLeft className="w-5 h-5 text-green-600" />
          </button>
        ))}
      </nav>
    </div>
  );

  // Department content
  const DepartmentContent = () => (
    <div className="bg-white shadow-md rounded-md">
      <div className="overflow-hidden rounded-t-md">
        <img
          src={selectedDepartment?.image}
          alt={selectedDepartment?.title}
          className="w-full h-48 md:h-64 object-cover"
        />
      </div>
      <div className="p-4 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{selectedDepartment?.title}</h2>
        <p className="text-gray-700 leading-relaxed">{selectedDepartment?.description}</p>
        <h2 className="text-lg font-bold my-6 md:my-8">
          Head of Department: {selectedDepartment?.head}
        </h2>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(var(--vh,1vh)*100)] flex flex-col">
      <NavBar />
      <div className="flex-1 bg-gray-100">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:space-x-6">
            {/* Mobile Accordion */}
            <MobileAccordion />

            {/* Main Content */}
            <div className="flex-1">
              {selectedDepartment ? (
                <DepartmentContent />
              ) : (
                <div className="flex justify-center items-center h-64 md:h-[80vh] bg-white rounded-md shadow-md">
                  <p className="text-gray-500 text-xl md:text-3xl opacity-20 px-4 text-center">
                    Please select a department to view details
                  </p>
                </div>
              )}
            </div>

            {/* Desktop Sidebar */}
            <DesktopSidebar />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DepartmentsPage;