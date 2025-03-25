import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Search, Calendar, ChevronDown, RefreshCw } from 'lucide-react';
import api from '../api/api';

const CascadingFilters = ({ onApplyFilters, isFormsLoading, data = [] }) => {
  const [districts, setDistricts] = useState([]);
  const [schoolTypes, setSchoolTypes] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    districtId: '',
    schoolCategory: '',
    fromDate: '',
    toDate: '',
    status: ''
  });

  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
  const token = loginResponse?.output?.token;

  // Fetch districts data
  const fetchDistricts = useCallback(async () => {
    if (!token) return;
    
    try {
      const headers = { 'Authorization': token };
      console.log('Fetching districts...');
      
      const response = await api.get('/getDistricts', { headers });
      
      if (response?.data?.results) {
        console.log('Districts loaded:', response.data.results);
        setDistricts(response.data.results);
      } else {
        console.warn('No district data in response:', response);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  }, [token]);

  // Fetch school types data
  const fetchSchoolTypes = useCallback(async () => {
    if (!token) return;
    
    try {
      const headers = { 'Authorization': token };
      console.log('Fetching school types...');
      
      const response = await api.get('/getSchoolType', { headers });
      
      if (response?.data?.results) {
        console.log('School types loaded:', response.data.results);
        setSchoolTypes(response.data.results);
      } else {
        console.warn('No school type data in response:', response);
        // Fallback to hardcoded values
        setSchoolTypes([
          { id: 'MC', name: 'Municipal Corporation' },
          { id: 'NP', name: 'Non-Profit' },
          { id: 'SF', name: 'Self-Financed' },
          { id: 'CB', name: 'Central Board' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching school types:', error);
      // Fallback to hardcoded values on error
      setSchoolTypes([
        { id: 'MC', name: 'Municipal Corporation' },
        { id: 'NP', name: 'Non-Profit' },
        { id: 'SF', name: 'Self-Financed' },
        { id: 'CB', name: 'Central Board' }
      ]);
    }
  }, [token]);

  // Load filter data on component mount
  useEffect(() => {
    const loadFilterData = async () => {
      setFiltersLoading(true);
      try {
        await Promise.all([fetchDistricts(), fetchSchoolTypes()]);
      } catch (error) {
        console.error('Error loading filter data:', error);
      } finally {
        setFiltersLoading(false);
      }
    };

    if (token) {
      loadFilterData();
    }
  }, [token, fetchDistricts, fetchSchoolTypes]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle global search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle filter form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    setSubmitting(true);
    
    // Clean up filters - remove empty values
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    
    console.log('Applying filters:', cleanFilters);
    
    // Apply frontend search filtering along with other filters
    if (searchQuery.trim() !== '') {
      // This will be used by the parent component to filter the data
      const lowercaseQuery = searchQuery.toLowerCase();
      
      // Create a search function that the parent component can use
      const searchFunction = (item) => {
        // Convert all searchable fields to lowercase strings for case-insensitive search
        const searchableFields = [
          item.schoolName,
          item.schoolCode,
          item.district,
          item.schoolType,
          item.address,
          // Add any other fields you want to include in the search
        ].filter(Boolean).map(field => String(field).toLowerCase());
        
        // Check if any field contains the search query
        return searchableFields.some(field => field.includes(lowercaseQuery));
      };
      
      // Include the search function in the filters
      cleanFilters.searchFunction = searchFunction;
    }
    
    onApplyFilters(cleanFilters);
  };

  // Reset all filters
  const handleReset = () => {
    setSubmitting(true);
    setFilters({
      districtId: '',
      schoolCategory: '',
      fromDate: '',
      toDate: '',
      status: ''
    });
    setSearchQuery('');
    onApplyFilters({});
  };

  // Retry loading filter data if it failed
  const handleRetryLoadFilters = async () => {
    setFiltersLoading(true);
    try {
      await Promise.all([fetchDistricts(), fetchSchoolTypes()]);
    } catch (error) {
      console.error('Error reloading filter data:', error);
    } finally {
      setFiltersLoading(false);
    }
  };
  
  // Reset submitting state when forms loading changes
  useEffect(() => {
    if (!isFormsLoading) {
      setSubmitting(false);
    }
  }, [isFormsLoading]);

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 border-b border-gray-200">
      {filtersLoading ? (
        <div className="flex flex-col items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-600">Loading filters...</p>
        </div>
      ) : (
        <>
          {(districts.length === 0 || schoolTypes.length === 0) && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Filter data could not be loaded completely. 
                    <button
                      onClick={handleRetryLoadFilters}
                      className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600 inline-flex items-center"
                      type="button"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Retry
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-wrap gap-4 flex-1">
                {/* Global Search - Frontend implementation */}
                <div className="w-full sm:w-auto flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search schools, codes, districts..."
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      disabled={isFormsLoading || submitting}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                        onClick={() => setSearchQuery('')}
                        disabled={isFormsLoading || submitting}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* District Filter */}
                <div className="w-full sm:w-auto flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                    <select 
                      value={filters.districtId} 
                      onChange={(e) => handleFilterChange('districtId', e.target.value)} 
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      disabled={isFormsLoading || submitting || districts.length === 0}
                    >
                      <option value="">All Districts</option>
                      {districts.map(district => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  {districts.length === 0 && <p className="text-xs text-red-500 mt-1">No districts available</p>}
                </div>
                
                {/* School Type Filter */}
                <div className="w-full sm:w-auto flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Type</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                    <select 
                      value={filters.schoolCategory} 
                      onChange={(e) => handleFilterChange('schoolCategory', e.target.value)} 
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      disabled={isFormsLoading || submitting || schoolTypes.length === 0}
                    >
                      <option value="">All School Types</option>
                      {schoolTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  {schoolTypes.length === 0 && <p className="text-xs text-red-500 mt-1">No school types available</p>}
                </div>
                
                {/* Status Filter */}
                <div className="w-full sm:w-auto flex-1 min-w-[180px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Filter className="h-4 w-4 text-gray-400" />
                    </div>
                    <select 
                      value={filters.status} 
                      onChange={(e) => handleFilterChange('status', e.target.value)} 
                      className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      disabled={isFormsLoading || submitting}
                    >
                      <option value="">All Status</option>
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Allocated">Allocated</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors whitespace-nowrap"
                  disabled={isFormsLoading || submitting}
                >
                  Reset Filters
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center whitespace-nowrap"
                  disabled={isFormsLoading || submitting}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Apply Filters
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default CascadingFilters;