import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, ArrowRight, ChevronLeft, Filter, Search, Calendar, ChevronDown, ChevronUp, Eye, Edit2, Lock, Unlock, AlertTriangle ,Trash2} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IndividualFeeCommitteeForm from '../components/induvidual-form';
import api from '../api/api';
import CascadingFilters from '../components/CascadingFilters';
import HomePage from './homepage';

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
  const [showEditRequestModal, setShowEditRequestModal] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [editReason, setEditReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editRequests, setEditRequests] = useState([]);
  const [sections, setSections] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
const [detailsType, setDetailsType] = useState(''); // 'fee' or 'student'
const [selectedForm, setSelectedForm] = useState(null);
const [districts, setDistricts] = useState([]);
const [schools, setSchools] = useState([]);
const [showReallocationModal, setShowReallocationModal] = useState(false);
const [formToReallocate, setFormToReallocate] = useState(null);
const [selectedSection, setSelectedSection] = useState('');
const [selectedSectionId, setSelectedSectionId] = useState('');

  const [showEditRequestsModal, setShowEditRequestsModal] = useState(false);
  
  const editReasonRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
  const token = loginResponse?.output?.token;
  const userType = userData.userType;
  const userId = loginResponse?.output?.data?.id;
  const parseJsonField = (jsonString) => {
    if (!jsonString) return {};
    try {
      return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return {};
    }
  };
  const fetchDistricts = useCallback(async () => {
    try {
      console.log('Fetching districts...');
      const headers = { 'Authorization': token };
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
  
  const fetchSchoolTypes = useCallback(async () => {
    try {
      console.log('Fetching school types...');
      const headers = { 'Authorization': token };
      const response = await api.get('/getSchoolType', { headers });
      
      if (response?.data?.results) {
        console.log('School types loaded:', response.data.results);
        setSchools(response.data.results);
      } else {
        console.warn('No school type data in response - using hardcoded values');
        // Fallback to hardcoded values that match your ENUM('MC', 'NP', 'SF','CB')
        setSchools([
          { id: 'MC', name: 'Municipal Corporation' },
          { id: 'NP', name: 'Non-Profit' },
          { id: 'SF', name: 'Self-Financed' },
          { id: 'CB', name: 'Central Board' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching school types:', error);
      // Fallback to hardcoded values
      setSchools([
        { id: 'MC', name: 'Municipal Corporation' },
        { id: 'NP', name: 'Non-Profit' },
        { id: 'SF', name: 'Self-Financed' },
        { id: 'CB', name: 'Central Board' }
      ]);
    }
  }, [token]);
// Add this deduplication logic to the fetchForms callback function 
// right after you receive the response from the API

const fetchForms = useCallback(async (queryParams = {}) => {
  try {
    setLoading(true);
    const headers = { 'Authorization': token };
    let response;
    
    // Extract the filter parameters - make them consistent for all user types
    const { fromDate, toDate, status, districtId, schoolCategory } = queryParams;
    
    if (userType === 'Section') {
      // For Section users, add section ID but still include all other filters
      response = await api.get('/getAllFormsBySection', {
        params: {
          section: loginResponse.output.data.id,
          fromDate,
          toDate,
          status,
          districtId,
          schoolCategory
        },
        headers
      });
    } else if (userType === 'Report') {
      response = await api.get('/getAllFormsByFilter', {
        params: {
          fromDate,
          toDate,
          status,
          districtId,
          schoolCategory
        },
        headers
      });
    } else {
      // For Admin users and others
      response = await api.get('/getAllForms', {
        params: {
          fromDate,
          toDate,
          status,
          districtId,
          schoolCategory
        },
        headers
      });
    }

    if (response?.data?.results) {
      // Deduplicate forms by ID
      const uniqueForms = [];
      const formIds = new Set();
      
      // Filter out duplicate form IDs
      response.data.results.forEach(form => {
        if (!formIds.has(form.id)) {
          formIds.add(form.id);
          uniqueForms.push(form);
        } else {
          console.warn(`Duplicate form with ID ${form.id} found in API response. Ignoring duplicate.`);
        }
      });
      
      console.log(`Original form count: ${response.data.results.length}, Deduplicated count: ${uniqueForms.length}`);
      setForms(uniqueForms);
    }
  } catch (error) {
    console.error('Error fetching forms:', error);
  } finally {
    setLoading(false);
  }
}, [token, userType, loginResponse.output?.data?.id]);
  const handleApplyFilters = (newFilters) => {
    console.log('Applying filters for user type:', userType, newFilters);
    
    // Update local state with the filter values
    setFilters({
      fromDate: newFilters.fromDate || '',
      toDate: newFilters.toDate || '',
      status: newFilters.status || '',
      districtId: newFilters.districtId || '',
      schoolCategory: newFilters.schoolCategory || ''
    });
    
    // Apply filters - use the same parameters for all user types
    fetchForms({
      fromDate: newFilters.fromDate,
      toDate: newFilters.toDate,
      status: newFilters.status,
      districtId: newFilters.districtId,
      schoolCategory: newFilters.schoolCategory
    });
  };
  
const fetchSections = useCallback(async () => {
  if (userType !== 'Admin') return;
  
  try {
    const headers = { 'Authorization': token };
    const response = await api.get('/getUserNamesByUserType', { 
      params: { userType: 'Section' }, 
      headers 
    });
    
    if (response?.data?.results) {
      setSections(response.data.results);
    }
  } catch (error) {
    console.error('Error fetching sections:', error);
  }
}, [token, userType]);

// Add these functions to FormsPage component
const openDetailsModal = (form, type) => {
  setSelectedForm(form);
  setDetailsType(type);
  setShowDetailsModal(true);
};

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

const handleReallocate = (form) => {
  setFormToReallocate(form);
  setSelectedSection('');
  setSelectedSectionId('');
  setShowReallocationModal(true);
};

const submitReallocation = async () => {
  if (!selectedSectionId || !formToReallocate) {
    alert('Please select a section');
    return;
  }

  try {
    setSubmitting(true);
    const headers = { 'Authorization': token };
    
    // Make the API call
    const response = await api.put(`/allocateFeeForm?id=${formToReallocate.id}`, {
      allocatedTo: selectedSectionId
    }, { headers });
    
    // Check if the response is ok (status 200) and has a results property
    if (response?.status === 200) {
      // Find the selected section name for display
      const selectedSectionObj = sections.find(s => s.id === selectedSectionId);
      const sectionName = selectedSectionObj ? selectedSectionObj.userName : 'selected section';
      
      // Update local state immediately with accurate data
      setForms(prevForms => prevForms.map(form => {
        if (form.id === formToReallocate.id) {
          return {
            ...form,
            allocatedTo: selectedSectionId,
            status: 'Allocated', // Explicitly set status to 'Allocated'
            allocatedToSection: {
              ...form.allocatedToSection,
              id: selectedSectionId,
              userName: sectionName,
              userType: 'Section'
            }
          };
        }
        return form;
      }));
      
      // Close modal first for better UX
      setShowReallocationModal(false);
      
      // Show success message
      alert(`Form successfully reallocated to ${sectionName}`);
    } else {
      alert('Failed to reallocate form');
    }
  } catch (error) {
    console.error('Error reallocating form:', error);
    alert(`Error reallocating form`);
  } finally {
    setSubmitting(false);
  }
};

  const fetchPendingEditRequests = useCallback(async () => {
    if (userType !== 'Admin') return;
    
    try {
      const headers = { 'Authorization': token };
      const response = await api.get('/getPendingEditRequests', {
        headers
      });
      
      if (response?.data?.results) {
        setEditRequests(response.data.results);
      }
    } catch (error) {
      console.error('Error fetching edit requests:', error);
    }
  }, [token, userType]);


// This useEffect loads initial data and sets up periodic refreshes for admin users
// This useEffect loads initial data but removes the automatic polling
useEffect(() => {
  if (!token) {
    console.log('No authentication token found, skipping API calls');
    setLoading(false);
    return;
  }

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load district and school data for filters regardless of user type
      await Promise.all([
        fetchDistricts(),
        fetchSchoolTypes()
      ]);
      
      // Load forms with any existing filters
      const queryParams = {};
      if (filters.fromDate) queryParams.fromDate = filters.fromDate;
      if (filters.toDate) queryParams.toDate = filters.toDate;
      if (filters.status) queryParams.status = filters.status;
      if (filters.districtId) queryParams.districtId = filters.districtId;
      if (filters.schoolCategory) queryParams.schoolCategory = filters.schoolCategory;
      
      await fetchForms(queryParams);
      
      // Admin-specific data
      if (userType === 'Admin') {
        await Promise.all([
          fetchPendingEditRequests(),
          fetchSections()
        ]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  loadData();

  // Remove the polling interval to prevent auto-refresh
  // No setInterval needed

  return () => {
    // No cleanup needed since we're not setting up an interval
  };
  
}, [filters, token, userType, fetchForms, fetchPendingEditRequests, fetchSections, fetchDistricts, fetchSchoolTypes]);
  useEffect(() => {
    if (showEditRequestModal && editReasonRef.current) {
      setTimeout(() => {
        editReasonRef.current.focus();
      }, 50);
    }
  }, [showEditRequestModal]);

  const handleEdit = (form) => {
    if (userType === 'Section') {
      navigate(`/individual-section-form/${form.id}`, { state: { formData: form } });
    } else {
      setShowForm(true);
      setViewType('Individual');
    }
  };

  const handleRequestEdit = (form) => {
    setCurrentForm(form);
    setEditReason('');
    setShowEditRequestModal(true);
  };

  const submitEditRequest = async (e) => {
    // Prevent default form submission
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (!editReason.trim()) {
      alert('Please provide a reason for the edit request');
      return;
    }
  
    try {
      setSubmitting(true);
      const headers = { 'Authorization': token };
      
      // Make the API call first
      const response = await api.post('/requestFormEdit', {
        formId: currentForm.id,
        reason: editReason,
        userId: userId
      }, { headers });
      
      // Check if the response was successful (HTTP 200)
      if (response?.status === 200) {
        // Create a copy of the form to update local state
        const updatedForm = {
          ...currentForm,
          editRequestStatus: 'Requested',
          editRequestDate: new Date().toISOString(),
          editRequestReason: editReason
        };
        
        // Update local state
        setForms(prevForms => 
          prevForms.map(form => form.id === currentForm.id ? updatedForm : form)
        );
        
        // Close modal
        setShowEditRequestModal(false);
        
        // Show success message
        alert('Edit request submitted successfully');
      } else {
        alert('Failed to submit edit request');
      }
    } catch (error) {
      console.error('Error submitting edit request:', error);
      alert(`Error submitting edit request`);
    } finally {
      setSubmitting(false);
    }
  };
  const handleProcessEditRequest = async (formId, action) => {
    try {
      setSubmitting(true);
      const headers = { 'Authorization': token };
      
      // Make the API call first
      const response = await api.post('/processEditRequest', {
        formId,
        action
      }, { headers });
      
      // Check if the response was successful (HTTP 200)
      if (response?.status === 200) {
        // If successful, update local state
        
        // Update the editRequests list
        setEditRequests(prevRequests => 
          prevRequests.filter(request => request.id !== formId)
        );
        
        // Update the form's status in the main forms list
        setForms(prevForms => prevForms.map(form => {
          if (form.id === formId) {
            return {
              ...form,
              editRequestStatus: action === 'approve' ? 'Approved' : 'Rejected'
            };
          }
          return form;
        }));
        
        // Show success message (only if viewing in modal)
        if (showEditRequestsModal) {
          alert(`Edit request ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        }
      } else {
        alert(`Failed to ${action} edit request`);
      }
    } catch (error) {
      console.error(`Error ${action}ing edit request:`, error);
      alert(`Error ${action}ing edit request`);
    } finally {
      setSubmitting(false);
    }
  };
  

  const handleFreezeForm = async (formId) => {
    if (!window.confirm('Are you sure you want to freeze this form? This will prevent any future edit requests.')) {
      return;
    }
  
    try {
      setSubmitting(true);
      const headers = { 'Authorization': token };
      
      // Make the API call
      const response = await api.post('/freezeForm', {
        formId
      }, { headers });
      
      // Check if the response was successful (HTTP 200)
      if (response?.status === 200) {
        // Update local state immediately
        setForms(prevForms => prevForms.map(form => {
          if (form.id === formId) {
            return {
              ...form,
              isFrozen: true,
              editRequestStatus: 'None',
              editRequestReason: null,
              editRequestDate: null
            };
          }
          return form;
        }));
        
        // Show success message
        alert('Form frozen successfully');
      } else {
        alert('Failed to freeze form');
      }
    } catch (error) {
      console.error('Error freezing form:', error);
      alert(`Error freezing form`);
    } finally {
      setSubmitting(false);
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
          type="button"
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

  // Helper to render edit request status badge
  const renderEditRequestBadge = (form) => {
    if (!form.editRequestStatus || form.editRequestStatus === 'None') return null;
    
    let badgeClass = '';
    let badgeText = form.editRequestStatus;
    
    switch (form.editRequestStatus) {
      case 'Requested':
        badgeClass = 'bg-yellow-100 text-yellow-800';
        badgeText = 'Edit Requested';
        break;
      case 'Approved':
        badgeClass = 'bg-blue-100 text-blue-800';
        badgeText = 'Edit Approved';
        break;
      case 'Rejected':
        badgeClass = 'bg-red-100 text-red-800';
        badgeText = 'Edit Rejected';
        break;
      default:
        return null;
    }
    
    return (
      <span className={`inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
        {badgeText}
      </span>
    );
  };
// Add this function to the FormsPage component
const handleUnfreezeForm = async (formId) => {
  if (!window.confirm('Are you sure you want to unfreeze this form? This will allow edit requests to be made.')) {
    return;
  }

  try {
    setSubmitting(true);
    const headers = { 'Authorization': token };
    
    // Make the API call
    const response = await api.post('/unfreezeForm', {
      formId
    }, { headers });
    
    // Check if the response was successful (HTTP 200)
    if (response?.status === 200) {
      // Update local state immediately
      setForms(prevForms => prevForms.map(form => {
        if (form.id === formId) {
          return {
            ...form,
            isFrozen: false
          };
        }
        return form;
      }));
      
      // Show success message
      alert('Form unfrozen successfully');
    } else {
      alert('Failed to unfreeze form');
    }
  } catch (error) {
    console.error('Error unfreezing form:', error);
    alert(`Error unfreezing form`);
  } finally {
    setSubmitting(false);
  }
};

  // Helper to render frozen badge
  const renderFrozenBadge = (form) => {
    if (!form.isFrozen) return null;
    
    return (
      <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <Lock className="h-3 w-3 mr-1" />
        Frozen
      </span>
    );
  };

  const renderTableHeaders = () => {
// For the Table Headers - a simpler, cleaner structure
if (userType === 'Report') {
  return (
    <tr>
      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School Details</th>
      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School ID</th>
      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Data</th>
      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Structure</th>
      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
    </tr>
  );
}
    else if (userType === 'Section') {
      // For Section users - limited information plus actions column
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
    // For Admin and Entry users - add an actions column
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
        {userType === 'Admin' && (
          <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        )}
      </tr>
    );
  };

  const renderTableRow = (form) => {
// For the Table Rows - clean, organized data presentation
if (userType === 'Report') {
  // Remove duplicates from the forms data in your state management
  // This is just for the row rendering
  return (
    <tr key={form.id} className="hover:bg-gray-50">
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
        {new Date(form.formDate).toLocaleDateString()}
      </td>
      
      <td className="px-4 py-3 text-sm text-gray-900">
        <div className="font-medium">{form.schoolName || 'N/A'}</div>
        <div className="text-xs text-gray-500">{form.localityType || 'N/A'}</div>
        <div className="text-xs text-gray-500 max-w-xs truncate" title={form.address}>
          {truncateAddress(form.locality)}
        </div>
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
      
      <td className="px-4 py-3 text-sm text-gray-900">
        {form.studentStrengthIndividual ? (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              openDetailsModal(form, 'student');
            }}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center justify-center bg-blue-50 px-2 py-1 rounded-md w-full"
            type="button"
          >
            <Eye className="h-3 w-3 mr-1" />
            View Class-wise Details
          </button>
        ) : (
          'N/A'
        )}
      </td>

      <td className="px-4 py-3 text-sm text-gray-900">
        {form.allocateformReference ? (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              openDetailsModal(form, 'fee');
            }}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center justify-center bg-blue-50 px-2 py-1 rounded-md w-full"
            type="button"
          >
            <Eye className="h-3 w-3 mr-1" />
            View Complete Fee Details
          </button>
        ) : (
          'N/A'
        )}
      </td>
      
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            form.status === 'Completed' ? 'bg-green-100 text-green-800' : 
            form.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
            form.status === 'Allocated' ? 'bg-blue-100 text-blue-800' :
       
            'bg-gray-100 text-gray-800'
          }`}>
            {form.status || 'Unknown'}
          </span>
          {renderEditRequestBadge(form)}
          {renderFrozenBadge(form)}
        </div>
      </td>
    </tr>
  );
}
    else if (userType === 'Section') {
      // Limited info for Section users, but add edit request button for completed forms
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
  <div className="flex items-center">
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      form.status === 'Completed' ? 'bg-green-100 text-green-800' : 
      form.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
      form.status === 'Allocated' ? 'bg-blue-100 text-blue-800' :
      form.status === 'Not Allocated' ? 'bg-gray-100 text-gray-800' :
      'bg-gray-100 text-gray-800'
    }`}>
      {form.status || 'Unknown'}
    </span>
    {renderEditRequestBadge(form)}
    {renderFrozenBadge(form)}
  </div>
</td>
          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
            {form.status && form.status.trim() === 'Completed' ? (
              form.isFrozen ? (
                <span className="text-gray-400 px-3 py-1">Frozen</span>
              ) : form.editRequestStatus === 'Requested' ? (
                <span className="text-yellow-600 px-3 py-1">Edit Requested</span>
              ) : form.editRequestStatus === 'Approved' ? (
                <button 
                  onClick={() => handleEdit(form)} 
                  className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md transition-colors flex items-center"
                  type="button"
                >
                  <Edit2 className="h-4 w-4 mr-1" />
                  Edit Now
                </button>
              ) : (
                <button 
                  onClick={() => handleRequestEdit(form)} 
                  className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors flex items-center"
                  type="button"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Request Edit
                </button>
              )
            ) : (
              <button 
                onClick={() => handleEdit(form)} 
                className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors flex items-center"
                type="button"
              >
                <Eye className="h-4 w-4 mr-1" />
                Edit
              </button>
            )}
          </td>
        </tr>
      );
    }
    
    // For Admin and Entry users
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
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              form.status === 'Completed' ? 'bg-green-100 text-green-800' : 
              form.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
              form.status === 'Allocated' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {form.status || 'Unknown'}
            </span>
            {renderEditRequestBadge(form)}
            {renderFrozenBadge(form)}
          </div>
        </td>


        {userType === 'Admin' && (
  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
    <div className="flex flex-row space-x-2 items-center">
      <button 
        onClick={() => navigate(`/form-view-edit/${form.id}`)}
        className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors flex items-center justify-center"
        type="button"
      >
        <Eye className="h-4 w-4 mr-1" />
        View/Edit
      </button>
      
      <button 
        onClick={() => {
          if(window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
            // Add API call to delete the form
            const deleteForm = async () => {
              try {
                setSubmitting(true);
                const headers = { 'Authorization': token };
                const response = await api.delete(`/deleteForm?id=${form.id}`, { headers });
                
                if (response?.status === 200) {
                  // Remove the form from local state
                  setForms(prevForms => prevForms.filter(f => f.id !== form.id));
                  alert('Form deleted successfully');
                } else {
                  throw new Error('Failed to delete form');
                }
              } catch (error) {
                console.error('Error deleting form:', error);
                alert(`Error deleting form: ${error.message || 'Unknown error'}`);
              } finally {
                setSubmitting(false);
              }
            };
            
            deleteForm();
          }
        }}
        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md transition-colors flex items-center justify-center"
        disabled={submitting}
        type="button"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Delete
      </button>
      
      {form.status === 'Completed' && (
        <>
          {form.editRequestStatus === 'Requested' ? (
            <>
              <button 
                onClick={() => handleProcessEditRequest(form.id, 'approve')}
                className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded-md transition-colors text-xs"
                disabled={submitting}
                type="button"
              >
                Approve
              </button>
              <button 
                onClick={() => handleProcessEditRequest(form.id, 'reject')}
                className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded-md transition-colors text-xs"
                disabled={submitting}
                type="button"
              >
                Reject
              </button>
            </>
          ) : (
            form.isFrozen ? (
              <button 
                onClick={() => handleUnfreezeForm(form.id)}
                className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors flex items-center"
                disabled={submitting}
                type="button"
              >
                <Unlock className="h-4 w-4 mr-1" />
                Unfreeze
              </button>
            ) : (
              <button 
                onClick={() => handleFreezeForm(form.id)}
                className="text-gray-600 hover:text-gray-900 bg-gray-50 px-3 py-1 rounded-md transition-colors flex items-center"
                disabled={submitting}
                type="button"
              >
                <Lock className="h-4 w-4 mr-1" />
                Freeze
              </button>
            )
          )}
        </>
      )}
      
      {form.status === 'Allocated' && (
        <button 
          onClick={() => handleReallocate(form)}
          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded-md transition-colors flex items-center"
          disabled={submitting}
          type="button"
        >
          <ArrowRight className="h-4 w-4 mr-1" />
          Reallocate
        </button>
      )}
    </div>
  </td>
)}
      </tr>
    );
  };
  const DetailsModal = () => {
    if (!showDetailsModal || !selectedForm) return null;
    
    // Parse the JSON string fields
    const parseJsonField = (jsonString) => {
      if (!jsonString) return {};
      try {
        return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      } catch (e) {
        console.error('Error parsing JSON:', e);
        return {};
      }
    };
    
    // Parse all the JSON fields
    const studentStrength = parseJsonField(selectedForm.studentStrengthIndividual);
    const rteStudents = parseJsonField(selectedForm.totalNumberOfRteStudentsIndividual);
    const previousFees = parseJsonField(selectedForm.previousFeeCommitteeOrderFeeIndividual);
    const proposedFees = parseJsonField(selectedForm.proposedFeeIndividual);
    
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowDetailsModal(false);
          }
        }}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              {detailsType === 'fee' ? 'Fee Structure Details' : 'Student Data Details'}
            </h3>
            <button
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setShowDetailsModal(false)}
              type="button"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="overflow-y-auto flex-grow p-4">
            {detailsType === 'fee' ? (
              <div className="space-y-6">
                {/* Previous Fees Section */}
                <div>
                  <div className="font-medium text-sm mb-2 bg-gray-100 p-2 rounded">Previous Fees:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">LKG: ₹{previousFees.lkg || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">UKG: ₹{previousFees.ukg || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">I: ₹{previousFees.one || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">II: ₹{previousFees.two || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">III: ₹{previousFees.three || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">IV: ₹{previousFees.four || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">V: ₹{previousFees.five || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VI: ₹{previousFees.six || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VII: ₹{previousFees.seven || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VIII: ₹{previousFees.eight || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">IX: ₹{previousFees.nine || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">X: ₹{previousFees.ten || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">XI: ₹{previousFees.eleven || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">XII: ₹{previousFees.twelve || 0}</div>
                  </div>
                </div>
                
                {/* Proposed Fees Section */}
                <div>
                  <div className="font-medium text-sm mb-2 bg-gray-100 p-2 rounded">Proposed Fees:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">LKG: ₹{proposedFees.lkg || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">UKG: ₹{proposedFees.ukg || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">I: ₹{proposedFees.one || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">II: ₹{proposedFees.two || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">III: ₹{proposedFees.three || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">IV: ₹{proposedFees.four || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">V: ₹{proposedFees.five || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VI: ₹{proposedFees.six || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VII: ₹{proposedFees.seven || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VIII: ₹{proposedFees.eight || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">IX: ₹{proposedFees.nine || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">X: ₹{proposedFees.ten || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">XI: ₹{proposedFees.eleven || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">XII: ₹{proposedFees.twelve || 0}</div>
                  </div>
                </div>
                
                {/* Fixed Fees Section */}
                <div>
                  <div className="font-medium text-sm mb-2 bg-blue-100 p-2 rounded">Fixed Fees (Current Year):</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">LKG: ₹{selectedForm.allocateformReference?.currentYearLkgFee || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">UKG: ₹{selectedForm.allocateformReference?.currentYearUkgFee || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">I: ₹{selectedForm.allocateformReference?.currentYearFirstFee || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">II: ₹{selectedForm.allocateformReference?.currentYearSecondFee || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">III: ₹{selectedForm.allocateformReference?.currentYearThirdFee || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">IV: ₹{selectedForm.allocateformReference?.currentYearFourFee || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">V: ₹{selectedForm.allocateformReference?.currentYearFiveFee || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VI: ₹{selectedForm.allocateformReference?.currentYearSixFee || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VII: ₹{selectedForm.allocateformReference?.currentYearSevenFee || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VIII: ₹{selectedForm.allocateformReference?.currentYearEightFee || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">IX: ₹{selectedForm.allocateformReference?.currentYearNineFee || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">X: ₹{selectedForm.allocateformReference?.currentYearTenFee || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">XI: ₹{selectedForm.allocateformReference?.currentYearElevenFee || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">XII: ₹{selectedForm.allocateformReference?.currentYearTwelveFee || 0}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Student Strength Section */}
                <div>
                  <div className="font-medium text-sm mb-2 bg-gray-100 p-2 rounded">Student Strength by Class:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">LKG: {studentStrength.lkg || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">UKG: {studentStrength.ukg || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">I: {studentStrength.one || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">II: {studentStrength.two || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">III: {studentStrength.three || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">IV: {studentStrength.four || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">V: {studentStrength.five || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VI: {studentStrength.six || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VII: {studentStrength.seven || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VIII: {studentStrength.eight || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">IX: {studentStrength.nine || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">X: {studentStrength.ten || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">XI: {studentStrength.eleven || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">XII: {studentStrength.twelve || 0}</div>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <strong>Total Students:</strong> {studentStrength.total || 0}
                  </div>
                </div>
                
                {/* RTE Students Section */}
                <div>
                  <div className="font-medium text-sm mb-2 bg-gray-100 p-2 rounded">RTE Students by Class:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">LKG: {rteStudents.lkg || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">UKG: {rteStudents.ukg || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">I: {rteStudents.one || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">II: {rteStudents.two || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">III: {rteStudents.three || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">IV: {rteStudents.four || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">V: {rteStudents.five || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VI: {rteStudents.six || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VII: {rteStudents.seven || 0}</div>
                    <div className="text-sm py-1 px-2 border border-gray-100 rounded">VIII: {rteStudents.eight || 0}</div>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <strong>Total RTE Students:</strong> {rteStudents.total || 0}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              onClick={() => setShowDetailsModal(false)}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
const ReallocationModal = () => {
  if (!formToReallocate) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowReallocationModal(false);
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Reallocate Form</h3>
        </div>
        <div className="px-6 py-4">
          <div className="mb-4">
            <div className="text-sm text-gray-700 mb-4">
              <p>You are about to reallocate the following form:</p>
              <div className="mt-2 bg-gray-50 p-3 rounded-md">
                <p><span className="font-medium">School:</span> {formToReallocate.schoolName}</p>
                <p><span className="font-medium">ID:</span> {formToReallocate.feeformSchoolId}</p>
                <p><span className="font-medium">Currently allocated to:</span> {formToReallocate.allocatedToSection?.userName || 'Not allocated'}</p>
              </div>
            </div>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">Select New Section</label>
            <div className="relative">
              <select
                value={selectedSection}
                onChange={handleSectionChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 text-sm appearance-none bg-white border"
                disabled={submitting}
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
        </div>
        <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            onClick={() => setShowReallocationModal(false)}
            disabled={submitting}
            type="button"
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-white rounded-md transition-colors flex items-center ${
              submitting || !selectedSectionId ? 
              'bg-indigo-400 cursor-not-allowed' : 
              'bg-indigo-600 hover:bg-indigo-700'
            }`}
            disabled={submitting || !selectedSectionId}
            onClick={submitReallocation}
            type="button"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : (
              'Reallocate'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Request Modal - Improved for better input responsiveness
// Replace your current EditRequestModal with this fixed version
const EditRequestModal = () => {
  // Create local state that's independent of parent component's state
  const [localReason, setLocalReason] = useState('');
  
  // Initialize local state when modal opens
  useEffect(() => {
    setLocalReason(editReason);
  }, [showEditRequestModal]);
  
  // Separate useEffect just for handling focus safely
  useEffect(() => {
    // Only try to focus if the modal is shown and the ref exists
    if (showEditRequestModal && editReasonRef.current) {
      // Give DOM time to render fully
      const timer = setTimeout(() => {
        editReasonRef.current?.focus();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [showEditRequestModal]);
  
  // Create a custom submission function that uses the local state
  const handleSubmitRequest = (e) => {
    e.preventDefault();
    
    if (!localReason.trim()) {
      alert('Please provide a reason for the edit request');
      return;
    }
    
    // Set the parent state only once, right before submission
    setEditReason(localReason);
    
    // Then call the API with the local state value directly
    submitEditRequestWithReason(localReason);
  };
  
  // This is a new function that takes the reason as a parameter
  const submitEditRequestWithReason = async (reason) => {
    try {
      setSubmitting(true);
      const headers = { 'Authorization': token };
      
      // Make the API call with the passed reason
      const response = await api.post('/requestFormEdit', {
        formId: currentForm.id,
        reason: reason,
        userId: userId
      }, { headers });
      
      if (response?.status === 200) {
        // Create a copy of the form to update local state
        const updatedForm = {
          ...currentForm,
          editRequestStatus: 'Requested',
          editRequestDate: new Date().toISOString(),
          editRequestReason: reason
        };
        
        // Update local state
        setForms(prevForms => 
          prevForms.map(form => form.id === currentForm.id ? updatedForm : form)
        );
        
        // Close modal
        setShowEditRequestModal(false);
        
        // Show success message
        alert('Edit request submitted successfully');
      } else {
        alert('Failed to submit edit request');
      }
    } catch (error) {
      console.error('Error submitting edit request:', error);
      alert(`Error submitting edit request`);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowEditRequestModal(false);
        }
      }}
    >
      <form 
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onSubmit={handleSubmitRequest}
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Request Form Edit</h3>
        </div>
        <div className="px-6 py-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">You are requesting to edit a completed form. Please provide a reason for your request:</p>
            <textarea
              ref={editReasonRef}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={localReason}
              onChange={(e) => setLocalReason(e.target.value)}
              placeholder="Enter reason for edit request..."
            ></textarea>
          </div>
          <div className="text-sm text-gray-500">
            <p>This request will be reviewed by an admin who will approve or reject it.</p>
          </div>
        </div>
        <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            onClick={() => setShowEditRequestModal(false)}
            disabled={submitting}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            disabled={submitting}
            type="submit"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
// Edit Requests Modal for Admin
const EditRequestsModal = () => (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    onClick={(e) => {
      // Close only when clicking outside the modal
      if (e.target === e.currentTarget) {
        setShowEditRequestsModal(false);
      }
    }}
  >
    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Pending Edit Requests</h3>
        <button
          className="text-gray-400 hover:text-gray-500"
          onClick={() => setShowEditRequestsModal(false)}
          type="button"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="overflow-y-auto flex-grow">
        {editRequests.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No pending edit requests found.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {editRequests.map(request => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{request.schoolName}</div>
                    <div className="text-xs text-gray-500">{request.feeformSchoolId}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(request.editRequestDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={request.editRequestReason}>
                      {request.editRequestReason}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleProcessEditRequest(request.id, 'approve')}
                        className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md transition-colors text-sm"
                        disabled={submitting}
                        type="button"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleProcessEditRequest(request.id, 'reject')}
                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md transition-colors text-sm"
                        disabled={submitting}
                        type="button"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="px-6 py-4 bg-gray-50">
        <button
          className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          onClick={() => setShowEditRequestsModal(false)}
          type="button"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

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
          {/* Admin Notification Badge for Pending Edit Requests */}
          {userType === 'Admin' && editRequests.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    There {editRequests.length === 1 ? 'is' : 'are'} {editRequests.length} pending edit {editRequests.length === 1 ? 'request' : 'requests'}.
                    <button
                      onClick={() => setShowEditRequestsModal(true)}
                      className="ml-2 font-medium text-yellow-700 underline hover:text-yellow-600"
                      type="button"
                    >
                      View requests
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
        
          {(userType === 'Admin' || userType === 'Entry') && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
              <div className="flex-grow w-full sm:w-auto">
                <button 
                  onClick={() => setShowForm(true)} 
                  className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all space-x-2"
                  type="button"
                >
                  <FileText className="w-5 h-5" />
                  <span>New Form</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Replace your current filter form with CascadingFilters component */}
          <CascadingFilters onApplyFilters={handleApplyFilters} isFormsLoading={loading} />
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
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
              <button 
                onClick={() => setShowForm(false)} 
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
                type="button"
              >
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

    {/* Modals */}
    {showEditRequestModal && currentForm && <EditRequestModal />}
    {showEditRequestsModal && <EditRequestsModal />}
    {showReallocationModal && <ReallocationModal />}
    {showDetailsModal && <DetailsModal />}
  </div>
);
}
export default FormsPage;