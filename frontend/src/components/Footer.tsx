import React from 'react';
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin, Shield, Bell, Clock } from 'lucide-react';

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

interface QuickLink {
  title: string;
  url: string;
  icon?: React.ReactNode;
}

interface ContactInfo {
  type: 'phone' | 'email' | 'address';
  value: string;
  icon: React.ReactNode;
}

interface FooterProps {
  socialLinks?: SocialLink[];
  quickLinks?: QuickLink[];
  contactInfo?: ContactInfo[];
  showNewsletter?: boolean;
}

const defaultSocialLinks: SocialLink[] = [
  {
    platform: 'Facebook',
    url: '#',
    icon: <Facebook size={20} />
  },
  {
    platform: 'Twitter',
    url: '#',
    icon: <Twitter size={20} />
  },
  {
    platform: 'Instagram',
    url: '#',
    icon: <Instagram size={20} />
  }
];

const defaultQuickLinks: QuickLink[] = [
  {
    title: 'About Us',
    url: '#',
    icon: <Shield size={16} />
  },
  {
    title: 'Report Incident',
    url: '#',
    icon: <Bell size={16} />
  },
  {
    title: 'Emergency Response',
    url: '#',
    icon: <Clock size={16} />
  },
  {
    title: 'Careers',
    url: '#'
  },
  {
    title: 'Training Programs',
    url: '#'
  }
];

const defaultContactInfo: ContactInfo[] = [
  {
    type: 'phone',
    value: '767 (Toll Free)',
    icon: <Phone size={16} />
  },
  {
    type: 'phone',
    value: '+234 123 456 7890',
    icon: <Phone size={16} />
  },
  {
    type: 'email',
    value: 'info@sosafecorps.og.gov.ng',
    icon: <Mail size={16} />
  },
  {
    type: 'address',
    value: 'Headquarters, Abeokuta, Ogun State',
    icon: <MapPin size={16} />
  }
];

const Footer: React.FC<FooterProps> = ({
  socialLinks = defaultSocialLinks,
  quickLinks = defaultQuickLinks,
  contactInfo = defaultContactInfo,
  showNewsletter = true
}) => {
  const [email, setEmail] = React.useState<string>('');

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle newsletter submission
    console.log('Newsletter subscription for:', email);
    setEmail('');
  };

  return (
    <footer className="bg-[#006838] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-[#FFD700]">About So-Safe Corps</h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              Ogun State Community, Social and Security Corps (So-Safe Corps) is dedicated to ensuring the safety and security of all residents through professional service and community partnership.
            </p>
            <div className="flex space-x-4 pt-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  className="hover:text-[#FFD700] transition-colors"
                  aria-label={`Follow us on ${link.platform}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-[#FFD700]">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url}
                    className="text-gray-200 hover:text-[#FFD700] transition-colors flex items-center gap-2"
                  >
                    {link.icon}
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-[#FFD700]">Contact Us</h3>
            <div className="space-y-3">
              {contactInfo.map((info, index) => (
                <p key={index} className="flex items-center gap-3 text-gray-200">
                  {info.icon}
                  <span>{info.type === 'phone' ? `Emergency: ${info.value}` : info.value}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          {showNewsletter && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4 text-[#FFD700]">Stay Informed</h3>
              <p className="text-gray-200 text-sm">Subscribe to our newsletter for safety tips and updates.</p>
              <form className="space-y-2" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-[#FFD700] transition-colors"
                  required
                />
                <button 
                  type="submit"
                  className="w-full px-4 py-2 rounded-lg bg-[#FFD700] text-[#006838] font-bold hover:bg-white transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-200">
              © {new Date().getFullYear()} Ogun State Community, Social and Security Corps. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-200 hover:text-[#FFD700] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-200 hover:text-[#FFD700] transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-200 hover:text-[#FFD700] transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;