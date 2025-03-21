import React, { useState, useEffect } from 'react';
import { FileCheck, School, Users, X, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api/api';

const HomePage = () => {
  const [dashboardData, setDashboardData] = useState({
    formCount: 0,
    institutions: 0,
    activeReviews: 0
  });
  const [recentForms, setRecentForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
  const token = loginResponse?.output?.token;
  const isSection = userData.userType === 'Section';
  const isAdminOrReport = userData.userType === 'Admin' || userData.userType === 'Report';

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const headers = { 'Authorization': token };

        // Fetch form count based on user type - using only existing endpoints
        if (userData.userType === 'Admin' || userData.userType === 'Report') {
          const formCountResponse = await api.get('/allFormsCountAdmin', { headers });
          if (formCountResponse.data && formCountResponse.data.results) {
            setDashboardData(prevData => ({
              ...prevData,
              formCount: formCountResponse.data.results,
              // Keep these values dynamic but initialized at 0
              institutions: 0,
              activeReviews: 0
            }));
          }
        } else if (userData.userType === 'Section') {
          const formCountResponse = await api.get('/allFormsCountSection', { 
            headers,
            params: { section: loginResponse.output.data.id }
          });
          if (formCountResponse.data && formCountResponse.data.results) {
            setDashboardData(prevData => ({
              ...prevData,
              formCount: formCountResponse.data.results,
              // Keep these values dynamic but initialized at 0
              institutions: 0,
              activeReviews: 0
            }));
          }
        }

        // Fetch recent forms based on user type - using only existing endpoints
        const recentFormsEndpoint = userData.userType === 'Admin' || userData.userType === 'Report'
          ? '/recentFormsAdmin'
          : userData.userType === 'Section' 
            ? '/recentFormsSection'
            : null;

        if (recentFormsEndpoint) {
          const params = userData.userType === 'Section' ? { section: loginResponse.output.data.id } : {};
          const recentFormsResponse = await api.get(recentFormsEndpoint, { 
            headers,
            params 
          });
          
          if (recentFormsResponse.data && recentFormsResponse.data.results) {
            setRecentForms(recentFormsResponse.data.results);
          }
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setLoading(false);
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchData();
  }, [token, userData.userType, loginResponse.output?.data?.id]);

  const handleViewDetails = (form) => {
    setSelectedForm(form);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeStyles = (status) => {
    switch(status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-amber-100 text-amber-800';
      case 'In Review':
        return 'bg-blue-100 text-blue-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderFormCount = () => {
    if (loading) {
      return <p className="text-sm text-gray-500">Loading...</p>;
    }
    if (error) {
      return <p className="text-sm text-red-500">{error}</p>;
    }
    if (!['Admin', 'Section', 'Report'].includes(userData.userType)) {
      return <p className="text-sm text-gray-500">Not available for your user type</p>;
    }
    return <h3 className="text-2xl font-bold text-gray-900">{dashboardData.formCount}</h3>;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Applications</p>
                <div className="mt-2">{renderFormCount()}</div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          

    
        </div>

        {['Admin', 'Section', 'Report'].includes(userData.userType) && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Applications</h2>
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : recentForms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentForms.map((form) => (
                  <div key={form.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium text-gray-800 truncate max-w-xs">{form.schoolName}</h3>
                        <p className="text-sm text-blue-600 mt-1">UDISE: {form.udiseCode}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusBadgeStyles(form.status)}`}>
                        {form.status === 'Completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {form.status === 'Pending' && <Clock className="h-3 w-3 mr-1" />}
                        {form.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {formatDate(form.formDate)}
                      </span>
                      <button
                        onClick={() => handleViewDetails(form)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No recent applications</p>
              </div>
            )}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Details</h2>
              
              {selectedForm && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800">Institution Details</h4>
                    <p className="text-sm text-gray-600 mt-1">Name: {selectedForm.schoolName}</p>
                    <p className="text-sm text-gray-600">UDISE Code: {selectedForm.udiseCode}</p>
                    <p className="text-sm text-gray-600">Form Date: {formatDate(selectedForm.formDate)}</p>
                    <p className="text-sm text-gray-600">Status: 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs inline-flex items-center ${getStatusBadgeStyles(selectedForm.status)}`}>
                        {selectedForm.status}
                      </span>
                    </p>
                    {selectedForm.address && (userData.userType === 'Admin' || userData.userType === 'Report') && (
                      <p className="text-sm text-gray-600">Address: {selectedForm.address}</p>
                    )}
                    <p className="text-sm text-gray-600">School Category: {selectedForm.schoolCategory}</p>
                    {selectedForm.feeformSchoolId && (
                      <p className="text-sm text-gray-600">School ID: {selectedForm.feeformSchoolId}</p>
                    )}
                    {/* Show email only for admin users */}
                    {selectedForm.email && (userData.userType === 'Admin' || userData.userType === 'Report') && (
                      <p className="text-sm text-gray-600">Email: {selectedForm.email}</p>
                    )}
                    {/* Don't show contact details for section users */}
                    {selectedForm.correspondantOrPrincipalName && (userData.userType === 'Admin' || userData.userType === 'Report') && (
                      <p className="text-sm text-gray-600">
                        {selectedForm.correspondantOrPrincipal === 'principal' ? 'Principal' : 'Correspondant'}: 
                        {selectedForm.correspondantOrPrincipalName}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;