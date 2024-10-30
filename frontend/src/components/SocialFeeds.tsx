// import React from 'react';
import { 
  ExternalLink, 
  Users, 
  MessageCircle, 
  Share2,
  Twitter,
  Facebook,
  Instagram,
  ArrowUpRight,
  // Share
} from 'lucide-react';

// interface SocialStats {
//   twitter?: {
//     followers: number;
//     tweets: number;
//     url: string;
//   };
//   facebook?: {
//     likes: number;
//     shares: number;
//     url: string;
//   };
//   instagram?: {
//     followers: number;
//     posts: number;
//     url: string;
//   };
// }

const CompactSocialFeeds = () => {
  const socialCards = [
    {
      title: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500',
      hoverColor: 'group-hover:bg-sky-600',
      url: 'https://twitter.com/youraccount',
      stats: [
        { icon: Users, value: '12K', label: 'Followers' },
        { icon: MessageCircle, value: '2.3K', label: 'Tweets' },
      ]
    },
    {
      title: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600',
      hoverColor: 'group-hover:bg-blue-700',
      url: 'https://facebook.com/yourpage',
      stats: [
        { icon: Users, value: '45K', label: 'Likes' },
        { icon: Share2, value: '2.8K', label: 'Shares' },
      ]
    },
    {
      title: 'Instagram',
      icon: Instagram,
      color: 'bg-purple-500',
      hoverColor: 'group-hover:bg-purple-600',
      url: 'https://instagram.com/youraccount',
      stats: [
        { icon: Users, value: '28K', label: 'Followers' },
        { icon: MessageCircle, value: '5.6K', label: 'Posts' },
      ]
    }
  ];

  const handleCardClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="bg-gray-50 p-8 text-[#006838]">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          {/* <Share className="w-6 h-6 text-gray-600" /> */}
          <h2 className="text-3xl font-bold text-[#006838]">Our Social Media</h2>
        </div>
        <p className="text-center text-[#006838] max-w-2xl mx-auto">
          Stay connected and join our community across all platforms
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {socialCards.map((card) => (
            <div 
              key={card.title}
              className="group relative cursor-pointer"
              onClick={() => handleCardClick(card.url)}
            >
              <div className={`
                relative overflow-hidden rounded-xl bg-white 
                transition-all duration-300 ease-out
                shadow-md hover:shadow-xl
                transform hover:-translate-y-1
              `}>
                {/* Animated gradient background */}
                <div className={`
                  absolute inset-0 opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 ease-in-out
                  bg-gradient-to-br ${card.color} ${card.hoverColor}
                `} />

                {/* Card content */}
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <card.icon className="w-5 h-5 text-[#006838] group-hover:text-white transition-colors duration-300" />
                      <h3 className="font-semibold text-[#006838] group-hover:text-white transition-colors duration-300">
                        {card.title}
                      </h3>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#006838] group-hover:text-white transition-colors duration-300" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {card.stats.map((stat, i) => (
                      <div 
                        key={i}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-1.5">
                          <stat.icon className="w-4 h-4 text-[#006838] group-hover:text-white/80 transition-colors duration-300" />
                          <span className="font-semibold text-[#006838] group-hover:text-white transition-colors duration-300">
                            {stat.value}
                          </span>
                        </div>
                        <span className="text-xs text-[#006838] group-hover:text-white/80 transition-colors duration-300">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Hover effect button */}
                  <div className={`
                    absolute right-4 bottom-4
                    transform translate-y-8 opacity-0
                    group-hover:translate-y-0 group-hover:opacity-100
                    transition-all duration-300 ease-out
                  `}>
                    <button className="flex items-center space-x-1 text-sm text-white">
                      <span>View Profile</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompactSocialFeeds;