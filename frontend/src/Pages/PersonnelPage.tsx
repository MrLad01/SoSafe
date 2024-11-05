// import React from 'react';
import { UserPlus } from 'lucide-react';
import { NavBar } from '../components/NavBar';
import Footer from '../components/Footer';

const PersonnelPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBar />
      <div className="max-w-7xl mx-auto py-[8rem] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            OGUN SO-SAFE CORPS Personnel
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            The personnel page is dedicated to showcasing the officers who make up the OGUN SO-SAFE CORPS. These individuals are the backbone of our organization, working tirelessly to ensure the safety and security of our community.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Officer Login
          </a>
        </div>

        {/* Add officer cards here */}
      </div>
      <Footer />
    </div>
  );
};

export default PersonnelPage;