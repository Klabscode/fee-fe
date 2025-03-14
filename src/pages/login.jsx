import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Lock, User } from 'lucide-react';
import api from '../api/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userTypes, setUserTypes] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  useEffect(() => {
    fetchUserTypes();
  }, []);

  useEffect(() => {
    if (selectedUserType && !isRegistering) {
      fetchUserNames(selectedUserType);
    }
  }, [selectedUserType, isRegistering]);

  const fetchUserTypes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/getLoginUserTypes');
      if (response.data && response.data.results) {
        setUserTypes(response.data.results);
      }
      setError('');
    } catch (err) {
      setError('Failed to fetch user types');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserNames = async (userType) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/getUserNamesByUserType?userType=${userType}`);
      if (response.data && response.data.results) {
        const names = response.data.results.map(user => user.userName);
        setUserNames(names);
      }
      setError('');
    } catch (err) {
      setError('Failed to fetch usernames');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedUserType || !selectedUserName || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/login', {
        userType: selectedUserType,
        userName: selectedUserName,
        password: password
      });
      
      localStorage.setItem('loginResponse', JSON.stringify(response.data));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userData', JSON.stringify({
        userType: selectedUserType,
        userName: selectedUserName
      }));

      console.log('Login successful:', response.data);
      setError('');
      navigate('/home');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selectedUserType || !newUserName || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post('/register', {
        userType: selectedUserType,
        userName: newUserName,
        password: password
      });
      console.log('Registration successful:', response.data);
      setError('');
      setIsRegistering(false);
      setNewUserName('');
      setPassword('');
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setSelectedUserName('');
    setNewUserName('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <img src="/images/logo.png" alt="TN Government Logo" className="h-16 w-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center">Fee Committee Portal</h2>
            <p className="mt-2 text-gray-600 text-center">{isRegistering ? 'Create your account' : 'Sign in to your account'}</p>
          </div>

          {/* Form */}
          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm rounded">
                <p>{error}</p>
              </div>
            )}

            {/* User Type Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Type
              </label>
              <div className="relative">
                <select
                  value={selectedUserType}
                  onChange={(e) => setSelectedUserType(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  disabled={isLoading}
                >
                  <option value="">Select User Type</option>
                  {userTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Username Field */}
            {isRegistering ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Enter new username"
                    disabled={isLoading}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <select
                    value={selectedUserName}
                    onChange={(e) => setSelectedUserName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    disabled={!selectedUserType || isLoading}
                  >
                    <option value="">Select Username</option>
                    {userNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : isRegistering ? (
                  'Register Account'
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* Toggle Login/Register */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register now'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:block lg:w-1/2 relative bg-indigo-50">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <img 
            src="/images/login.png" 
            alt="Government Services Illustration" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;