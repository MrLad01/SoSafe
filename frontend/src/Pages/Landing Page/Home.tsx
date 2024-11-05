import  { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Target, Eye, Heart } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import NewsCarousel from '../../components/NewsCarousel';
import AlertsDisplay from '../../components/AlertsDisplay';
import SocialFeeds from '../../components/SocialFeeds';
import Footer from '../../components/Footer';
import { NavBar } from '../../components/NavBar';

import { heroContent, HeroContent } from '../../data/HeroContent';
import { latestNews } from '../../data/LatestNews';
import { missingPersons } from '../../data/MissingPersons';
import { wantedPeople } from '../../data/WantedPersons';

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

  const handleLearnMore = (content: HeroContent) => {
    // Create URL-friendly slug from title
    const slug = content.title.toLowerCase().replace(/\s+/g, '-');
    // Navigate to dynamic page with state
    navigate(`/announcement/${slug}`, { 
      state: { 
        title: content.title,
        description: content.description,
        badge: content.badge,
        image: content.image,
        content: content.content,
        date: content.date,
        author: content.author
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

  return (
    <div className=' scroll-smooth min-h-[calc(var(--vh,1vh)*100)]'>
        <NavBar />        
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
            <AlertsDisplay 
                missingPersons={missingPersons}
                wantedPeople={wantedPeople}
            />
        </div>
        <div className="relative">
            <SocialFeeds />
        </div>
        <Footer />
    </div>
  );
};

export default Home;