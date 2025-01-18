import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import SideBar from '../components/SideBar';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  dateAssigned: string;
  lastLogin: string;
}

const AssignUser: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'user',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });

  const usersPerPage = 10;

  // Simulated user data - replace with actual API calls
  useEffect(() => {
    const mockUsers: User[] = Array.from({ length: 15 }, (_, i) => ({
      id: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      name: `User ${i + 1}`,
      role: i % 3 === 0 ? 'admin' : 'user',
      dateAssigned: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
      lastLogin: new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString(),
    }));
    setUsers(mockUsers);
  }, []);

  const validateForm = () => {
    const errors = {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    };
    
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    
    if (!formData.name) errors.name = 'Name is required';
    
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, email: formData.email, name: formData.name, role: formData.role }
          : user
      ));
      setEditingUser(null);
    } else {
      const newUser: User = {
        id: `user${users.length + 1}`,
        email: formData.email,
        name: formData.name,
        role: formData.role,
        dateAssigned: new Date().toLocaleDateString(),
        lastLogin: '-',
      };
      setUsers([...users, newUser]);
    }
    
    setFormData({ email: '', name: '', role: 'user', password: '', confirmPassword: '' });
    setShowForm(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      password: '',
      confirmPassword: '',
    });
    setShowForm(true);
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
        <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Assign User</h1>
            <button
            onClick={() => {
                setEditingUser(null);
                setFormData({ email: '', name: '', role: 'user', password: '', confirmPassword: '' });
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
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
                    {editingUser ? 'Update User' : 'Create User'}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Assigned</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white overflow-auto divide-y divide-gray-200">
                {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                        {user.role}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.dateAssigned}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                    <button
                        onClick={() => handleEdit(user)}
                        className="text-indigo-600 hover:text-white hover:bg-indigo-600 border px-3 py-2 shadow-sm rounded-md inline-flex items-center gap-1"
                    >
                        <Edit2 size={16} />
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-white hover:bg-red-600 border px-3 py-2 shadow-sm rounded-md inline-flex items-center gap-1"
                    >
                        <Trash2 size={16} />
                        Delete
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
        </div>
    </div>
  );
};

export default AssignUser;