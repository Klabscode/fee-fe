import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Lock, User, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import api from '../api/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const timeLogout = location.state?.timeLogout;
  
  const [userTypes, setUserTypes] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(''); // 'warning', 'error', 'success', 'info'
  const [isRegistering, setIsRegistering] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [rejectedUser, setRejectedUser] = useState(false);

  useEffect(() => {
    fetchUserTypes();
    
    // Check if user was logged out due to time restriction
    if (timeLogout) {
      setStatusType('warning');
      setStatusMessage("Your session has expired for today. Please login again tomorrow.");
    }
  }, [timeLogout]);

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
      setRejectedUser(false);
      
      const response = await api.post('/login', {
        userType: selectedUserType,
        userName: selectedUserName,
        password: password
      });
      
      // Check if this is a status update response for rejected users
      if (response.data.status === 'pending' && response.data.message) {
        setRejectedUser(true);
        setStatusType('info');
        setStatusMessage(response.data.message);
        setPassword('');
        return;
      }
      
      // Normal login flow
      localStorage.setItem('loginResponse', JSON.stringify(response.data));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userData', JSON.stringify({
        userType: selectedUserType,
        userName: selectedUserName
      }));

      console.log('Login successful:', response.data);
      setError('');
      setStatusMessage('');
      
      // Navigate to home page
      navigate('/home');
      
    } catch (err) {
      console.error(err);
      
      // Handle different error scenarios
      if (err.response) {
        if (err.response.status === 403) {
          setStatusType('warning');
          
          if (err.response.data.error === 'Your account is pending approval') {
            setStatusMessage('Your account is pending approval from an administrator.');
          } else if (err.response.data.error === 'Your account has not been approved') {
            setStatusMessage('Your account has not been approved. Please contact an administrator.');
          } else if (err.response.data.error === 'Your session has expired for today. Please login tomorrow.') {
            setStatusMessage('Your session has expired for today. Please login again tomorrow.');
          } else {
            setStatusType('error');
            setError(err.response.data.error || 'Login failed');
          }
        } else {
          setStatusType('error');
          setError(err.response.data.error || 'Login failed. Please check your credentials.');
        }
      } else {
        setStatusType('error');
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResubmit = async (e) => {
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
      
      setRejectedUser(false);
      setStatusType('success');
      setStatusMessage('Your account has been resubmitted for approval.');
      setPassword('');
      
    } catch (err) {
      console.error(err);
      setStatusType('error');
      setError('Failed to resubmit your account. Please try again.');
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
      setRegistrationSuccess(true);
      
      // Show appropriate message based on user type
      if (selectedUserType === 'Admin') {
        setStatusType('success');
        setStatusMessage('Your Admin account has been registered successfully.');
      } else {
        setStatusType('info');
        setStatusMessage('Your account has been registered and is pending approval from an administrator.');
      }
      
      setNewUserName('');
      setPassword('');
      
    } catch (err) {
      setStatusType('error');
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setStatusMessage('');
    setStatusType('');
    setRegistrationSuccess(false);
    setRejectedUser(false);
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

          {/* Time Logout Message */}
          {timeLogout && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded flex items-start">
              <Clock className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Session Expired</p>
                <p className="text-sm mt-1">Your session has expired for today. Please login again tomorrow.</p>
              </div>
            </div>
          )}

          {/* Success Message for Registration */}
          {registrationSuccess && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded">
              <p className="font-medium">Registration Successful!</p>
              {statusMessage && <p className="mt-1 text-sm">{statusMessage}</p>}
              <button 
                className="mt-2 text-sm text-green-700 underline"
                onClick={() => {
                  setIsRegistering(false);
                  setRegistrationSuccess(false);
                }}
              >
                Return to login
              </button>
            </div>
          )}

          {/* Rejected User Resubmission */}
          {rejectedUser && (
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
              <div className="flex items-start">
                <RefreshCw className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Resubmit Account</p>
                  <p className="mt-1 text-sm">{statusMessage || 'Your account was previously rejected. Would you like to resubmit your account for approval?'}</p>
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={handleResubmit}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Resubmit for Approval'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          {!registrationSuccess && !rejectedUser && (
            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm rounded">
                  <p>{error}</p>
                </div>
              )}

              {statusMessage && !error && (
                <div className={`${
                  statusType === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' : 
                  statusType === 'success' ? 'bg-green-50 border-green-500 text-green-700' :
                  statusType === 'info' ? 'bg-blue-50 border-blue-500 text-blue-700' :
                  'bg-red-50 border-red-500 text-red-700'
                } border-l-4 p-4 text-sm rounded flex`}>
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>{statusMessage}</p>
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
          )}
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