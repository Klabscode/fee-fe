import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, LogOut } from 'lucide-react';
import api from '../api/api';

const UserApprovalPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check if logged in user is Admin
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const isAdmin = userData.userType === 'Admin';
  
  useEffect(() => {
    // Only fetch users if admin
    if (isAdmin) {
      fetchPendingUsers();
      fetchAllUsers();
    }
  }, [isAdmin]);

  const fetchPendingUsers = async () => {
    try {
      setIsLoading(true);
      // Get authentication token from localStorage
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
      const token = loginResponse?.output?.token;
      
      // Include token in the request header matching the format used in FormsPage
      const response = await api.get('/getPendingUsers', {
        headers: {
          'Authorization': token
        }
      });
      
      if (response.data && response.data.results) {
        // Filter out any admin users that might be in the pending list
        const nonAdminPendingUsers = response.data.results.filter(
          user => user.userType !== 'Admin'
        );
        setPendingUsers(nonAdminPendingUsers);
      }
    } catch (err) {
      console.error('Failed to fetch pending users:', err);
      setError('Failed to load pending user requests.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      // Get authentication token from localStorage
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
      const token = loginResponse?.output?.token;
      
      // Fetch all active users
      const response = await api.get('/getAllUsers', {
        headers: {
          'Authorization': token
        }
      });
      
      if (response.data && response.data.results) {
        // Get all active users (with status 'approved')
        const approvedUsers = response.data.results.filter(
          user => user.status === 'approved'
        );
        setActiveUsers(approvedUsers);
      }
    } catch (err) {
      console.error('Failed to fetch all users:', err);
    }
  };

  const handleStatusUpdate = async (userId, status) => {
    try {
      setIsLoading(true);
      
      // Get authentication token from localStorage
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
      const token = loginResponse?.output?.token;
      
      // Include token in the request header
      await api.post('/updateUserStatus', 
        {
          userId,
          status
        },
        {
          headers: {
            'Authorization': token
          }
        }
      );
      
      // Remove the user from the pending list
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      
      // Refresh the active users list if a user was approved
      if (status === 'approved') {
        fetchAllUsers();
      }
      
      setSuccessMessage(`User ${status} successfully.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(`Failed to ${status} user:`, err);
      setError(`Failed to ${status} user. Please try again.`);
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceLogout = async (userId, userName) => {
    try {
      setIsLogoutLoading(true);
      
      // Get authentication token from localStorage
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
      const token = loginResponse?.output?.token;
      
      // Call the force logout API
      await api.post('/forceLogoutUser', 
        {
          userId
        },
        {
          headers: {
            'Authorization': token
          }
        }
      );
      
      // Refresh both user lists
      fetchAllUsers();
      fetchPendingUsers();
      
      setSuccessMessage(`User ${userName} has been logged out.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to force logout user:', err);
      setError('Failed to force logout user. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLogoutLoading(false);
    }
  };

  // Format date string to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage user access and pending registration requests</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded">
          <p>{successMessage}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Active Users Section */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Users</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading active users...</p>
            </div>
          ) : activeUsers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No active users found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(user.lastLoginDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleForceLogout(user.id, user.userName)}
                        className="text-red-600 hover:text-red-900 flex items-center justify-end"
                        disabled={isLogoutLoading}
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Force Logout
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pending Users Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Pending Approval Requests</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading pending users...</p>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No pending user requests</p>
              <p className="text-gray-400 text-sm mt-1">All user requests have been processed.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(user.lastLoginDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleStatusUpdate(user.id, 'approved')}
                        className="text-green-600 hover:text-green-900 mr-4"
                        disabled={isLoading}
                      >
                        <span className="flex items-center">
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(user.id, 'rejected')}
                        className="text-red-600 hover:text-red-900"
                        disabled={isLoading}
                      >
                        <span className="flex items-center">
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserApprovalPage;