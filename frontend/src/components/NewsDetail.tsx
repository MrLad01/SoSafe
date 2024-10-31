import { useLocation, useParams } from 'react-router-dom';

interface NewsState {
  title: string;
  description: string;
  badge: string;
  image: string;
}

const NewsDetail = () => {
  const location = useLocation();
  const { slug } = useParams();
  const state = location.state as NewsState;

  if (!state) {
    console.log(slug);
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-[400px]">
          <img 
            src={state.image} 
            alt={state.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <div className="inline-block px-3 py-1 bg-[#FFD700] text-[#006838] text-sm font-bold rounded-full mb-2">
              {state.badge}
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">{state.title}</h1>
          </div>
        </div>
        <div className="p-8">
          <p className="text-gray-700 text-lg leading-relaxed">{state.description}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;