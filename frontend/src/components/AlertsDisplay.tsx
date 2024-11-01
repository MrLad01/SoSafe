import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useNavigate } from 'react-router-dom';

export interface Person {
  name: string;
  image: string;
  description: string;
  date: string;
  location: string;
  age: string;
  height: string;
  weight: string;
  complexion: string;
  distinguishingFeatures: string;
  status: string;
  caseNumber: string;
  contactInfo: Contact;
}

interface Contact {
  phone: string;
  email: string;
  department: string;
}

interface AlertsDisplayProps {
  missingPersons: Person[];
  wantedPeople: Person[];
}

const AlertsDisplay: React.FC<AlertsDisplayProps> = ({ missingPersons, wantedPeople }) => {
  const navigate = useNavigate(); // Move inside component

  const handlePersonDetails = (content: Person, type: 'missing' | 'wanted') => {
    const personSlug = content.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/${type}/${personSlug}`, { 
      state: { ...content } // Simplified state passing
    });
  };

  const EmptyState: React.FC<{ title: string }> = ({ title }) => (
    <div className="flex flex-col items-center justify-center bg-white text-[#006838] rounded-lg p-8 h-[12rem] min-h-[300px]">
      <div className="mb-2">
        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4M12 20V4" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">No {title}</h3>
      <p className="text-center">There are currently no {title.toLowerCase()} to display</p>
    </div>
  );

  const PersonCard: React.FC<{ 
    person: Person; 
    isSelected: boolean; 
    type: 'missing' | 'wanted';
  }> = ({ person, isSelected, type }) => (
    <div 
      className={`
        bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-500 max-w-md mx-auto
        ${isSelected ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-70'}
      `}
    >
      <div className="relative h-[19rem] group">
        <img
          src={person.image}
          alt={person.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-xl">{person.name}</h3>
          <p className="text-white/80 text-sm">{person.date}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 mb-2 line-clamp-2">{person.description}</p>
        <p className="text-sm text-gray-500">
          <span className="font-semibold">Last seen:</span> {person.location}
        </p>
        <button 
          className="mt-4 w-full bg-[#FFD700] text-[#006838] font-semibold shadow-md py-2 px-4 rounded 
                     hover:bg-white hover:text-[#006838] hover:border-[#006838] hover:border-2 
                     transition-colors duration-300 outline-none"
          onClick={() => handlePersonDetails(person, type)}
        >
          More Information
        </button>
      </div>
    </div>
  );

  const CarouselSection: React.FC<{ 
    title: string; 
    items: Person[];
    delay: number;
    type: 'missing' | 'wanted';
  }> = ({ title, items, delay, type }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        loop: true,
        align: 'center',
        skipSnaps: false,
        dragFree: true,
        containScroll: 'trimSnaps',
      },
      [Autoplay({ delay, stopOnInteraction: false })]
    );

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onSelect = useCallback(() => {
      if (!emblaApi) return;
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
      if (!emblaApi) return;
      
      onSelect();
      setScrollSnaps(emblaApi.scrollSnapList());
      emblaApi.on('select', onSelect);
      
      return () => {
        emblaApi.off('select', onSelect);
      };
    }, [emblaApi, onSelect]);

    if (items.length === 0) {
      return (
        <div className="w-full max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-[#006838] mb-4">{title}</h2>
          <EmptyState title={title} />
        </div>
      );
    }

    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#006838]">{title}</h2>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {items.map((item, index) => (
              <div key={item.caseNumber} className="flex-none w-full pl-4 first:pl-0">
                <PersonCard 
                  person={item} 
                  isSelected={selectedIndex === index} 
                  type={type}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-4 gap-2">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex 
                  ? 'bg-[#FFD700] w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
          <CarouselSection 
            title="Wanted People" 
            items={wantedPeople} 
            delay={4000} 
            type="wanted" 
          />
          <CarouselSection 
            title="Missing Persons" 
            items={missingPersons} 
            delay={4800} 
            type="missing" 
          />
        </div>
      </div>
    </div>
  );
};

export default AlertsDisplay;