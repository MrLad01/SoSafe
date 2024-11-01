import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { NavBar } from './NavBar';
import Footer from './Footer';
import { 
  CalendarDays, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
//   Award, 
  Briefcase 
} from 'lucide-react';

interface PersonState {
  name: string;
  rank: string;
  image: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  achievements: string[];
  yearJoined: string;
}

const PersonDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const state = location.state as PersonState;

  if (!state) {
    console.log(id)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006838]"></div>
      </div>
    );
  }

  const formatContent = (content: string | undefined) => {
    if (!content) return ['No information available'];
    return content.split('\n\n').filter(Boolean);
  };

  const bioParagraphs = formatContent(state.bio);

  return (
    <div className="min-h-screen scroll-smooth flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto py-6 px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-[#006838] hover:text-[#004d2b] transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous page
          </button>

          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="relative h-[425px] lg:h-[325px] bg-gradient-to-r from-[#006838]/10 to-[#006838]/5">
              <div className="absolute inset-0 flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-8 p-8">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#006838] shadow-xl">
                  <img 
                    src={state.image} 
                    alt={state.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center lg:text-left">
                  <div className="inline-block px-3 py-1 bg-[#FFD700] text-[#006838] text-sm font-bold rounded-full mb-2">
                    {state.rank}
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    {state.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-4 max-w-2xl">
                    {state.department}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Biography</h2>
                <div className="prose prose-base max-w-none">
                  {bioParagraphs.map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Achievements Section */}
                {state.achievements && state.achievements.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Notable Achievements</h2>
                    <ul className="list-disc list-inside space-y-2">
                      {state.achievements.map((achievement, index) => (
                        <li key={index} className="text-gray-700">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-5 sticky top-6 space-y-5">
                {/* Contact Information */}
                <div className="pb-5 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                  
                  {/* Email */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#006838] rounded-full p-1.5">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700 text-sm">{state.email}</p>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#006838] rounded-full p-1.5">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700 text-sm">{state.phone}</p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <div className="bg-[#006838] rounded-full p-1.5">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-700 text-sm">{state.location}</p>
                  </div>
                </div>

                {/* Department */}
                <div className="pb-5 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#006838] rounded-full p-1.5">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Department</h3>
                  </div>
                  <p className="text-gray-700 text-sm">{state.department}</p>
                </div>

                {/* Year Joined */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#006838] rounded-full p-1.5">
                      <CalendarDays className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Year Joined</h3>
                  </div>
                  <p className="text-gray-700 text-sm">{state.yearJoined}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PersonDetail;