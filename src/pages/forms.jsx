import React, { useState, useEffect } from 'react';
import { FileText, ArrowRight, ChevronLeft, Filter, Search, Calendar, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IndividualFeeCommitteeForm from '../components/induvidual-form';
import api from '../api/api';

const FormsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewType, setViewType] = useState('Individual');
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    status: ''
  });
  const [expandedRows, setExpandedRows] = useState({});

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
  const token = loginResponse?.output?.token;
  const userType = userData.userType;

  useEffect(() => {
    if (token) {
      const queryParams = {};
      if (filters.fromDate) queryParams.fromDate = filters.fromDate;
      if (filters.toDate) queryParams.toDate = filters.toDate;
      if (filters.status) queryParams.status = filters.status;
      fetchForms(queryParams);
    }
  }, [filters, token]);

  const fetchForms = async (queryParams = {}) => {
    try {
      setLoading(true);
      const headers = { 'Authorization': loginResponse?.output?.token };
      let response;
      
      if (userType === 'Section') {
        response = await api.get('/getAllFormsBySection', {
          params: {
            section: loginResponse.output.data.id,
            ...queryParams
          },
          headers
        });
      } else if (userType === 'Report') {
        response = await api.get('/getAllFormsByFilter', {
          params: queryParams,
          headers
        });
      } else {
        response = await api.get('/getAllForms', {
          params: queryParams,
          headers
        });
      }
  
      if (response?.data?.results) {
        setForms(response.data.results);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (form) => {
    if (userType === 'Section') {
      navigate(`/individual-section-form/${form.id}`, { state: { formData: form } });
    } else {
      setShowForm(true);
      setViewType('Individual');
    }
  };

  const toggleRowExpand = (formId) => {
    setExpandedRows(prev => ({
      ...prev,
      [formId]: !prev[formId]
    }));
  };

  const truncateAddress = (address, limit = 40) => {
    if (!address) return 'N/A';
    return address.length > limit ? address.substring(0, limit) + '...' : address;
  };

  const formatClasses = (classes) => {
    return classes || 'N/A';
  };

  const renderFeeStructure = (form) => {
    if (!form.allocateformReference) return 'Not available';
    
    // Group fee data into manageable chunks
    const primaryFees = [
      { label: 'LKG', value: form.allocateformReference.proposedFeeLkg },
      { label: 'UKG', value: form.allocateformReference.proposedFeeUkg },
      { label: '1st', value: form.allocateformReference.proposedFeeFirst },
      { label: '2nd', value: form.allocateformReference.proposedFeeSecond },
    ];
    
    const middleFees = [
      { label: '3rd', value: form.allocateformReference.proposedFeeThird },
      { label: '4th', value: form.allocateformReference.proposedFeeFour },
      { label: '5th', value: form.allocateformReference.proposedFeeFive },
      { label: '6th', value: form.allocateformReference.proposedFeeSix },
    ];
    
    const highFees = [
      { label: '7th', value: form.allocateformReference.proposedFeeSeven },
      { label: '8th', value: form.allocateformReference.proposedFeeEight },
      { label: '9th', value: form.allocateformReference.proposedFeeNine },
      { label: '10th', value: form.allocateformReference.proposedFeeTen },
    ];
    
    const higherFees = [
      { label: '11th', value: form.allocateformReference.proposedFeeEleven },
      { label: '12th', value: form.allocateformReference.proposedFeeTwelve },
    ];

    const renderFeeGroup = (feeGroup) => (
      <div className="grid grid-cols-2 gap-1">
        {feeGroup.map(fee => (
          <div key={fee.label} className="text-xs">
            <span className="font-medium">{fee.label}:</span> ₹{fee.value || 0}
          </div>
        ))}
      </div>
    );

    return (
      <div className="space-y-1">
        <div className="flex flex-col space-y-2">
          {renderFeeGroup(primaryFees)}
          {expandedRows[form.id] && (
            <>
              {renderFeeGroup(middleFees)}
              {renderFeeGroup(highFees)}
              {renderFeeGroup(higherFees)}
            </>
          )}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleRowExpand(form.id);
          }}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-1"
        >
          {expandedRows[form.id] ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              Show More
            </>
          )}
        </button>
      </div>
    );
  };

  const renderTableHeaders = () => {
    if (userType === 'Report') {
      return (
        <tr>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Details</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School ID</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposed Fee</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
      );
    } else if (userType === 'Section') {
      // For Section users - limited information
      return (
        <tr>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School ID</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      );
    }
    // For other users (Admin, Entry)
    return (
      <tr>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Name</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School ID</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classes</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated To</th>
        <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
      </tr>
    );
  };

  const renderTableRow = (form) => {
    if (userType === 'Report') {
      return (
        <tr key={form.id} className="hover:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
            {new Date(form.formDate).toLocaleDateString()}
          </td>
          <td className="px-4 py-3 text-sm text-gray-900">
            <div className="font-medium">{form.schoolName || 'N/A'}</div>
            <div className="text-xs text-gray-500">{form.localityType || 'N/A'}</div>
            <div className="text-xs text-gray-500 max-w-xs truncate" title={form.address}>{truncateAddress(form.locality)}</div>
            <div className="text-xs text-gray-500">Classes: {formatClasses(form.classesFunctioning)}</div>
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
            {form.feeformSchoolId || 'N/A'}
          </td>
          <td className="px-4 py-3 text-sm text-gray-900">
            <div className="font-medium">{form.correspondantOrPrincipalName || 'N/A'}</div>
            <div className="text-xs text-gray-500">{form.mobileNumber1 || 'N/A'}</div>
            <div className="text-xs text-gray-500">{form.email || 'N/A'}</div>
          </td>
          <td className="px-4 py-3 text-sm">
            {form.allocateformReference ? renderFeeStructure(form) : 'Not available'}
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              form.status === 'Completed' ? 'bg-green-100 text-green-800' : 
              form.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
              form.status === 'Allocated' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {form.status || 'Unknown'}
            </span>
          </td>
        </tr>
      );
    } else if (userType === 'Section') {
      // Limited info for Section users
      return (
        <tr key={form.id} className="hover:bg-gray-50">
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{new Date(form.formDate).toLocaleDateString()}</td>
          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{form.feeformSchoolId || 'N/A'}</td>
          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatClasses(form.classesFunctioning)}</td>
          <td className="px-4 py-3 text-sm text-gray-600">
            <div>{form.localityType || 'N/A'}</div>
            <div className="text-xs text-gray-500 max-w-xs truncate" title={form.locality}>{truncateAddress(form.locality, 20)}</div>
          </td>
          <td className="px-4 py-3 whitespace-nowrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              form.status === 'Completed' ? 'bg-green-100 text-green-800' : 
              form.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
              form.status === 'Allocated' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {form.status || 'Unknown'}
            </span>
          </td>
          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
            {form.status && form.status.trim() === 'Completed' ? (
              <span className="text-gray-400 px-3 py-1">Completed</span>
            ) : (
              <button onClick={() => handleEdit(form)} className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                Edit
              </button>
            )}
          </td>
        </tr>
      );
    }
    
    // For other users
    return (
      <tr key={form.id} className="hover:bg-gray-50">
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{new Date(form.formDate).toLocaleDateString()}</td>
        <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
          <div className="font-medium">{form.schoolName || 'N/A'}</div>
          <div className="text-xs text-gray-500">{form.correspondantOrPrincipal || 'N/A'}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{form.feeformSchoolId || 'N/A'}</td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{form.correspondantOrPrincipalName || 'N/A'}</td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
          <div>{form.mobileNumber1 || 'N/A'}</div>
          <div className="text-xs text-gray-500 truncate">{form.email || 'N/A'}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{formatClasses(form.classesFunctioning)}</td>
        <td className="px-4 py-3 text-sm text-gray-600">
          <div>{form.localityType || 'N/A'}</div>
          <div className="text-xs text-gray-500 max-w-xs truncate" title={form.locality}>{truncateAddress(form.locality, 20)}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
          {form.allocatedToSection?.userName || 'Not allocated'}
          {form.allocatedToSection?.userType && (
            <div className="text-xs text-gray-500">{form.allocatedToSection.userType}</div>
          )}
        </td>
        <td className="px-4 py-3 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            form.status === 'Completed' ? 'bg-green-100 text-green-800' : 
            form.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
            form.status === 'Allocated' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {form.status || 'Unknown'}
          </span>
        </td>
      </tr>
    );
  };

  if (userType !== 'Admin' && userType !== 'Section' && userType !== 'Report' && userType !== 'Entry') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl text-gray-700 font-medium">Access Restricted</h2>
          <p className="mt-2 text-gray-600">Only authorized users can access this section.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {!showForm ? (
          <div className="space-y-4">
           {(userType === 'Admin' || userType === 'Entry') && (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
                <div className="flex-grow w-full sm:w-auto">
                  <button onClick={() => setShowForm(true)} className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>New Form</span>
                  </button>
                </div>
              </div>
            )}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="date" 
                        value={filters.fromDate} 
                        onChange={(e) => setFilters(prev => ({...prev, fromDate: e.target.value}))} 
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="h-4 w-4 text-gray-400" />
                      </div>
                      <input 
                        type="date" 
                        value={filters.toDate} 
                        onChange={(e) => setFilters(prev => ({...prev, toDate: e.target.value}))} 
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Filter className="h-4 w-4 text-gray-400" />
                      </div>
                      <select 
                        value={filters.status} 
                        onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))} 
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Allocated">Allocated</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={() => fetchForms({
                        fromDate: filters.fromDate,
                        toDate: filters.toDate,
                        status: filters.status
                      })} 
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading forms...</p>
                  </div>
                ) : forms.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        {renderTableHeaders()}
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {forms.map((form) => renderTableRow(form))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No forms found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button onClick={() => setShowForm(false)} className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Back
                </button>
              </div>
            </div>
            <div className="p-4">
              <IndividualFeeCommitteeForm formType={viewType} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormsPage;