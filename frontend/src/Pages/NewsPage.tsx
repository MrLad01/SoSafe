import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronRight, ChevronLeft, TrendingUp, Clock, Eye, BookMarked, Share2, ChevronUp } from 'lucide-react';
import Footer from '../components/Footer';
import { NavBar } from '../components/NavBar';
import { latestNews } from '../data/LatestNews';
import { heroContent, HeroContent } from '../data/HeroContent';
import { useNavigate } from 'react-router-dom';
import { NewsItem } from '../components/NewsCarousel';

const NewsPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const navigate = useNavigate();

  // Initialize Embla with proper typing and options
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      containScroll: 'trimSnaps',
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((api: UseEmblaCarouselType[1]) => {
    if(api !== undefined){
        setPrevBtnEnabled(api.canScrollPrev());
        setNextBtnEnabled(api.canScrollNext());
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('select', () => onSelect(emblaApi));

    return () => {
      emblaApi.off('select', () => onSelect(emblaApi));
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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

  const handleReadMore = (content: NewsItem) => {
    // Create URL-friendly slug from title
    const slug = content.title.toLowerCase().replace(/\s+/g, '-');
    // Navigate to dynamic page with state
    navigate(`/announcement/${slug}`, { 
      state: { 
        title: content.title,
        description: content.excerpt,
        badge: content.category,
        image: content.image,
        content: content.content,
        date: content.date,
        author: content.author
      }
    });
  };

  const renderHeroSlide = (content: HeroContent, index: number) => (
    <div key={index} className="embla__slide relative flex-[0_0_100%] min-w-0">
      <img 
        src={content.image}
        alt={content.title}
        className="w-full h-[600px] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <span className="bg-[#006838] text-white px-3 py-1 rounded-full text-sm mb-4 inline-block">
            {content.badge}
          </span>
          <h1 className="text-4xl font-bold text-white mb-4">{content.title}</h1>
          <p className="text-gray-200 mb-6 max-w-2xl">{content.description}</p>
          <div className="flex items-center text-gray-300 text-sm">
            <Clock size={16} className="mr-2" />
            <span>{new Date(content.date).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{content.author}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="scroll-smooth bg-gray-50">
      <div className="fixed z-30 w-full">
        <NavBar />
      </div>
      
      {/* Hero Slider Section */}
      <div className="relative h-[600px]">
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex h-[600px]">
            {heroContent.map(renderHeroSlide)}
          </div>
        </div>
        
        {/* Slider Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
          <button 
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors disabled:opacity-50"
            aria-label="Previous slide"
            title="Show previous slide"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>
          <button 
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors disabled:opacity-50"
            aria-label="Next slide"
            title="Show next slide"
          >
            <ChevronRight className="text-white" size={24} />
          </button>
        </div>
      </div>

      {/* Hot Topics Banner */}
      <div className="bg-white border-b sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <div className="flex items-center">
            <TrendingUp className="text-[#FFD700] mr-2" />
            <h2 className="text-2xl font-bold text-[#FFD700]">HOT TOPICS</h2>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest News Section */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-bold flex items-center">
              <div className="w-1 h-6 bg-[#006838] mr-2"></div>
              TOP 10 LATEST NEWS
            </h2>

            {/* News Grid */}
            <div className="grid gap-6 h-[80vh] px-5 overflow-auto ">
              {latestNews.slice(0, 10).map((news, index) => (
                <button onClick={() => handleReadMore(news)} className='text-left'>
                  <div key={index} 
                      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-48 relative group">
                        <img 
                          src={news.image} 
                          alt={news.title}
                          className="w-full h-48 md:h-32 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button 
                            className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                            aria-label="Bookmark article"
                            title="Bookmark this article"
                          >
                            <BookMarked size={16} className="text-gray-700" />
                          </button>
                          <button 
                            className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                            aria-label="Share article"
                            title="Share this article"
                          >
                            <Share2 size={16} className="text-gray-700" />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-[#006838]/10 text-[#006838] rounded-full font-medium">
                            {news.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(news.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 hover:text-[#006838] transition-colors duration-200">
                          {news.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{news.excerpt}</p>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                          <img 
                            src="/api/placeholder/32/32"
                            alt={`${news.author}'s avatar`}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span>{news.author}</span>
                          <span className="mx-2">•</span>
                          <Eye size={16} className="mr-1" />
                          <span>4 views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Most Read Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center">
              <div className="w-1 h-6 bg-[#006838] mr-2"></div>
              LATEST ANNOUCEMENTS
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 h-[76vh] px-5 overflow-auto ">
              {heroContent.slice(0, 5).map((news, index) => (
                <button onClick={() => handleLearnMore(news)} className='text-left'>
                  <div key={index}>
                    <div className="group cursor-pointer">
                      <div className="relative mb-3">
                        <img 
                          src={news.image} 
                          alt={news.title}
                          className="w-full h-48 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="bg-white/90 text-sm px-2 py-1 rounded-full">
                            <Eye size={14} className="inline mr-1" />
                            4 views
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">
                          {new Date(news.date).toLocaleDateString()}
                        </div>
                        <h4 className="font-bold group-hover:text-[#006838] transition-colors duration-200">
                          {news.title}
                        </h4>
                      </div>
                    </div>
                    {index < 2 && <hr className="my-6 border-gray-200" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        className={`fixed bottom-8 right-8 p-4 bg-[#006838] text-white rounded-full shadow-lg transition-opacity duration-300 hover:bg-[#005028] ${
          isVisible ? 'opacity-100' : 'hidden'
        }`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top of page"
      >
        <ChevronUp size={24} />
      </button>

      <Footer />
    </div>
  );
};

export default NewsPage;