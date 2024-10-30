import React, { useState, useCallback, useEffect } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export interface Person {
  name: string;
  image: string;
  description: string;
  date: string;
  location: string;
}

interface AlertsDisplayProps {
  missingPersons: Person[];
  wantedPeople: Person[];
}

const EmptyState = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center bg-white text-[#006838] rounded-lg p-8 h-[12rem] min-h-[300px]">
    <div className=" mb-2">
      <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4M12 20V4" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold mb-2">No {title}</h3>
    <p className=" text-center">There are currently no {title.toLowerCase()} to display</p>
  </div>
);

const PersonCard = ({ person, isSelected }: { person: Person; isSelected: boolean }) => (
  <div 
    className={`
      bg-white rounded-lg shadow-lg overflow-hidden scale-95 transition-all duration-500 max-w-md mx-auto
      ${isSelected ? 'transform scale-100 opacity-100' : 'transform scale-95 opacity-70'}
    `}
  >
    <div className="relative h-[19rem]">
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
        className="mt-4 w-full bg-[#FFD700] text-[#006838] font-semibold shadow-md py-2 px-4 rounded hover:bg-white hover:text-[#006838] hover:border-2 transition-colors duration-300"
        onClick={() => console.log(`More info about: ${person.name}`)}
      >
        More Information
      </button>
    </div>
  </div>
);

const CarouselSection = ({ title, items }: { title: string; items: Person[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      skipSnaps: false,
      dragFree: true,
      containScroll: 'trimSnaps',
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

//   const scrollPrev = useCallback(() => {
//     if (emblaApi) emblaApi.scrollPrev();
//   }, [emblaApi]);

//   const scrollNext = useCallback(() => {
//     if (emblaApi) emblaApi.scrollNext();
//   }, [emblaApi]);

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
        {/* <div className="flex gap-2">
          <button 
            onClick={scrollPrev}
            className="p-2 rounded-full bg-[#FFD700] hover:bg-white hover:border-2 hover:shadow-md transition-colors duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-[#006838]" />
          </button>
          <button 
            onClick={scrollNext}
            className="p-2 rounded-full bg-[#FFD700] hover:bg-white hover:border-2 hover:shadow-md transition-colors duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-[#006838]" />
          </button>
        </div> */}
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item, index) => (
            <div key={index} className="flex-none w-full pl-4 first:pl-0">
              <PersonCard person={item} isSelected={selectedIndex === index} />
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

const AlertsDisplay: React.FC<AlertsDisplayProps> = ({ missingPersons, wantedPeople }) => {
  return (
    <div className=" py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
          <CarouselSection title="Wanted People" items={wantedPeople} />
          <CarouselSection title="Missing Persons" items={missingPersons} />
        </div>
      </div>
    </div>
  );
};

export default AlertsDisplay;