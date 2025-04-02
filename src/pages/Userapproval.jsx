import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle, LogOut, RefreshCw, Key } from 'lucide-react';
import api from '../api/api';

const UserApprovalPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Password reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

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
      
      // Fetch all users
      const response = await api.get('/getAllUsers', {
        headers: {
          'Authorization': token
        }
      });
      
      if (response.data && response.data.results) {
        // Store all users
        setAllUsers(response.data.results);
        
        // Get active users (with status 'approved')
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

  const openResetPasswordModal = (user) => {
    setResetUser(user);
    setNewPassword('');
    setShowResetModal(true);
  };

  const handleResetPassword = async () => {
    if (!resetUser || !newPassword) {
      setError('User and new password are required');
      return;
    }

    try {
      setIsResetPasswordLoading(true);
      
      // Get authentication token from localStorage
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
      const token = loginResponse?.output?.token;
      
      // Call the password reset API
      await api.post('/resetPassword', 
        {
          userId: resetUser.id,
          newPassword
        },
        {
          headers: {
            'Authorization': token
          }
        }
      );
      
      // Close the modal and clear form
      setShowResetModal(false);
      setNewPassword('');
      setResetUser(null);
      
      setSuccessMessage(`Password for ${resetUser.userName} has been reset successfully.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to reset password:', err);
      setError('Failed to reset password. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsResetPasswordLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      setIsLoading(true);
      
      // Get authentication token from localStorage
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
      const token = loginResponse?.output?.token;
      
      // Call the backup API endpoint with the token
      await api.post('/backup_data', 
        {},
        {
          headers: {
            'Authorization': token
          }
        }
      );
      
      setSuccessMessage('System backup completed successfully.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to backup data:', err);
      setError('Failed to backup data. Please try again.');
      
      // Clear error message after 3 seconds
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a random strong password
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setNewPassword(password);
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage user access and pending registration requests</p>
        </div>
        <button
          onClick={handleBackup}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
        >
          {isLoading ? 'Processing...' : 'Backup'}
        </button>
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

      {/* All Users Section */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">All Users</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading users...</p>
            </div>
          ) : allUsers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No users found.</p>
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
                    Status
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
                {allUsers.map((user) => (
                  <tr key={user.id} className={user.status === 'pending' ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.status === 'approved' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      ) : user.status === 'pending' ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(user.lastLoginDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openResetPasswordModal(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                        disabled={isLoading}
                      >
                        <Key className="h-4 w-4 mr-1" />
                        Reset Password
                      </button>
                      {user.status === 'approved' && (
                        <button
                          onClick={() => handleForceLogout(user.id, user.userName)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                          disabled={isLogoutLoading}
                        >
                          <LogOut className="h-4 w-4 mr-1" />
                          Force Logout
                        </button>
                      )}
                      {user.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(user.id, 'approved')}
                            className="text-green-600 hover:text-green-900 mr-4 inline-flex items-center"
                            disabled={isLoading}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(user.id, 'rejected')}
                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reset Password</h3>
            <p className="text-gray-600 mb-4">
              Reset password for user: <span className="font-semibold">{resetUser?.userName}</span>
            </p>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="ml-2 p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  title="Generate random password"
                >
                  <RefreshCw className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={isResetPasswordLoading || !newPassword}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isResetPasswordLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserApprovalPage;