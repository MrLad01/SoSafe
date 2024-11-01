import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { NavBar } from './NavBar';
import Footer from './Footer';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Phone, 
  AlertCircle,
  Info,
  Share2,
  Printer,
  Mail
} from 'lucide-react';
import { useEffect } from 'react';

interface PersonAlertState {
  name: string;
  image: string;
  description: string;
  date: string;
  location: string;
  age?: string;
  height?: string;
  weight?: string;
  complexion?: string;
  distinguishingFeatures?: string;
  lastSeen?: string;
  status: 'missing' | 'wanted';
  caseNumber?: string;
  contactInfo: {
    phone: string;
    email?: string;
    department: string;
  };
  additionalDetails?: string;
}

interface ShareOptions {
    title: string;
    text: string;
    url: string;
}

const PersonAlertDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const state = location.state as PersonAlertState;


    // Reset scroll when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

  if (!state) {
    console.log(id)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006838]"></div>
      </div>
    );
  }

    // Utility function for sharing
    const shareContent = async (options: ShareOptions) => {
        try {
          if (navigator.share) {
            await navigator.share(options);
          } else {
            // Fallback to copy to clipboard
            await navigator.clipboard.writeText(`${options.title}\n${options.text}\n${options.url}`);
            alert('Link copied to clipboard!');
          }
        } catch (error) {
          console.error('Error sharing:', error);
        }
      };

  // Function to generate share link for a person
  const handleShare = async (person: PersonAlertState, type: 'missing' | 'wanted') => {
    const baseUrl = window.location.origin;
    const personSlug = person.name.toLowerCase().replace(/\s+/g, '-');
    const shareUrl = `${baseUrl}/${type}/${personSlug}`;
    
    await shareContent({
      title: `${type === 'missing' ? 'Missing Person' : 'Wanted Person'} Alert: ${person.name}`,
      text: `Last seen: ${person.location} on ${person.date}. ${person.description}`,
      url: shareUrl
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen scroll-smooth flex flex-col">
      <NavBar />
      <main className="flex-grow relative">
        <div>
            <div className="inset-0 overflow-hidden absolute -z-10 opacity-20 background">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#006838] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#006838] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
            </div>
            {/* Add a subtle CSS animation for the background blobs */}
            <style>{`
                    @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -20px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(20px, 20px) scale(1.05); }
                    }
                    .animate-blob {
                    animation: blob 10s infinite;
                    }
                    .animation-delay-2000 {
                    animation-delay: 2s;
                    }
                    .animation-delay-4000 {
                    animation-delay: 4s;
                    }
                `}</style>
        </div>
        {/* Background decorative elements */}
        <div className="max-w-6xl mx-auto py-6 px-4 ">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center mb-4 px-4 py-2 text-sm font-medium text-[#006838] hover:text-[#004d2b] transition-colors duration-200 back-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous page
          </button>

          {/* Alert Banner */}
          <div className={`mb-6 p-4 rounded-lg ${state.status === 'missing' ? 'bg-red-100' : 'bg-orange-100'}`}>
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-5 h-5 ${state.status === 'missing' ? 'text-red-600' : 'text-orange-600'}`} />
              <span className={`font-bold ${state.status === 'missing' ? 'text-red-600' : 'text-orange-600'}`}>
                {state.status === 'missing' ? 'MISSING PERSON' : 'WANTED PERSON'}
              </span>
              {state.caseNumber && (
                <span className="text-gray-600 text-sm ml-2">Case #: {state.caseNumber}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={state.image} 
                  alt={state.name} 
                  className="w-full h-auto object-cover"
                />
                <div className="p-4 space-y-4 action-buttons">
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                       onClick={() => handleShare(state, state.status)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#006838] text-white rounded-md hover:bg-[#005830] transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button
                      onClick={handlePrint}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{state.name}</h1>
                
                {/* Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-[#006838] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Date</h3>
                      <p className="text-gray-700">{state.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-[#006838] mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Last Known Location</h3>
                      <p className="text-gray-700">{state.location}</p>
                    </div>
                  </div>
                </div>

                {/* Physical Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Physical Description</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {state.age && (
                      <div className=' border rounded-md shadow-md p-3 cursor-pointer hover:scale-105x'>
                        <h3 className="font-semibold text-gray-700">Age</h3>
                        <p className="text-gray-600">{state.age}</p>
                      </div>
                    )}
                    {state.height && (
                      <div className=' border rounded-md shadow-md p-3 cursor-pointer hover:scale-105x'>
                        <h3 className="font-semibold text-gray-700">Height</h3>
                        <p className="text-gray-600">{state.height}</p>
                      </div>
                    )}
                    {state.weight && (
                      <div className=' border rounded-md shadow-md p-3 cursor-pointer hover:scale-105x'>
                        <h3 className="font-semibold text-gray-700">Weight</h3>
                        <p className="text-gray-600">{state.weight}</p>
                      </div>
                    )}
                    {state.complexion && (
                      <div className=' border rounded-md shadow-md p-3 cursor-pointer hover:scale-105x'>
                        <h3 className="font-semibold text-gray-700">Complexion</h3>
                        <p className="text-gray-600">{state.complexion}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-700">{state.description}</p>
                  {state.distinguishingFeatures && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-700">Distinguishing Features</h3>
                      <p className="text-gray-600">{state.distinguishingFeatures}</p>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-[#006838]" />
                    <h2 className="text-lg font-bold text-gray-900">Have Information?</h2>
                  </div>
                  <p className="text-gray-700 mb-4">
                    If you have any information about this {state.status} person, please contact:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#006838]" />
                      <span className="text-gray-700">{state.contactInfo.phone}</span>
                    </div>
                    {state.contactInfo.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#006838]" />
                        <span className="text-gray-700">{state.contactInfo.email}</span>
                      </div>
                    )}
                    <p className="text-sm text-gray-600">{state.contactInfo.department}</p>
                  </div>
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

export default PersonAlertDetail;