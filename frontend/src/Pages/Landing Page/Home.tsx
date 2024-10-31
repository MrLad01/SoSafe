import  { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.webp';
import image from '../../assets/image.webp';
import image3 from '../../assets/image3.webp';
import image2 from '../../assets/image (1).webp';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import { ChevronLeft, ChevronRight, Menu, X, Target, Eye, Heart } from 'lucide-react';
import NewsCarousel, { NewsItem } from '../../components/NewsCarousel';
import AlertsDisplay, { Person } from '../../components/AlertsDisplay';
import SocialFeeds from '../../components/SocialFeeds';
import Footer from '../../components/Footer';
// import { useRoutes } from 'react-router-dom';

interface ContentItem {
  title: string;
  icon: JSX.Element;
  content?: string;
  values?: string[];
  color: string;
  hoverColor: string;
  textColor?: string;
}


const Home = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [hoveredSlide, setHoveredSlide] = useState<number | null>(null);

  const [activeCard, setActiveCard] = useState<number | null>(null);

  const navigate = useNavigate();


    // Track the current slide index
    const [currentSlide, setCurrentSlide] = useState<number>(0);

    // Modified carousel setup with scroll snap
    const [emblaRef, emblaApi] = useEmblaCarousel({ 
        loop: true,
        duration: 20,
        skipSnaps: false
    }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);


   // Update current slide when it changes
   useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentSlide(emblaApi.selectedScrollSnap());
      setHoveredSlide(null);
    };

    emblaApi.on('select', onSelect);
    
    // Properly typed cleanup function
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Auto-hover effect for current slide
  useEffect(() => {
    if (currentSlide === null) return;

    // Clear any existing hover state
    setHoveredSlide(null);

    // Set hover state after 2 seconds
    const hoverTimer = setTimeout(() => {
      setHoveredSlide(currentSlide);
    }, 500);


    return () => {
        clearTimeout(hoverTimer)
    };
  }, [currentSlide]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])
  

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  interface HeroContent {
    image: string;
    title: string;
    description: string;
    badge: string;
  }
    // Hero section content
    const heroContent: HeroContent[] = [
        {
          image: image,
          title: "Protecting Our Community",
          description: "Dedicated to ensuring the safety and security of Ogun State residents",
          badge: "Commander's Office"
        },
        {
          image: image2,
          title: "Professional Security Services",
          description: "Trained personnel working 24/7 to maintain peace and order",
          badge: "Official Statement"
        },
        {
          image: image3,
          title: "Community Partnership",
          description: "Building strong relationships with local communities",
          badge: "Community Engagement"
        }
      ];

    //   color: "from-[#FFD700] to-[#E6C200]",
    // hoverColor: "group-hover:from-[#FFE03D] group-hover:to-[#FFD700]",
    const handleLearnMore = (content: HeroContent) => {
        // Create URL-friendly slug from title
        const slug = content.title.toLowerCase().replace(/\s+/g, '-');
        // Navigate to dynamic page with state
        navigate(`/news/${slug}`, { 
          state: { 
            title: content.title,
            description: content.description,
            badge: content.badge,
            image: content.image
          }
        });
      };

    const organizationalContent: ContentItem[] = [
    {
        title: "OUR MISSION",
        icon: <Target className="w-8 h-8" />,
        content: "To provide professional security services that ensure the safety and well-being of all residents in Ogun State through community partnership, technological innovation, and dedicated service.",
        color: "from-[#006838] to-[#005830]",
        hoverColor: "group-hover:from-[#007840] group-hover:to-[#006838]"
    },
    {
        title: "OUR VISION",
        icon: <Eye className="w-8 h-8" />,
        content: "To be the leading community security organization in Nigeria, setting the standard for excellence in public safety and security services while fostering trust and collaboration within our communities.",
        color: "from-[#006838] to-[#005830]",
        hoverColor: "group-hover:from-[#007840] group-hover:to-[#006838]"
    },
    {
        title: "OUR CORE VALUES",
        icon: <Heart className="w-8 h-8" />,
        values: [
        "Integrity & Professionalism",
        "Community Partnership",
        "Excellence in Service",
        "Accountability & Transparency",
        "Innovation & Continuous Improvement"
        ],
        color: "from-[#006838] to-[#005830]",
        hoverColor: "group-hover:from-[#007840] group-hover:to-[#006838]"
    }
    ];

    // Latest news data
  const latestNews: NewsItem[] = [
    {
      title: "Enhanced Security Measures Implemented",
      date: "October 28, 2024",
      image: image,
      excerpt: "New security protocols have been established across Ogun State...",
      category: "Security Update"
    },
    {
      title: "Community Outreach Program Success",
      date: "October 27, 2024",
      image: image2,
      excerpt: "Recent community engagement initiatives show positive results...",
      category: "Community"
    },
    {
      title: "Community Outreach Program Success",
      date: "October 27, 2024",
      image: image2,
      excerpt: "Recent community engagement initiatives show positive results...",
      category: "Community"
    },
    {
      title: "Training Program Graduates 200 Officers",
      date: "October 26, 2024",
      image: image3,
      excerpt: "Latest batch of security officers complete advanced training...",
      category: "Training"
    }
  ];

  const missingPersons: Person[] = [
    {
      name: "John Doe",
      image: "/api/placeholder/400/300",
      description: "Last seen wearing blue jeans and a red t-shirt",
      date: "Missing since: Jan 15, 2024",
      location: "Downtown Plaza, Main Street"
    },
    {
      name: "John Doe",
      image: "/api/placeholder/400/300",
      description: "Last seen wearing blue jeans and a red t-shirt",
      date: "Missing since: Jan 15, 2024",
      location: "Downtown Plaza, Main Street"
    },

  ];
  
  const wantedPeople: Person[] = []; // Empty array will trigger the "nothing to display" state
  

  return (
    <>
        <nav className="bg-[#006838] bg-opacity-90 px-4 py-2 shadow-md">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                {/* Logo and Brand */}
                <div className="flex items-center gap-2">
                    <img 
                    src={logo} 
                    alt="Logo" 
                    className="w-16 h-14 object-cover"
                    />
                    <span className="text-white font-bold">
                    OGUN SO-SAFE CORPS
                    </span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-4">
                    <a href="#" className="text-white hover:text-green-200">Home</a>
                    <div className="relative group">
                    <button 
                        className="text-white hover:text-green-200 flex items-center"
                        onClick={() => setIsAboutOpen(!isAboutOpen)}
                    >
                        About
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div className="absolute left-0 mt-2 w-48 z-10 bg-white rounded-md shadow-lg hidden group-hover:block">
                        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Company</a>
                        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Team</a>
                        <div className="relative group/nested">
                        <button className="w-full text-left px-4 py-2 text-gray-800 hover:bg-green-100 flex items-center justify-between">
                            Contact
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <div className="absolute left-full top-0 mt-0 w-48 bg-white rounded-md shadow-lg hidden group-hover/nested:block">
                            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Via email</a>
                            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Via telephone</a>
                        </div>
                        </div>
                    </div>
                    </div>
                    <a href="#" className="text-white hover:text-green-200">Department</a>
                    <a href="#" className="text-white hover:text-green-200">Zones</a>
                    <a href="#" className="text-white hover:text-green-200">Contact Us</a>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white hover:text-green-200"
                    >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                <div className="md:hidden mt-4">
                    <a href="#" className="block py-2 text-white hover:text-green-200">Home</a>
                    <div>
                    <button 
                        onClick={() => setIsAboutOpen(!isAboutOpen)}
                        className="w-full text-left py-2 text-white hover:text-green-200 flex items-center justify-between"
                    >
                        About
                        <svg className={`w-4 h-4 transform ${isAboutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {isAboutOpen && (
                        <div className="pl-4">
                        <a href="#" className="block py-2 text-white hover:text-green-200">Company</a>
                        <a href="#" className="block py-2 text-white hover:text-green-200">Team</a>
                        <button
                            onClick={() => setIsContactOpen(!isContactOpen)}
                            className="w-full text-left py-2 text-white hover:text-green-200 flex items-center justify-between"
                        >
                            Contact
                            <svg className={`w-4 h-4 transform ${isContactOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isContactOpen && (
                            <div className="pl-4">
                            <a href="#" className="block py-2 text-white hover:text-green-200">Via email</a>
                            <a href="#" className="block py-2 text-white hover:text-green-200">Via telephone</a>
                            </div>
                        )}
                        </div>
                    )}
                    </div>
                    <a href="#" className="block py-2 text-white hover:text-green-200">News</a>
                    <a href="#" className="block py-2 text-white hover:text-green-200">Products</a>
                </div>
                )}
            </div>
        </nav>
            
        {/* Enhanced Hero Section with Carousel */}
        <div className="relative max-w-7xl mx-auto my-8">
            <div className="overflow-hidden rounded-xl shadow-2xl" ref={emblaRef}>
                <div className="flex">
                {heroContent.map((content, index) => (
                    <div key={index} className="flex-[0_0_100%] min-w-0 relative group">
                    <div className="relative h-[400px] overflow-hidden">
                        {/* Background gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#006838]/40 via-transparent to-black/40 z-10" />
                        
                                {/* Main image */}
                                <img 
                        src={content.image} 
                        alt={`Slide ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />

                        {/* Content container - moved to bottom with overlay */}
                        <div className="absolute bottom-0 right-0 pr-10 max-md:left-2 bg-gradient-to-r to-black/10 from-transparent z-20 p-8">
                        {/* Badge */}
                        <div className={`inline-block px-3 py-1 bg-[#FFD700] text-[#006838] text-sm font-bold rounded-full mb-2 transform transition-all duration-500 ${
                        hoveredSlide === index ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                        }`}>
                            {content.badge}
                        </div>
                        
                        {/* Title with animated line */}
                        <div className="relative">
                            <h2 className={`text-3xl font-bold mb-2 text-white transform transition-all duration-700 ${
                                hoveredSlide === index ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                            }`}>
                                {content.title}
                            </h2>
                            <div className={`h-1 w-24 bg-[#FFD700] rounded transform transition-transform duration-700 origin-left ${
                                hoveredSlide === index ? 'scale-x-100' : 'scale-x-0'
                            }`} />
                        </div>
                        
                        {/* Description */}
                        <p className={`text-base text-gray-200 mt-2 max-w-2xl transform transition-all duration-900 ${
                            hoveredSlide === index ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                            }`}>
                            {content.description}
                        </p>
                        
                       {/* CTA Button */}
                        <button className={`mt-8 px-6 py-3 bg-[#FFD700] text-[#006838] font-bold rounded-lg hover:bg-white transition-colors duration-300 w-fit transform ${
                        hoveredSlide === index ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                        }`}
                            onClick={() => handleLearnMore(content)}
                        >
                            Learn More
                        </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            
            {/* Navigation buttons */}
            <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 hover:bg-[#006838] text-[#006838] hover:text-white p-3 rounded-full transition-all duration-300 z-30 group"
                onClick={scrollPrev}
                title='prev'
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-[#006838] text-[#006838] hover:text-white p-3 rounded-full transition-all duration-300 z-30 group"
                onClick={scrollNext}
                title='next'
            >
                <ChevronRight className="w-6 h-6" />
            </button>
        </div>

        <div className="relative bg-gray-50 bg-opacity-40 py-8 px-4 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden opacity-85">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#006838] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#006838] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto relative">
                {/* Cards Container */}
                <div className="grid md:grid-cols-3 gap-12 px-4 scale-90">
                {organizationalContent.map((item, index) => (
                    <div
                    key={index}
                    className={`group relative transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                        activeCard === index ? 'z-10 scale-105' : 'z-0'
                    }`}
                    onMouseEnter={() => setActiveCard(index)}
                    onMouseLeave={() => setActiveCard(null)}
                    >
                    {/* Card */}
                    <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Card Header */}
                        <div className={`p-6 bg-gradient-to-r ${item.color} ${item.hoverColor} transition-all duration-500`}>
                        <div className="flex items-center justify-center mb-2">
                            <div className={`transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${item.textColor || 'text-white'}`}>
                            {item.icon}
                            </div>
                        </div>
                        <h3 className={`text-xl font-bold text-center mb-4 ${item.textColor || 'text-white'}`}>
                            {item.title}
                        </h3>
                        <div className={`w-16 h-1 ${item.textColor ? 'bg-[#006838]/30' : 'bg-white/30'} mx-auto rounded-full transform origin-center transition-transform duration-500 group-hover:scale-x-[2.5]`} />
                        </div>

                        {/* Card Content */}
                        <div className="p-6 bg-white">
                        {item.values ? (
                            <ul className="space-y-3">
                            {item.values.map((value, idx) => (
                                <li
                                key={idx}
                                className="flex items-center text-gray-700 transform transition-transform duration-300 hover:translate-x-2"
                                >
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} mr-3`} />
                                {value}
                                </li>
                            ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 leading-relaxed">
                            {item.content}
                            </p>
                        )}
                        </div>
                    </div>

                    {/* Decorative corner accents */}
                    <div className="absolute top-0 left-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className={`absolute top-0 left-0 w-2 h-8 bg-gradient-to-b ${item.color} rounded-tl-lg`} />
                        <div className={`absolute top-0 left-0 w-8 h-2 bg-gradient-to-r ${item.color} rounded-tl-lg`} />
                    </div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className={`absolute bottom-0 right-0 w-2 h-8 bg-gradient-to-t ${item.color} rounded-br-lg`} />
                        <div className={`absolute bottom-0 right-0 w-8 h-2 bg-gradient-to-l ${item.color} rounded-br-lg`} />
                    </div>
                    </div>
                ))}
                </div>
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

      {/* Enhanced Mission Statement Section */}
        {/* New Latest News Section */}
        <div className="bg-[#006838] py-6">
            <div className="max-w-7xl mx-auto">
                <NewsCarousel news={latestNews} />
            </div>
        </div>
        <div className="relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden opacity-25">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#006838] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#006838] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
            </div>
            <AlertsDisplay 
                missingPersons={missingPersons}
                wantedPeople={wantedPeople}
            />
        </div>
        <div className="relative">
            <SocialFeeds 
                // twitterUsername="Aytolu7"
                // facebookPageUrl="yourpage"
                // instagramUsername="laddurojaiye"
                />
        </div>
        <Footer />
    </>
  );
};

export default Home;