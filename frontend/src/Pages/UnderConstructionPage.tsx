import { useNavigate } from 'react-router-dom';
import { Construction, Hammer, Clock, ArrowLeft, Wrench } from 'lucide-react';
import { useEffect } from 'react';

const UnderConstructionPage = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-[calc(var(--vh,1vh)*100)] bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 mx-4 border-2 border-green-700">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Icon and Title Section */}
          <div className="flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full border-2 border-green-700">
            <Construction className="w-10 h-10 text-green-700" />
          </div>
          
          <h1 className="text-4xl font-bold text-green-800">
            Site Under Construction
          </h1>

          {/* Animation Section */}
          <div className="flex space-x-4 py-6">
            <Wrench className="w-6 h-6 text-green-700 animate-bounce" />
            <Hammer className="w-6 h-6 text-yellow-500 animate-bounce delay-100" />
            <Clock className="w-6 h-6 text-green-800 animate-bounce delay-200" />
          </div>

          {/* Message Section */}
          <p className="text-xl text-green-700 max-w-md">
            We're working hard to bring you something amazing. The SO-SAFE CORPS website is being updated with exciting new features.
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-yellow-400 rounded-full animate-pulse"></div>
          </div>

          {/* Estimated Time */}
          <p className="text-sm text-green-600">
            Expected completion: Coming Soon
          </p>

          {/* Button */}
          <button
            onClick={() => navigate('/')}
            className="mt-8 inline-flex items-center px-6 py-3 rounded-lg bg-green-700 text-white transition-all hover:bg-green-800 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionPage;