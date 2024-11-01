import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useNavigate } from 'react-router-dom';

export interface NewsItem {
  title: string;
  date: string;
  image: string;
  excerpt: string;
  category: string;
  content: string;
  author: string;
}

interface NewsCarouselProps {
  news: NewsItem[];
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ news }) => {
  const [newsEmblaRef, newsEmblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      skipSnaps: false,
      dragFree: true,
      containScroll: 'trimSnaps',
      watchDrag: true,
      watchResize: true,
      watchSlides: true,
      active: true
    },
    [Autoplay({ delay: 3800, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const navigate = useNavigate();

  const scrollPrev = useCallback((): void => {
    if (newsEmblaApi) newsEmblaApi.scrollPrev();
  }, [newsEmblaApi]);

  const scrollNext = useCallback((): void => {
    if (newsEmblaApi) newsEmblaApi.scrollNext();
  }, [newsEmblaApi]);

  const onSelect = useCallback((): void => {
    if (!newsEmblaApi) return;
    setSelectedIndex(newsEmblaApi.selectedScrollSnap());
  }, [newsEmblaApi]);

  useEffect(() => {
    if (!newsEmblaApi) return;
    
    onSelect();
    setScrollSnaps(newsEmblaApi.scrollSnapList());
    newsEmblaApi.on('select', onSelect);
    
    return () => {
      newsEmblaApi.off('select', onSelect);
    };
  }, [newsEmblaApi, onSelect]);

  const handleLearnMore = (content: NewsItem) => {
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

  return (
    <div className="bg-[#006838] scroll-smooth py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-[#FFD700] text-3xl font-bold text-center">Latest News</h2>
          <div className="flex gap-4">
            <button 
              onClick={scrollPrev}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button 
              onClick={scrollNext}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
        
        <div className="overflow-hidden" ref={newsEmblaRef}>
          <div className="flex">
            {news.map((item, index) => (
              <div 
                key={index} 
                className="flex-none w-full md:w-1/2 lg:w-1/3 pl-4 first:pl-0"
              >
                <div 
                  className={`
                    bg-white rounded-lg overflow-hidden shadow-xl 
                    transition-all duration-500 ease-out mr-4
                    ${selectedIndex === index 
                      ? 'transform scale-100 opacity-100' 
                      : 'transform scale-95 opacity-70'}
                  `}
                >
                  <div className="relative h-48 overflow-hidden group">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#FFD700] text-[#006838] px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-500 text-sm mb-2">{item.date}</p>
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:line-clamp-none transition-all duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mb-4">{item.excerpt}</p>
                    <button 
                      onClick={() => handleLearnMore(item)}
                      className="w-full px-6 py-2 bg-[#006838] text-white rounded-lg hover:bg-[#005830] transition-colors duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex 
                  ? 'bg-[#FFD700] w-8' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              onClick={() => newsEmblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsCarousel;