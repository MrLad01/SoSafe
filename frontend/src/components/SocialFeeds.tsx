import React, { useEffect } from 'react';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Users, 
  MessageCircle, 
  Share2, 
  ExternalLink,
  RefreshCw
} from 'lucide-react';

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
  }
}

interface SocialFeedsProps {
  twitterUsername?: string;
  facebookPageUrl?: string;
  instagramUsername?: string;
}

const SocialFeeds: React.FC<SocialFeedsProps> = ({
  twitterUsername = 'yourtwitterhandle',
  facebookPageUrl = 'yourfacebookpage',
  instagramUsername = 'yourinstagramhandle'
}) => {
  useEffect(() => {
    const loadSocialScripts = async () => {
      const scripts = [
        { src: 'https://platform.twitter.com/widgets.js', id: 'twitter-script' },
        { src: 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v13.0', id: 'facebook-script' },
        { src: 'https://www.instagram.com/embed.js', id: 'instagram-script' }
      ];

      for (const script of scripts) {
        if (!document.getElementById(script.id)) {
          const scriptElement = document.createElement('script');
          scriptElement.src = script.src;
          scriptElement.async = true;
          scriptElement.id = script.id;
          document.body.appendChild(scriptElement);
        }
      }
    };

    loadSocialScripts();
    window.twttr?.widgets.load();
  }, []);

  const socialCards = [
    {
      title: 'Twitter',
      icon: Twitter,
      color: 'from-blue-400 to-blue-600',
      stats: [
        { icon: MessageCircle, label: 'Tweets' },
        { icon: Users, label: 'Followers' },
        { icon: Share2, label: 'Retweets' }
      ],
      content: (
        <a 
          className="twitter-timeline" 
          data-height="240"
          data-theme="light"
          href={`https://twitter.com/${twitterUsername}?ref_src=twsrc%5Etfw`}
          title={`Twitter Timeline for ${twitterUsername}`}
        >
          Loading tweets...
        </a>
      )
    },
    {
      title: 'Facebook',
      icon: Facebook,
      color: 'from-blue-600 to-blue-800',
      stats: [
        { icon: Users, label: 'Likes' },
        { icon: MessageCircle, label: 'Comments' },
        { icon: Share2, label: 'Shares' }
      ],
      content: (
        <div 
          className="fb-page" 
          data-href={`https://www.facebook.com/${facebookPageUrl}`}
          data-tabs="timeline"
          data-width="300"
          data-height="240"
          data-small-header="true"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="false"
        >
          <blockquote cite={`https://www.facebook.com/${facebookPageUrl}`} className="fb-xfbml-parse-ignore">
            Loading Facebook feed...
          </blockquote>
        </div>
      )
    },
    {
      title: 'Instagram',
      icon: Instagram,
      color: 'from-purple-500 to-pink-500',
      stats: [
        { icon: Users, label: 'Followers' },
        { icon: MessageCircle, label: 'Comments' },
        { icon: Share2, label: 'Shares' }
      ],
      content: (
        <iframe
          title={`Instagram Feed for ${instagramUsername}`}
          src={`https://www.instagram.com/${instagramUsername}/embed`}
          className="w-full h-60 border-none"
          scrolling="no"
          allowTransparency={true}
        />
      )
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-8 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-48 h-48 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Social Media Updates
          </h2>
          <p className="text-sm text-gray-600">
            Stay connected with our latest updates
          </p>
        </div>

        {/* Social Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialCards.map((card) => (
            <div 
              key={card.title}
              className="relative group"
            >
              {/* Card Container */}
              <div className="relative bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 group-hover:-translate-y-1">
                {/* Card Header */}
                <div className={`p-4 bg-gradient-to-r ${card.color}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <card.icon className="w-5 h-5 text-white" />
                      <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white opacity-75 hover:opacity-100 cursor-pointer" />
                  </div>
                  
                  {/* Stats Row */}
                  <div className="mt-4 flex justify-between">
                    {card.stats.map((stat, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <stat.icon className="w-4 h-4 text-white opacity-75 mb-1" />
                        <span className="text-xs text-white opacity-75">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 h-[300px] overflow-hidden relative">
                  {/* Loading Overlay */}
                  <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                    <div className="flex flex-col items-center">
                      <RefreshCw className="w-6 h-6 text-gray-400 animate-spin mb-2" />
                      <span className="text-xs text-gray-500">Loading feed...</span>
                    </div>
                  </div>
                  {card.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Facebook SDK Root */}
      <div id="fb-root"></div>

      {/* Animation Styles */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default SocialFeeds;