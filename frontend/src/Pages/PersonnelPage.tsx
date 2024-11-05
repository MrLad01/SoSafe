import { UserPlus, Shield, Users, Award, Star, Clock, CheckCircle } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import Footer from '../components/Footer';
import { useEffect } from 'react';

const PersonnelPage = () => {
  const stats = [
    { 
      icon: <Users className="w-8 h-8 text-[#006838]" />,
      value: "9000+",
      label: "Active Officers"
    },
    {
      icon: <Clock className="w-8 h-8 text-[#006838]" />,
      value: "24/7",
      label: "Service Hours"
    },
    {
      icon: <Shield className="w-8 h-8 text-[#006838]" />,
      value: "20+",
      label: "Local Governments"
    },
    {
      icon: <Award className="w-8 h-8 text-[#006838]" />,
      value: "95%",
      label: "Success Rate"
    }
  ];

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

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-[#FFD700]" />,
      title: "Professional Training",
      description: "All officers undergo compulsory twice in a year rigorous training in security operations and community relations."
    },
    {
      icon: <Star className="w-6 h-6 text-[#FFD700]" />,
      title: "Community First",
      description: "Our officers are trained to prioritize community safety and well-being above all."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-[#FFD700]" />,
      title: "24/7 Availability",
      description: "Round-the-clock service to ensure constant security presence in your community."
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <NavBar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#006838] mb-6">
              OGUN SO-SAFE CORPS Personnel
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Meet the dedicated officers who serve and protect our communities. Our personnel are committed to maintaining peace, ensuring security, and fostering positive relationships within Ogun State.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-[#006838] hover:bg-[#005028] transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006838]"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Officer Login
              </a>
              {/* <a
                href="/careers"
                className="inline-flex items-center px-6 py-3 border-2 border-[#006838] text-base font-medium rounded-lg text-[#006838] hover:bg-[#006838] hover:text-white transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006838]"
              >
                Join Our Team
              </a> */}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center text-center">
                {stat.icon}
                <div className="mt-4 text-3xl font-bold text-[#006838]">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white shadow-md rounded-xl my-12">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="ml-3 text-xl font-semibold text-[#006838]">{feature.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <blockquote className="text-xl italic text-gray-700">
          "Our personnel are more than security officers; they are community guardians, dedicated to creating a safer and more secure environment for all residents of Ogun State." - Commander (Dr.) Soji Ganzallo FCAI, FIIM, fisn
        </blockquote>
      </div>

      <Footer />
    </div>
  );
};

export default PersonnelPage;