import { useState } from 'react';
import { Menu, Home, LogOut } from 'lucide-react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

interface OfficerData {
  id: number;
  form_no: string;
  code: string;
  firstname: string;
  lastname: string;
  othername: string;
  address: string;
  phone_no: string;
  sex: string;
  community: string;
  za_command: string;
  division_command: string;
  service_code: string;
  position: string;
  date_engage: string;
  rank: string;
  nok: string;
  relationship: string;
  nok_phone: string;
  photo: string | null;
  qualification: string;
  created_at: string;
  updated_at: string;
}

const OfficerDashboard = () => {
  const { state } = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const officerData: OfficerData = state?.officerData || 
    JSON.parse(sessionStorage.getItem('officerData') || '{}');

  if (!officerData?.id) {
    return <Navigate to="/" replace />;
  }

  const profileImage = officerData.photo || "/api/placeholder/150/150";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Info card component for consistent styling
  const InfoCard = ({ label, value }: { label: string; value: string }) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <p className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm break-words">
        {value || 'Not Specified'}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col sm:flex-row">
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed sm:static inset-y-0 left-0 z-30
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
        transition-transform duration-300 ease-in-out
        w-64 bg-green-800 text-white
        sm:flex flex-col
      `}>
        <div className="p-4 flex flex-col h-full">
          {/* Logo Area */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-12 w-12 bg-white rounded-full" />
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-green-700 text-white">
              <Home className="h-5 w-5" />
              <span className="text-sm">Dashboard</span>
            </button>
          </nav>

          {/* Profile Quick Access */}
          <div className="border-t border-green-700 pt-4">
            <div className="flex items-center space-x-3 px-4 py-3">
              <img src={profileImage} alt="Profile" className="h-9 w-9 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium truncate">
                  {`${officerData.firstname} ${officerData.lastname}`}
                </p>
                <p className="text-xs text-green-300">{officerData.rank}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              title='sidebar toggle'
              className="p-2 rounded-lg hover:bg-gray-100 sm:hidden"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            <div className="hidden sm:block text-lg font-semibold text-gray-900">
              Officer Dashboard
            </div>
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center space-x-2 text-gray-700 hover:text-green-800"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Welcome, {`${officerData.firstname} ${officerData.othername} ${officerData.lastname}`}
            </h1>
            <div className="mt-2 space-y-1">
              <p className="text-sm sm:text-base text-gray-600">Form No: {officerData.form_no}</p>
              <p className="text-sm sm:text-base text-gray-600">Service Code: {officerData.service_code}</p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-6">Officer Profile</h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center p-4 sm:p-6 bg-gray-50 rounded-lg">
                  <div className="relative">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                  <h3 className="mt-4 text-base sm:text-lg font-semibold text-center">
                    {`${officerData.firstname} ${officerData.othername} ${officerData.lastname}`}
                  </h3>
                  <p className="text-sm text-gray-600">{officerData.rank} - {officerData.position}</p>
                  <p className="text-xs sm:text-sm text-gray-500">ID: {officerData.id}</p>
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Personal Information */}
                  <section className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold border-b pb-2">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoCard label="First Name" value={officerData.firstname} />
                      <InfoCard label="Last Name" value={officerData.lastname} />
                      <InfoCard label="Other Name" value={officerData.othername} />
                      <InfoCard label="Sex" value={officerData.sex} />
                      <InfoCard label="Phone Number" value={`0${officerData.phone_no}`} />
                      <InfoCard label="Address" value={officerData.address} />
                      <InfoCard label="Community" value={officerData.community} />
                    </div>
                  </section>

                  {/* Official Information */}
                  <section className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold border-b pb-2">Official Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoCard label="Form Number" value={officerData.form_no} />
                      <InfoCard label="Service Code" value={officerData.service_code} />
                      <InfoCard label="Rank" value={officerData.rank} />
                      <InfoCard label="Position" value={officerData.position} />
                      <InfoCard label="ZA Command" value={officerData.za_command} />
                      <InfoCard label="Division Command" value={officerData.division_command} />
                      <InfoCard label="Date Engaged" value={formatDate(officerData.date_engage)} />
                    </div>
                  </section>

                  {/* Next of Kin Information */}
                  <section className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold border-b pb-2">Next of Kin Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoCard label="Name" value={officerData.nok} />
                      <InfoCard label="Relationship" value={officerData.relationship} />
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OfficerDashboard;