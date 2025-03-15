import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Check, X, AlertCircle } from 'lucide-react';
import api from '../api/api';

const UserApprovalPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check if logged in user is Admin
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const isAdmin = userData.userType === 'Admin';
  
  useEffect(() => {
    // Only fetch pending users if admin
    if (isAdmin) {
      fetchPendingUsers();
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

  const handleStatusUpdate = async (userId, status) => {
    try {
      setIsLoading(true);
      
      // Get authentication token from localStorage
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
      const token = loginResponse?.output?.token;
      
      // Include token in the request header - using same format as fetchPendingUsers
      await api.post('/updateUserStatus', 
        {
          userId,
          status
        },
        {
          headers: {
            'Authorization': token  // Changed from 'x-access-token' to match fetchPendingUsers
          }
        }
      );
      
      // Remove the user from the list
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Approval Dashboard</h1>
        <p className="text-gray-600">Manage pending user registration requests</p>
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

      {/* Pending Users Table */}
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
                  Registration Date
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
                    <div className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
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
  );
};

export default UserApprovalPage;