import { useState, FormEvent, useEffect } from 'react';
import { Shield, Users, ChevronRight, Mail, IdCard, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp'
import axios from "axios";
import { useAuth } from '../context/AuthContext';

type LoginType = 'officer' | 'supervisor';

interface FormData {
  email: string;
  password: string;
  role: string;
}

const OfficerLoginPage = (): JSX.Element => {
  const [loginType, setLoginType] = useState<LoginType>('officer');
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    password: '',
    email: '',
    role: 'user | admin'
  });
  const [idNumber, setIdNumber] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (loginType === 'officer') {
        if (!idNumber.trim()) {
          throw new Error('Please enter a valid form number');
        }
        
        const officerData = await axios.get(
          `https://sosafe.onrender.com/api/biodata2/form/${idNumber}`,
          { timeout: 100000 }
        );
        
        if (officerData.data) {
          sessionStorage.setItem('officerId', officerData.data.id);
          navigate('/officer/name');
        } else {
          throw new Error('Invalid form number');
        }
      } else {
        if(formData.role === 'user'){
          const response = await axios.post(
            'https://sosafe.onrender.com/api/user/login',
            {
              email: formData.email,
              password: formData.password,
            },
            {
              timeout: 120000,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          if (response.data) {
            login(response.data.token, response.data.user);
            navigate('/admin');
          } else {
            throw new Error('Invalid credentials');
          }
        } else {
          const response = await axios.post(
            'https://sosafe.onrender.com/api/login',
            {
              email: formData.email,
              password: formData.password,
            },
            {
              timeout: 120000,
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          if (response.data) {
            login(response.data.token, response.data.user);
            navigate('/admin');
          } else {
            throw new Error('Invalid credentials');
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message
        : 'An error occurred during login. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError('');
    setFormData({ email: '', password: '', role: 'user' });
    setIdNumber('');

    const updateVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateVH();
    window.addEventListener('resize', updateVH);
    window.addEventListener('orientationchange', updateVH);

    return () => {
      window.removeEventListener('resize', updateVH);
      window.removeEventListener('orientationchange', updateVH);
    };
  }, [loginType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBack = (): void => {
    navigate('/personnel');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 flex items-center space-x-2 text-white md:text-gray-600 hover:text-green-700 transition-colors duration-200 z-10"
        type="button"
        aria-label="Go back to previous page"
      >
        <ArrowLeft className="h-6 w-6 text-white opacity-50" />
        <span className="text-sm font-medium text-white opacity-50">Back</span>
      </button>

      <div className="w-full md:w-1/2 bg-gradient-to-br from-green-800 to-green-900 p-8 flex flex-col justify-center items-center text-white">
        <img src={logo} alt="OGUN SO-SAFE CORPS" className="h-24 w-auto mb-8" />
        <h1 className="text-4xl font-bold text-center mb-4">OGUN SO-SAFE CORPS</h1>
        <p className="text-lg text-center text-green-100 max-w-md">
          Securing our communities through dedication, vigilance, and unwavering service.
        </p>
      </div>

      <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full space-y-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginType('officer')}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md space-x-2 transition-all duration-200 ${
                loginType === 'officer'
                  ? 'bg-white shadow text-green-800'
                  : 'text-gray-600 hover:text-green-700'
              }`}
            >
              <Users size={20} />
              <span>Officer</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginType('supervisor')}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-md space-x-2 transition-all duration-200 ${
                loginType === 'supervisor'
                  ? 'bg-white shadow text-green-800'
                  : 'text-gray-600 hover:text-green-700'
              }`}
            >
              <Shield size={20} />
              <span>Supervisor / Admin</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {loginType === 'officer' ? (
              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Officer Form Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="idNumber"
                    name="idNumber"
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    placeholder="Enter your Form number"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    title='pick role'
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="mr-2">Login to Dashboard</span>
                  <ChevronRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfficerLoginPage;