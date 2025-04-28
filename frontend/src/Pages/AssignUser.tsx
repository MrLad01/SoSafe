import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, Save, X, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import SideBar from '../components/SideBar';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  area: string;
  login_attempt: number;
  created_at: string;
  last_seen: string;
}

const AssignUser: React.FC = () => {
  const { token } = useAuth()
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseType, setResponseType] = useState<'success' | 'error'>('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    area:'',
    role: 'divisional_command',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    name: '',
    area: '',
    password: '',
    confirmPassword: '',
  });

  const usersPerPage = 10;

  const formatDate = (date :string ) => {
    return new Date(date).toLocaleDateString();
  }

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
  
      try {
        const response = await axios.get('https://sosafe.onrender.com/api/admins', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setUsers(response.data || []);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch users');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();

    // Set up interval to fetch logs every 10 seconds
    const intervalId = setInterval(fetchUsers, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);

  }, []);
  

  const validateForm = () => {
    const errors = {
      email: '',
      name: '',
      area: '',
      password: '',
      confirmPassword: '',
    };
    
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    
    if (!formData.name) errors.name = 'Name is required';

    if (!formData.area) errors.area = 'Your Area is required';
    
    if (!editingUser) {
      if (!formData.password) errors.password = 'Password is required';
      else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      if (editingUser) {
        const response = await axios.post('https://sosafe.onrender.com/api/edit/admin', {
          id: editingUser.id,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          area: formData.area
        }, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        console.log(editingUser.id);

        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { 
                ...user, 
                email: formData.email, 
                name: formData.name, 
                role: formData.role,
                area: formData.area 
              }
            : user
        ));

        setResponseMessage(response.data.message || 'User updated successfully');
        setResponseType('success');
        setEditingUser(null);
      } else {
        const response = await axios.post('https://sosafe.onrender.com/api/create/admin', {
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          area: formData.area,
          name: formData.name,
          role: formData.role,
        }, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        const newUser: User = {
          id: response.data.id,
          email: formData.email,
          name: formData.name,
          area: formData.area,
          role: formData.role,
          login_attempt: 0,
          created_at: new Date().toISOString(),
          last_seen: '-'
        };

        setUsers([...users, newUser]);
        setResponseMessage(response.data.message || 'User created successfully');
        setResponseType('success');
      }

      setFormData({ email: '', name: '', role: 'divisional_command', area: '', password: '', confirmPassword: '' });
      setShowForm(false);
      setShowResponseModal(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || 'Failed to update/create user';
        setError(errorMsg);
        setResponseMessage(errorMsg);
        setResponseType('error');
        setShowResponseModal(true);
      } else {
        setError('An unexpected error occurred');
        setResponseMessage('An unexpected error occurred');
        setResponseType('error');
        setShowResponseModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

    // Response Modal Component
    const ResponseModal = () => {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-center mb-4">
              {responseType === 'success' ? (
                <CheckCircle size={64} className="text-green-500" />
              ) : (
                <AlertCircle size={64} className="text-red-500" />
              )}
            </div>
            <h2 className={`text-xl font-bold text-center mb-4 ${responseType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {responseType === 'success' ? 'Success' : 'Error'}
            </h2>
            <p className="text-center mb-6">{responseMessage}</p>
            <button 
              onClick={() => setShowResponseModal(false)}
              className={`w-full py-2 rounded-lg ${
                responseType === 'success' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      );
    };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      area: user.area,
      role: user.role,
      password: '',
      confirmPassword: '',
    });
    setShowForm(true);
  };

  const handleReset = async (userId: string) => {
    if (window.confirm('Are you sure you want to reset this user login attempts?')) {
      await axios.post(`https://sosafe.onrender.com/api/reset`,{
          id: userId
      } , {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    }
  };
  const handleAllReset = async () => {
    if (window.confirm('Are you sure you want to reset all users login attempts?')) {
      await axios.get(`https://sosafe.onrender.com/api/reset-all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    }
  };
  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <SideBar />
        <div className="w-full p-8 border overflow-auto mx-auto">
        {/* Error Alert */}
        {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            </div>
        )}
        <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Assign User</h1>
            <button
            onClick={() => {
                setEditingUser(null);
                setFormData({ email: '', name: '', area: '', role: 'divisional_command', password: '', confirmPassword: '' });
                setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
            <Plus size={20} />
            Add New User
            </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 outline-green-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
        </div>

        {/* User Form */}
        {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                <button onClick={() => setShowForm(false)} title='hide form' className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                    type="email"
                    value={formData.email}
                    title='enter email'
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                    type="text"
                    value={formData.name}
                    title='enter name'
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                    <input
                    type="text"
                    value={formData.area}
                    title='enter your area'
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {formErrors.area && <p className="text-red-500 text-sm mt-1">{formErrors.area}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                    value={formData.role}
                    title='pick role'
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                    <option value="divisional_command">Divisional Commander</option>
                    <option value="zonal_command">Zonal Commander</option>
                    </select>
                </div>
                {!editingUser && (
                    <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                        type="password"
                        value={formData.password}
                        title='enter password'
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input
                        type="password"
                        value={formData.confirmPassword}
                        title='confirm password'
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        {formErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>}
                    </div>
                    </>
                )}
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Save size={20} />
                    {editingUser ? 'Update User' : loading ? 'Creating...' : 'Create User'}
                </button>
                </form>
            </div>
            </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Assigned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Attempts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white overflow-auto divide-y divide-gray-200">
                {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.area}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'divisional_command' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                        {user.role}
                    </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_seen == null ? '--' : formatDate(user.last_seen)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.login_attempt == 0 ? '--' : user.login_attempt}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:text-white hover:bg-indigo-600 border px-3 py-2 shadow-sm rounded-md inline-flex items-center gap-1 group"
                    >
                        <Edit2 size={16} className="group-hover:mr-2 transition-all  duration-300" />
                        <span className="hidden group-hover:inline-block transition-all  duration-300">
                          Edit
                        </span>
                    </button>
                    <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-white hover:bg-red-600 border px-3 py-2 shadow-sm rounded-md inline-flex items-center gap-1 group"
                    >
                        <Trash2 size={16} className="group-hover:mr-2 transition-all  duration-300" />
                        <span className="hidden group-hover:inline-block transition-all  duration-300">
                          Delete
                        </span>
                    </button>
                    <button
                      onClick={() => handleReset(user.id)}
                      className="text-gray-600 hover:text-white hover:bg-gray-600 border px-3 py-2 shadow-sm rounded-md inline-flex items-center gap-1 group"
                    >
                      <RotateCcw size={16} className="group-hover:mr-2 transition-all  duration-500"/>
                      <span className="hidden group-hover:inline-block transition-all  duration-500">
                          Reset login
                      </span>
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Next
                </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                        {(currentPage - 1) * usersPerPage + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                        {Math.min(currentPage * usersPerPage, filteredUsers.length)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{filteredUsers.length}</span>{' '}
                    results
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                        onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                        currentPage === 1
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === i + 1
                            ? 'z-10 bg-green-50 border-green-500 text-green-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                        >
                        {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                        currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        Next
                    </button>
                    </nav>
                </div>
                </div>
            </div>
            )}
        </div>
          <div className='w-full p-2 flex items-center justify-center mt-6'>
           <button
              onClick={() => handleAllReset()}
              className="text-gray-600 hover:text-white hover:bg-gray-600 border px-3 py-2 shadow-sm text-[0.92rem] rounded-md inline-flex items-center gap-1 group"
            >
              <RotateCcw size={16} className="group-hover:mr-2 transition-all  duration-500"/>
              <span className="group-hover:inline-block transition-all  duration-500">
                  Reset all login attempts
              </span>
            </button>
          </div>
        </div>
        {showResponseModal && <ResponseModal />}
    </div>
  );
};

export default AssignUser;