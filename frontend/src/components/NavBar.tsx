import { useState } from 'react';
import logo from '../assets/logo.webp';
import { Menu, X } from 'lucide-react';

export const NavBar = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
    const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  return (
    <nav className="bg-[#006838] bg-opacity-90 px-4 py-2 shadow-md">
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
            {/* Logo and Brand */}
            <div className="flex items-center gap-2">
                <img 
                src={logo} 
                alt="Logo" 
                className="w-16 h-14 object-cover"
                />
                <span className="text-white font-bold">
                OGUN SO-SAFE CORPS
                </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
                <a href="#" className="text-white hover:text-[#FFD700]">Home</a>
                <a href="#" className="text-white hover:text-[#FFD700]">News and updates</a>
                <div className="relative group">
                    <button 
                        className="text-white hover:text-[#FFD700] flex items-center"
                        onClick={() => setIsAboutOpen(!isAboutOpen)}
                    >
                        About
                        <svg className="w-3 h-3 ml-1 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {
                        isAboutOpen && (
                            <div className="absolute left-0 mt-2 w-48 z-10 text-sm bg-white rounded-md shadow-lg group-hover:block">
                                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Agency</a>
                                <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Management Team</a>
                                <div className="relative group/nested">
                                <button className="w-full text-left px-4 py-2 text-gray-800 hover:bg-green-100 flex items-center justify-between">
                                    Contact
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <div className="absolute right-full top-0 mt-0 w-48 bg-white rounded-md shadow-lg hidden group-hover/nested:block">
                                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Via email</a>
                                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Via telephone</a>
                                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Via twitter</a>
                                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Via Facebook</a>
                                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Via Instagram</a>
                                </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                <a href="#" className="text-white hover:text-[#FFD700]">Department</a>
                <a href="#" className="text-white hover:text-[#FFD700]">Zones</a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
                <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-[#FFD700]"
                >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
            <div className="md:hidden mt-4">
                <a href="#" className="block py-2 text-white hover:text-[#FFD700]">Home</a>
                <div>
                <button 
                    onClick={() => setIsAboutOpen(!isAboutOpen)}
                    className="w-full text-left py-2 text-white hover:text-[#FFD700] flex items-center justify-between"
                >
                    About
                    <svg className={`w-4 h-4 transform ${isAboutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {isAboutOpen && (
                    <div className="pl-4">
                    <a href="#" className="block py-2 text-white hover:text-[#FFD700]">Company</a>
                    <a href="#" className="block py-2 text-white hover:text-[#FFD700]">Team</a>
                    <button
                        onClick={() => setIsContactOpen(!isContactOpen)}
                        className="w-full text-left py-2 text-white hover:text-[#FFD700] flex items-center justify-between"
                    >
                        Contact
                        <svg className={`w-4 h-4 transform ${isContactOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {isContactOpen && (
                        <div className="pl-4">
                            <a href="#" className="block py-2 text-white hover:text-[#FFD700]">Via email</a>
                            <a href="#" className="block py-2 text-white hover:text-[#FFD700]">Via telephone</a>
                            <a href="#" className="block py-2 text-gray-800 hover:bg-green-100">Via twitter</a>
                            <a href="#" className="block py-2 text-gray-800 hover:bg-green-100">Via Facebook</a>
                            <a href="#" className="block py-2 text-gray-800 hover:bg-green-100">Via Instagram</a>
                        </div>
                    )}
                    </div>
                )}
                </div>
                <a href="#" className="block py-2 text-white hover:text-[#FFD700]">News</a>
                <a href="#" className="block py-2 text-white hover:text-[#FFD700]">Products</a>
            </div>
            )}
        </div>
    </nav>
  )
}
