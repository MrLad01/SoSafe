import React, { useState, useEffect } from 'react';
import {  Lock, Eye, Book, Bell, FileText, X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#006838]">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PolicyModals = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'sitemap' | null>(null);

  // Example trigger buttons
  return (
    <div className='text-sm'>
      {/* Trigger Buttons */}
      <div className="space-x-1">
        <button
          onClick={() => setActiveModal('privacy')}
          className="px-4 py-2 bg-[#006838] text-white rounded hover:text-[#FFD700] transition-colors"
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setActiveModal('terms')}
          className="px-4 py-2 bg-[#006838] text-white rounded hover:text-[#FFD700] transition-colors"
        >
          Terms of Service
        </button>
        <button
          onClick={() => setActiveModal('sitemap')}
          className="px-4 py-2 bg-[#006838] text-white rounded hover:text-[#FFD700] transition-colors"
        >
          Sitemap
        </button>
      </div>

      {/* Privacy Policy Modal */}
      <Modal
        isOpen={activeModal === 'privacy'}
        onClose={() => setActiveModal(null)}
        title="Privacy Policy"
      >
        <div className="space-y-8">
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#006838] flex items-center gap-2 mb-4">
              <Lock size={20} />
              Introduction
            </h2>
            <p className="text-gray-600 mb-4">
              The Ogun State Community, Social and Security Corps (So-Safe Corps) is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
            </p>
          </section>

          {/* Additional Privacy Policy sections... */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#006838] flex items-center gap-2 mb-4">
              <Eye size={20} />
              Information We Collect
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Personal identification information</li>
              <li>Emergency contact details</li>
              <li>Location data when reporting incidents</li>
              <li>Security footage and surveillance data</li>
              <li>Incident reports and documentation</li>
            </ul>
          </section>
        </div>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        isOpen={activeModal === 'terms'}
        onClose={() => setActiveModal(null)}
        title="Terms of Service"
      >
        <div className="space-y-8">
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#006838] flex items-center gap-2 mb-4">
              <Book size={20} />
              Agreement to Terms
            </h2>
            <p className="text-gray-600 mb-4">
              By accessing or using the services of the Ogun State Community, Social and Security Corps (So-Safe Corps), you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#006838] flex items-center gap-2 mb-4">
              <Bell size={20} />
              Service Description
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Emergency response services</li>
              <li>Community security patrols</li>
              <li>Incident reporting system</li>
              <li>Security advisory services</li>
              <li>Community engagement programs</li>
            </ul>
          </section>
        </div>
      </Modal>

      {/* Sitemap Modal */}
      <Modal
        isOpen={activeModal === 'sitemap'}
        onClose={() => setActiveModal(null)}
        title="Sitemap"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#006838] flex items-center gap-2 mb-4">
              <FileText size={20} />
              Main Pages
            </h2>
            <ul className="space-y-2">
              <li><a href="/" className="text-[#006838] hover:text-[#FFD700] transition-colors">Home</a></li>
              <li><a href="/about" className="text-[#006838] hover:text-[#FFD700] transition-colors">About Us</a></li>
              <li><a href="/services" className="text-[#006838] hover:text-[#FFD700] transition-colors">Our Services</a></li>
              <li><a href="/news" className="text-[#006838] hover:text-[#FFD700] transition-colors">News & Updates</a></li>
            </ul>
          </section>

          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-[#006838] flex items-center gap-2 mb-4">
              <Bell size={20} />
              Services
            </h2>
            <ul className="space-y-2">
              <li><a href="/services/emergency" className="text-[#006838] hover:text-[#FFD700] transition-colors">Emergency Response</a></li>
              <li><a href="/services/patrol" className="text-[#006838] hover:text-[#FFD700] transition-colors">Community Patrol</a></li>
              <li><a href="/services/training" className="text-[#006838] hover:text-[#FFD700] transition-colors">Training Programs</a></li>
            </ul>
          </section>
        </div>
      </Modal>
    </div>
  );
};

export default PolicyModals;