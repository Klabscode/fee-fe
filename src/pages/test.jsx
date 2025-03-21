import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, ArrowRight, ChevronLeft, Filter, Search, Calendar, ChevronDown, ChevronUp, Eye, Edit2, Lock, Unlock, AlertTriangle } from 'lucide-react';
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
  const [showEditRequestModal, setShowEditRequestModal] = useState(false);
  const [currentForm, setCurrentForm] = useState(null);
  const [editReason, setEditReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editRequests, setEditRequests] = useState([]);
  const [sections, setSections] = useState([]);
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

  // Use useCallback to prevent unnecessary re-renders
  const fetchForms = useCallback(async (queryParams = {}) => {
    try {
      setLoading(true);
      const headers = { 'Authorization': token };
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
        // Only perform duplicate filtering if needed
        // This keeps the original API response intact
        setForms(response.data.results);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
    } finally {
      setLoading(false);
    }
  }, [token, userType, loginResponse.output?.data?.id]);
// Add this fetchSections function to FormsPage component
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
useEffect(() => {
  // Check if token exists before attempting any API calls
  if (!token) {
    // If no token, handle it gracefully (e.g., redirect to login or show message)
    console.log('No authentication token found, skipping API calls');
    setLoading(false);
    return;
  }

  // Function to load forms based on current filters
  const loadData = async () => {
    try {
      setLoading(true);
      const queryParams = {};
      if (filters.fromDate) queryParams.fromDate = filters.fromDate;
      if (filters.toDate) queryParams.toDate = filters.toDate;
      if (filters.status) queryParams.status = filters.status;
      
      await fetchForms(queryParams);
      
      // If Admin, also fetch pending edit requests and sections
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

  // Initial data load
  loadData();

  // Set up polling for Admin users to keep data fresh (every 30 seconds)
  let intervalId = null;
  if (userType === 'Admin') {
    intervalId = setInterval(() => {
      loadData();
    }, 30000); // Poll every 30 seconds
  }

  // Clean up interval on unmount
  return () => {
    if (intervalId) clearInterval(intervalId);
  };
  
}, [filters, token, userType, fetchForms, fetchPendingEditRequests, fetchSections]);
  // Focus input in modal after it opens
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
    <div>
      <div className="mb-2 bg-blue-50 p-2 rounded-lg">
        <div className="font-medium">Student Summary</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 mt-1">
          <div className="text-xs py-1">Total Students: <span className="font-medium">{form.studentStrengthIndividual.total || 0}</span></div>
          {form.totalNumberOfRteStudentsIndividual && (
            <div className="text-xs py-1">RTE Students: <span className="font-medium">{form.totalNumberOfRteStudentsIndividual.total || 0}</span></div>
          )}
        </div>
      </div>
      
      <button 
        onClick={(e) => {
          e.stopPropagation();
          toggleRowExpand(form.id);
        }}
        className="text-xs text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 px-2 py-1 rounded-md w-full justify-center sm:w-auto sm:justify-start"
        type="button"
      >
        {expandedRows[form.id] ? (
          <>
            <ChevronUp className="h-3 w-3 mr-1" />
            Hide Class-wise Details
          </>
        ) : (
          <>
            <ChevronDown className="h-3 w-3 mr-1" />
            View Class-wise Details
          </>
        )}
      </button>
      
      {expandedRows[form.id] && (
        <div className="mt-2 border-t border-gray-200 pt-2">
          <div className="col-span-4 font-medium text-xs mb-2 bg-gray-100 p-1 rounded">Student Strength by Class:</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">LKG: {form.studentStrengthIndividual.lkg || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">UKG: {form.studentStrengthIndividual.ukg || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">I: {form.studentStrengthIndividual.one || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">II: {form.studentStrengthIndividual.two || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">III: {form.studentStrengthIndividual.three || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">IV: {form.studentStrengthIndividual.four || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">V: {form.studentStrengthIndividual.five || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">VI: {form.studentStrengthIndividual.six || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">VII: {form.studentStrengthIndividual.seven || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">VIII: {form.studentStrengthIndividual.eight || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">IX: {form.studentStrengthIndividual.nine || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">X: {form.studentStrengthIndividual.ten || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">XI: {form.studentStrengthIndividual.eleven || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">XII: {form.studentStrengthIndividual.twelve || 0}</div>
          </div>
          
          <div className="col-span-4 font-medium text-xs mt-4 mb-2 bg-gray-100 p-1 rounded">RTE Students by Class:</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">LKG: {form.totalNumberOfRteStudentsIndividual.lkg || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">UKG: {form.totalNumberOfRteStudentsIndividual.ukg || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">I: {form.totalNumberOfRteStudentsIndividual.one || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">II: {form.totalNumberOfRteStudentsIndividual.two || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">III: {form.totalNumberOfRteStudentsIndividual.three || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">IV: {form.totalNumberOfRteStudentsIndividual.four || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">V: {form.totalNumberOfRteStudentsIndividual.five || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">VI: {form.totalNumberOfRteStudentsIndividual.six || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">VII: {form.totalNumberOfRteStudentsIndividual.seven || 0}</div>
            <div className="text-xs py-1 px-2 border border-gray-100 rounded">VIII: {form.totalNumberOfRteStudentsIndividual.eight || 0}</div>
          </div>
        </div>
      )}
    </div>
  ) : (
    'N/A'
  )}
</td>
<td className="px-4 py-3 text-sm text-gray-900">
  <div className="mb-2 bg-blue-50 p-2 rounded-lg">
    <span className="font-medium">Fee Summary</span>
    {!expandedRows[form.id] && form.allocateformReference && (
      <div className="mt-1 text-xs grid grid-cols-2 sm:grid-cols-4 gap-x-2 gap-y-1">
        <div>LKG: ₹{form.allocateformReference.currentYearLkgFee || 0}</div>
        <div>I: ₹{form.allocateformReference.currentYearFirstFee || 0}</div>
        <div>UKG: ₹{form.allocateformReference.currentYearUkgFee || 0}</div>
        <div>II: ₹{form.allocateformReference.currentYearSecondFee || 0}</div>
      </div>
    )}
  </div>
  
  <button 
    onClick={(e) => {
      e.stopPropagation();
      toggleRowExpand(form.id);
    }}
    className="text-xs text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 px-2 py-1 rounded-md w-full justify-center sm:w-auto sm:justify-start"
    type="button"
  >
    {expandedRows[form.id] ? (
      <>
        <ChevronUp className="h-3 w-3 mr-1" />
        Hide Complete Fee Details
      </>
    ) : (
      <>
        <ChevronDown className="h-3 w-3 mr-1" />
        View Complete Fee Details
      </>
    )}
  </button>
  
  {expandedRows[form.id] && (
    <div className="mt-2 border-t border-gray-200 pt-2">
      <div className="col-span-4 font-medium text-xs mb-2 bg-gray-100 p-1 rounded">Previous Fees:</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">LKG: ₹{form.previousFeeCommitteeOrderFeeIndividual?.lkg || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">UKG: ₹{form.previousFeeCommitteeOrderFeeIndividual?.ukg || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">I: ₹{form.previousFeeCommitteeOrderFeeIndividual?.one || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">II: ₹{form.previousFeeCommitteeOrderFeeIndividual?.two || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">III: ₹{form.previousFeeCommitteeOrderFeeIndividual?.three || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">IV: ₹{form.previousFeeCommitteeOrderFeeIndividual?.four || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">V: ₹{form.previousFeeCommitteeOrderFeeIndividual?.five || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">VI: ₹{form.previousFeeCommitteeOrderFeeIndividual?.six || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">VII: ₹{form.previousFeeCommitteeOrderFeeIndividual?.seven || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">VIII: ₹{form.previousFeeCommitteeOrderFeeIndividual?.eight || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">IX: ₹{form.previousFeeCommitteeOrderFeeIndividual?.nine || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">X: ₹{form.previousFeeCommitteeOrderFeeIndividual?.ten || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">XI: ₹{form.previousFeeCommitteeOrderFeeIndividual?.eleven || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">XII: ₹{form.previousFeeCommitteeOrderFeeIndividual?.twelve || 0}</div>
      </div>
      
      <div className="col-span-4 font-medium text-xs mt-4 mb-2 bg-gray-100 p-1 rounded">Proposed Fees:</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">LKG: ₹{form.proposedFeeIndividual?.lkg || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">UKG: ₹{form.proposedFeeIndividual?.ukg || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">I: ₹{form.proposedFeeIndividual?.one || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">II: ₹{form.proposedFeeIndividual?.two || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">III: ₹{form.proposedFeeIndividual?.three || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">IV: ₹{form.proposedFeeIndividual?.four || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">V: ₹{form.proposedFeeIndividual?.five || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">VI: ₹{form.proposedFeeIndividual?.six || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">VII: ₹{form.proposedFeeIndividual?.seven || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">VIII: ₹{form.proposedFeeIndividual?.eight || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">IX: ₹{form.proposedFeeIndividual?.nine || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">X: ₹{form.proposedFeeIndividual?.ten || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">XI: ₹{form.proposedFeeIndividual?.eleven || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">XII: ₹{form.proposedFeeIndividual?.twelve || 0}</div>
      </div>
      
      <div className="col-span-4 font-medium text-xs mt-4 mb-2 bg-blue-100 p-1 rounded">Fixed Fees (Current Year):</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">LKG: ₹{form.allocateformReference?.currentYearLkgFee || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">UKG: ₹{form.allocateformReference?.currentYearUkgFee || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">I: ₹{form.allocateformReference?.currentYearFirstFee || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">II: ₹{form.allocateformReference?.currentYearSecondFee || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">III: ₹{form.allocateformReference?.currentYearThirdFee || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">IV: ₹{form.allocateformReference?.currentYearFourFee || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">V: ₹{form.allocateformReference?.currentYearFiveFee || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">VI: ₹{form.allocateformReference?.currentYearSixFee || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">VII: ₹{form.allocateformReference?.currentYearSevenFee || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">VIII: ₹{form.allocateformReference?.currentYearEightFee || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">IX: ₹{form.allocateformReference?.currentYearNineFee || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">X: ₹{form.allocateformReference?.currentYearTenFee || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">XI: ₹{form.allocateformReference?.currentYearElevenFee || 0}</div>
        <div className="text-xs py-1 px-2 border border-gray-100 rounded">XII: ₹{form.allocateformReference?.currentYearTwelveFee || 0}</div>
      </div>
    </div>
  )}
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
    {form.status === 'Completed' && (
      <div className="flex items-center justify-end space-x-2">
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
      </div>
    )}
    
    {/* Add Reallocate button for Allocated forms */}
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
  </td>
)}
      </tr>
    );
  };

  // Add this modal component to FormsPage
// Add this modal component to FormsPage
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
  // Use a local state for the textarea to ensure smooth typing
  const [localReason, setLocalReason] = useState(editReason);
  
  // Update local state when parent state changes
  useEffect(() => {
    setLocalReason(editReason);
  }, [editReason]);
  
  // Handle the actual submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Update parent state before submitting
    setEditReason(localReason);
    submitEditRequest();
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
        onSubmit={handleSubmit}
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
              autoFocus
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
                    type="button"
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
  </div>
);
};

export default FormsPage;