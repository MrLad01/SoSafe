import { useLocation, useParams } from 'react-router-dom';
import { NavBar } from './NavBar';
import Footer from './Footer';
import { format, isValid, parseISO } from 'date-fns';
import { CalendarDays, Clock, User } from 'lucide-react';

interface NewsState {
  title: string;
  description: string;
  badge: string;
  image: string;
  date: string;
  content: string;
  author: string;
}

const NewsDetail = () => {
  const location = useLocation();
  const { slug } = useParams();
  const state = location.state as NewsState;

  if (!state) {
    console.log(slug);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#006838]"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'MMMM dd, yyyy');
      }
      return 'Date unavailable';
    } catch {
      return 'Date unavailable';
    }
  };

  const formatContent = (content: string | undefined) => {
    if (!content) return ['No content available'];
    return content.split('\n\n').filter(Boolean);
  };

  const calculateReadingTime = (content: string | undefined) => {
    if (!content) return 1;
    const words = content.split(' ').length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const formattedDate = formatDate(state.date);
  const contentParagraphs = formatContent(state.content);
  const readingTime = calculateReadingTime(state.content);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto py-6 px-4">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="relative h-[425px]">
              <img 
                src={state.image} 
                alt={state.title || 'News image'} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <div className="inline-block px-3 py-1 bg-[#FFD700] text-[#006838] text-sm font-bold rounded-full mb-2">
                  {state.badge || 'News'}
                </div>
                <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
                  {state.title || 'Untitled Article'}
                </h1>
                <p className="text-lg text-gray-200 mb-4 max-w-2xl">
                  {state.description || 'No description available'}
                </p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="prose prose-base max-w-none">
                  {contentParagraphs.map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-5 sticky top-6">
                {/* Author Info */}
                <div className="mb-5 pb-5 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#006838] rounded-full p-1.5">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Author</h3>
                  </div>
                  <p className="text-gray-700 text-sm">{state.author || 'Unknown Author'}</p>
                </div>

                {/* Publication Date */}
                <div className="mb-5 pb-5 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#006838] rounded-full p-1.5">
                      <CalendarDays className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Published</h3>
                  </div>
                  <p className="text-gray-700 text-sm">{formattedDate}</p>
                </div>

                {/* Reading Time */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#006838] rounded-full p-1.5">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Reading Time</h3>
                  </div>
                  <p className="text-gray-700 text-sm">
                    {readingTime} min read
                  </p>
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

export default NewsDetail;