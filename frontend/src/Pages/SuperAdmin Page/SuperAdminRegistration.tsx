// SuperAdminRegistration.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.webp'

const SuperAdminRegistration = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminExists();
    // setLoading(false);
  }, []);

  const checkAdminExists = async () => {
    try {
      const response = await axios.get('https://sosafe.onrender.com/api/admin/check');
      if (!response.status) {
        navigate('/login');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log(formData);
    

    try {
      await axios.post('https://sosafe.onrender.com/api/register', {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });

//       {
      //     "user": {
      //         "name": "MrLad",
      //         "email": "ladindin@gmail.com",
      //         "updated_at": "2025-01-15T20:34:39.000000Z",
      //         "created_at": "2025-01-15T20:34:39.000000Z",
      //         "id": 1
      //     },
      //     "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vc29zYWZlLm9ucmVuZGVyLmNvbS9hcGkvcmVnaXN0ZXIiLCJpYXQiOjE3MzY5NzMyNzksImV4cCI6MTczNjk3Njg3OSwibmJmIjoxNzM2OTczMjc5LCJqdGkiOiJXRzVBSWVmUTFUNk92UUhxIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.nNTUvbEsymgUDfxTA4uktMooiPO2QlEn-f8vQZfnD2Q"
      // }

      navigate('/admin');
    } catch (error) {
      console.error('Error registering admin:', error);
      alert('Failed to register admin. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-green-800 text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Ogun State So-Safe Corps</h1>
          <span className="text-sm">Admin Portal</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-[40rem] w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          {/* Logo and Welcome Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-[6rem] h-[6rem] p-3 relative mb-2">
              <div className="absolute inset-0 bg-green-100 rounded-full"></div>
              <img
                src={logo}
                alt="Ogun State So-Safe Corps Logo"
                className="absolute inset-0 left-[0.6rem] top-[0.6rem] w-[80%] h-[80%] object-contain p-2"
              />
            </div>
            
            <h2 className="text-center text-2xl font-extrabold text-gray-900">
              Welcome to Ogun So-Safe Corps
            </h2>
            <div className="mt-2 text-center space-y-1">
              <p className="text-[0.68rem] text-gray-600">
                Thank you for taking the first step in setting up your administrative account.
              </p>
              <p className="text-[0.68rem] text-gray-500">
                As the Super Admin, you'll have complete access to manage and oversee all aspects of the system.
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <form className="mt-2 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <div>
                <label htmlFor="username" className="block text-[0.68rem] font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-lg text-[0.89rem] relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="Enter your username"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[0.68rem] font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg text-[0.89rem] relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="Enter your email"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[0.68rem] font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg text-[0.89rem] relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="Create a strong password"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-[0.68rem] font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-lg text-[0.89rem] relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150 ease-in-out"
                  placeholder="Confirm your password"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out transform hover:-translate-y-0.5"
              >
                Create Super Admin Account
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              By registering, you agree to the terms and conditions of Ogun State So-Safe Corps
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminRegistration;