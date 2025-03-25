import React, { useState, useEffect } from 'react';
import { FileCheck } from 'lucide-react';
import api from '../api/api';

const TotalApplicationsCard = () => {
  const [formCount, setFormCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
  const token = loginResponse?.output?.token;

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
            setFormCount(formCountResponse.data.results);
          }
        } else if (userData.userType === 'Section') {
          const formCountResponse = await api.get('/allFormsCountSection', { 
            headers,
            params: { section: loginResponse.output.data.id }
          });
          if (formCountResponse.data && formCountResponse.data.results) {
            setFormCount(formCountResponse.data.results);
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

  const renderFormCount = () => {
    if (loading) {
      return <p className="text-sm text-gray-500">Loading...</p>;
    }
    if (error) {
      return <p className="text-sm text-red-500">{error}</p>;
    }
    if (!['Admin', 'Section', 'Report'].includes(userData.userType)) {
      return <p className="text-sm text-gray-500">Not available</p>;
    }
    return <h3 className="text-xl font-bold text-gray-900">{formCount}</h3>;
  };

  return (
    <div className="flex justify-center items-center pt-10">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200 w-64">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700">Total Applications</p>
            <div className="mt-2">{renderFormCount()}</div>
          </div>
          <div className="bg-blue-100 p-2 rounded-full">
            <FileCheck className="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalApplicationsCard;