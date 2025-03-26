import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const AllocationForm = () => {
  const [forms, setForms] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedForms, setSelectedForms] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
        const token = loginResponse?.output?.token;
        if (!token) throw new Error('No authentication token found');
        const headers = { 'Authorization': token, 'Content-Type': 'application/json' };
        const [formsResponse, sectionsResponse] = await Promise.all([
          api.get('/getpendingforms', { headers }),
          api.get('/getUserNamesByUserType', { params: { userType: 'Section' }, headers })
        ]);
        if (formsResponse.data?.results) setForms(formsResponse.data.results);
        if (sectionsResponse.data?.results) setSections(sectionsResponse.data.results);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSectionChange = (e) => {
    const section = sections.find(s => s.userName === e.target.value);
    if (section) {
      setSelectedSection(section.userName);
      setSelectedSectionId(section.id);
    } else {
      setSelectedSection('');
      setSelectedSectionId('');
    }
  };

  const handleFormSelect = (form) => {
    setSelectedForms(prev => {
      // Check if the form is already selected
      const isSelected = prev.some(f => f.id === form.id);
      
      if (isSelected) {
        // Remove it if it's already selected
        return prev.filter(f => f.id !== form.id);
      } else {
        // Add it if it's not selected
        return [...prev, form];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedForms.length === forms.length) {
      // If all forms are already selected, deselect all
      setSelectedForms([]);
    } else {
      // Otherwise, select all forms
      setSelectedForms([...forms]);
    }
  };

  const handleAllocation = async () => {
    if (!selectedSectionId || selectedForms.length === 0) {
      setError('Please select both forms and a section.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
      const token = loginResponse?.output?.token;
      if (!token) {
        setError('Authentication required. Please login again.');
        navigate('/login');
        return;
      }
      
      // Process all allocations
      const allocationPromises = selectedForms.map(form => 
        api.put(`/allocateFeeForm?id=${form.id}`,
          { allocatedTo: selectedSectionId },
          { headers: { 'Authorization': token, 'Content-Type': 'application/json' } }
        )
      );
      
      // Wait for all allocations to complete
      const results = await Promise.allSettled(allocationPromises);
      
      // Check if all allocations were successful
      const allSucceeded = results.every(result => result.status === 'fulfilled' && result.value.status === 200);
      const failedCount = results.filter(result => result.status !== 'fulfilled' || result.value.status !== 200).length;
      
      if (allSucceeded) {
        setSuccess(true);
        setTimeout(() => navigate('/forms'), 2000);
      } else {
        if (failedCount === selectedForms.length) {
          setError('Failed to allocate any forms. Please try again.');
        } else {
          setSuccess(true);
          setError(`Successfully allocated ${selectedForms.length - failedCount} forms, but ${failedCount} forms failed.`);
          // Remove successfully allocated forms from the list
          const successfullyAllocated = results
            .map((result, index) => ({ result, form: selectedForms[index] }))
            .filter(item => item.result.status === 'fulfilled' && item.result.value.status === 200)
            .map(item => item.form.id);
          
          setForms(forms.filter(form => !successfullyAllocated.includes(form.id)));
          setSelectedForms(selectedForms.filter(form => !successfullyAllocated.includes(form.id)));
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to allocate forms.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Form Allocation</h1>
              <div className="flex space-x-3">
                <div className="bg-indigo-50 rounded-lg px-3 py-1">
                  <span className="text-sm font-medium text-indigo-700">Forms: {forms.length}</span>
                </div>
                <div className="bg-green-50 rounded-lg px-3 py-1">
                  <span className="text-sm font-medium text-green-700">Selected: {selectedForms.length}</span>
                </div>
              </div>
            </div>

            {(error || success) && (
              <div className="mb-6">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm text-green-700">Forms allocated successfully! Redirecting...</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Available Forms</h3>
                    <button 
                      onClick={handleSelectAll}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {selectedForms.length === forms.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-12"></th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">School</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">UDISE</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">School ID</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {forms.map((form) => {
                          const isSelected = selectedForms.some(f => f.id === form.id);
                          return (
                            <tr 
                              key={form.id}
                              onClick={() => handleFormSelect(form)}
                              className={`cursor-pointer transition-all duration-200 ${
                                isSelected 
                                  ? 'bg-indigo-50 hover:bg-indigo-100' 
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <td className="px-6 py-4">
                                <div className="flex justify-center">
                                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                    isSelected 
                                      ? 'border-indigo-600 bg-indigo-600' 
                                      : 'border-gray-300'
                                  }`}>
                                    {isSelected && (
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                                        <path d="M3.72 7.96l1.07 1.07 3.43-3.43-1.06-1.07-2.37 2.36-1.06-1.06L2.66 6.9l1.06 1.06z" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">{new Date(form.formDate).toLocaleDateString()}</td>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{form.schoolName}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">{form.udiseCode}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">{form.feeformSchoolId}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-fit">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900">Assign Section</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Section</label>
                        <div className="relative">
                          <select
                            value={selectedSection}
                            onChange={handleSectionChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm appearance-none bg-white"
                            disabled={loading}
                          >
                            <option value="">Choose a section</option>
                            {sections.map((section) => (
                              <option key={section.id} value={section.userName}>{section.userName}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Selection Summary</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Forms Selected</span>
                            <span className="text-sm font-medium text-gray-900">
                              {selectedForms.length > 0 ? selectedForms.length : 'None'}
                            </span>
                          </div>
                          <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
                            <span className="text-sm text-gray-600">Section</span>
                            <span className="text-sm font-medium text-gray-900">{selectedSection || 'Not selected'}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleAllocation}
                        disabled={loading || !selectedSection || selectedForms.length === 0}
                        className={`w-full px-4 py-2 text-sm font-medium rounded-md shadow-sm transition-all duration-200 
                          ${loading || !selectedSection || selectedForms.length === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          }`}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Processing...
                          </span>
                        ) : `Allocate ${selectedForms.length} Form${selectedForms.length !== 1 ? 's' : ''}`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationForm;