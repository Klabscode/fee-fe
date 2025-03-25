import React, { useState, useEffect} from 'react';
import api from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import Account4Form from '../pages/account4';

const IndividualFeeCommitteeForm = ({ formType = 'Individual', initialData = null, formId = null }) => {
  const [districts, setDistricts] = useState([]);
  const [schoolTypes, setSchoolTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    strengthAsOnDate: '',
    date: '',
    udiseCode: '',
    schoolName: '',
    schoolCategory: '',
    address: '',
    locality: '',
    districtId: '',
    schoolTypeId: '',
    correspondentDetails: '',
    emailId: '',
    classesFunctioning: '',
    previousFeeValidityYear: {
      from: '',
      to: ''
    },
    studentStrength: {
      lkg: '',
      ukg: '',
      class1: '',
      class2: '',
      class3: '',
      class4: '',
      class5: '',
      class6: '',
      class7: '',
      class8: '',
      class9: '',
      class10: '',
      class11: '',
      class12: '',
      total: ''
    },
    rteStudents: {
      lkg: '',
      ukg: '',
      class1: '',
      class2: '',
      class3: '',
      class4: '',
      class5: '',
      class6: '',
      class7: '',
      class8: '',
      total: ''
    },
    rteAmount: {
      lkg: '',
      ukg: '',
      class1: '',
      class2: '',
      class3: '',
      class4: '',
      class5: '',
      class6: '',
      class7: '',
      class8: '',
      total: ''
    },
    previousFee: {
      lkg: '',
      ukg: '',
      class1: '',
      class2: '',
      class3: '',
      class4: '',
      class5: '',
      class6: '',
      class7: '',
      class8: '',
      class9: '',
      class10: '',
      class11: '',
      class12: '',
      total: ''
    },
    proposedFee: {
      lkg: '',
      ukg: '',
      class1: '',
      class2: '',
      class3: '',
      class4: '',
      class5: '',
      class6: '',
      class7: '',
      class8: '',
      class9: '',
      class10: '',
      class11: '',
      class12: '',
      total: ''
    },
    authorisedPerson: '',
    mobileNumber: '',
    mobileNumber2: ''
  });

  // Fetch districts and school types on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
        const token = loginResponse?.output?.token;
        
        if (!token) {
          throw new Error('No authentication token found');
        }
  
        const headers = {
          'Authorization': token,
          'Content-Type': 'application/json'
        };
  
        const [districtsResponse, schoolTypesResponse] = await Promise.all([
          api.get('/getDistricts', { headers }),
          api.get('/getSchoolType', { headers })
        ]);
  
        if (districtsResponse.data && districtsResponse.data.results) {
          setDistricts(districtsResponse.data.results);
        }
        
        if (schoolTypesResponse.data && schoolTypesResponse.data.results) {
          setSchoolTypes(schoolTypesResponse.data.results);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError(error.response?.data?.message || 'Failed to fetch data');
        if (error.response?.status === 401) {
          alert('Your session has expired. Please login again.');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchInitialData();
  }, [navigate]);

  // Load form data if initialData is provided or formId is available
  useEffect(() => {
    const loadFormData = async () => {
      setLoading(true);
      try {
        // If initialData is provided directly, use it
        if (initialData) {
          populateFormData(initialData);
          setIsEditMode(true);
          setLoading(false);
          return;
        }
        
        // If formId is provided as prop or in URL params, fetch the data
        const id = formId || params.id;
        if (id) {
          const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
          const token = loginResponse?.output?.token;
          
          if (!token) {
            throw new Error('No authentication token found');
          }
          
          const headers = { 'Authorization': token };
          const response = await api.get(`/getFormById?id=${id}`, { headers });
          
          if (response?.data?.results) {
            populateFormData(response.data.results);
            setIsEditMode(true);
          } else {
            throw new Error('Failed to load form data');
          }
        }
      } catch (error) {
        console.error('Error loading form data:', error);
        setError(error.response?.data?.message || 'Failed to load form data');
        if (error.response?.status === 401) {
          alert('Your session has expired. Please login again.');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    loadFormData();
  }, [initialData, formId, params.id, navigate]);

  // Helper function to populate form data from API response
  const populateFormData = (data) => {
    // Parse JSON fields that are stored as strings
    const studentStrengthIndividual = parseJsonField(data.studentStrengthIndividual);
    const totalNumberOfRteStudentsIndividual = parseJsonField(data.totalNumberOfRteStudentsIndividual);
    const rteAmountSanctionedIndividual = parseJsonField(data.rteAmountSanctionedIndividual);
    const previousFeeCommitteeOrderFeeIndividual = parseJsonField(data.previousFeeCommitteeOrderFeeIndividual);
    const proposedFeeIndividual = parseJsonField(data.proposedFeeIndividual);

    // Format dates for input fields
    const formattedFormDate = formatDateForInput(data.formDate);
    const formattedStrengthAsOnDate = formatDateForInput(data.studentStrengthAsOnDate);

    // Map API data to form structure
    setFormData({
      strengthAsOnDate: formattedStrengthAsOnDate || '',
      date: formattedFormDate || '',
      udiseCode: data.udiseCode || '',
      schoolName: data.schoolName || '',
      schoolCategory: data.schoolCategory || '',
      address: data.address || '',
      locality: data.localityType || '',
      districtId: data.districtId?.toString() || '',
      schoolTypeId: data.schoolTypeId || '',
      correspondentDetails: data.correspondantOrPrincipalName || '',
      emailId: data.email || '',
      classesFunctioning: data.classesFunctioning || '',
      previousFeeValidityYear: {
        from: data.previousFeeCommitteeOrderValidityFromYear?.toString() || '',
        to: data.previousFeeCommitteeOrderValidityToYear?.toString() || ''
      },
      studentStrength: {
        lkg: studentStrengthIndividual.lkg?.toString() || '',
        ukg: studentStrengthIndividual.ukg?.toString() || '',
        class1: studentStrengthIndividual.one?.toString() || '',
        class2: studentStrengthIndividual.two?.toString() || '',
        class3: studentStrengthIndividual.three?.toString() || '',
        class4: studentStrengthIndividual.four?.toString() || '',
        class5: studentStrengthIndividual.five?.toString() || '',
        class6: studentStrengthIndividual.six?.toString() || '',
        class7: studentStrengthIndividual.seven?.toString() || '',
        class8: studentStrengthIndividual.eight?.toString() || '',
        class9: studentStrengthIndividual.nine?.toString() || '',
        class10: studentStrengthIndividual.ten?.toString() || '',
        class11: studentStrengthIndividual.eleven?.toString() || '',
        class12: studentStrengthIndividual.twelve?.toString() || '',
        total: studentStrengthIndividual.total?.toString() || ''
      },
      rteStudents: {
        lkg: totalNumberOfRteStudentsIndividual.lkg?.toString() || '',
        ukg: totalNumberOfRteStudentsIndividual.ukg?.toString() || '',
        class1: totalNumberOfRteStudentsIndividual.one?.toString() || '',
        class2: totalNumberOfRteStudentsIndividual.two?.toString() || '',
        class3: totalNumberOfRteStudentsIndividual.three?.toString() || '',
        class4: totalNumberOfRteStudentsIndividual.four?.toString() || '',
        class5: totalNumberOfRteStudentsIndividual.five?.toString() || '',
        class6: totalNumberOfRteStudentsIndividual.six?.toString() || '',
        class7: totalNumberOfRteStudentsIndividual.seven?.toString() || '',
        class8: totalNumberOfRteStudentsIndividual.eight?.toString() || '',
        total: totalNumberOfRteStudentsIndividual.total?.toString() || ''
      },
      rteAmount: {
        lkg: rteAmountSanctionedIndividual.lkg?.toString() || '',
        ukg: rteAmountSanctionedIndividual.ukg?.toString() || '',
        class1: rteAmountSanctionedIndividual.one?.toString() || '',
        class2: rteAmountSanctionedIndividual.two?.toString() || '',
        class3: rteAmountSanctionedIndividual.three?.toString() || '',
        class4: rteAmountSanctionedIndividual.four?.toString() || '',
        class5: rteAmountSanctionedIndividual.five?.toString() || '',
        class6: rteAmountSanctionedIndividual.six?.toString() || '',
        class7: rteAmountSanctionedIndividual.seven?.toString() || '',
        class8: rteAmountSanctionedIndividual.eight?.toString() || '',
        total: rteAmountSanctionedIndividual.total?.toString() || ''
      },
      previousFee: {
        lkg: previousFeeCommitteeOrderFeeIndividual.lkg?.toString() || '',
        ukg: previousFeeCommitteeOrderFeeIndividual.ukg?.toString() || '',
        class1: previousFeeCommitteeOrderFeeIndividual.one?.toString() || '',
        class2: previousFeeCommitteeOrderFeeIndividual.two?.toString() || '',
        class3: previousFeeCommitteeOrderFeeIndividual.three?.toString() || '',
        class4: previousFeeCommitteeOrderFeeIndividual.four?.toString() || '',
        class5: previousFeeCommitteeOrderFeeIndividual.five?.toString() || '',
        class6: previousFeeCommitteeOrderFeeIndividual.six?.toString() || '',
        class7: previousFeeCommitteeOrderFeeIndividual.seven?.toString() || '',
        class8: previousFeeCommitteeOrderFeeIndividual.eight?.toString() || '',
        class9: previousFeeCommitteeOrderFeeIndividual.nine?.toString() || '',
        class10: previousFeeCommitteeOrderFeeIndividual.ten?.toString() || '',
        class11: previousFeeCommitteeOrderFeeIndividual.eleven?.toString() || '',
        class12: previousFeeCommitteeOrderFeeIndividual.twelve?.toString() || '',
        total: previousFeeCommitteeOrderFeeIndividual.total?.toString() || ''
      },
      proposedFee: {
        lkg: proposedFeeIndividual.lkg?.toString() || '',
        ukg: proposedFeeIndividual.ukg?.toString() || '',
        class1: proposedFeeIndividual.one?.toString() || '',
        class2: proposedFeeIndividual.two?.toString() || '',
        class3: proposedFeeIndividual.three?.toString() || '',
        class4: proposedFeeIndividual.four?.toString() || '',
        class5: proposedFeeIndividual.five?.toString() || '',
        class6: proposedFeeIndividual.six?.toString() || '',
        class7: proposedFeeIndividual.seven?.toString() || '',
        class8: proposedFeeIndividual.eight?.toString() || '',
        class9: proposedFeeIndividual.nine?.toString() || '',
        class10: proposedFeeIndividual.ten?.toString() || '',
        class11: proposedFeeIndividual.eleven?.toString() || '',
        class12: proposedFeeIndividual.twelve?.toString() || '',
        total: proposedFeeIndividual.total?.toString() || ''
      },
      authorisedPerson: data.authorisedPersonName || '',
      mobileNumber: data.mobileNumber1?.toString() || '',
      mobileNumber2: data.mobileNumber2?.toString() || ''
    });
  };

  // Parse JSON field
  const parseJsonField = (jsonString) => {
    if (!jsonString) return {};
    try {
      return typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return {};
    }
  };

  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  const handleChange = (section, field, value) => {
    // Prevent negative numbers for all number inputs
    if (value < 0) value = 0;
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const calculateSectionTotal = (section) => {
    const data = formData[section];
    const total = Object.entries(data)
      .filter(([key]) => key !== 'total')
      .reduce((sum, [_, value]) => sum + (parseInt(value) || 0), 0);
  
    // Only update if the total has changed
    if (total.toString() !== data.total) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          total: total.toString()
        }
      }));
    }
  };
  
  useEffect(() => {
    const debouncedCalculate = setTimeout(() => {
      calculateSectionTotal('studentStrength');
    }, 100);
    return () => clearTimeout(debouncedCalculate);
  }, [formData.studentStrength.lkg, formData.studentStrength.ukg,
      formData.studentStrength.class1, formData.studentStrength.class2,
      formData.studentStrength.class3, formData.studentStrength.class4,
      formData.studentStrength.class5, formData.studentStrength.class6,
      formData.studentStrength.class7, formData.studentStrength.class8,
      formData.studentStrength.class9, formData.studentStrength.class10,
      formData.studentStrength.class11, formData.studentStrength.class12]);
  
  useEffect(() => {
    const debouncedCalculate = setTimeout(() => {
      calculateSectionTotal('rteStudents');
    }, 100);
    return () => clearTimeout(debouncedCalculate);
  }, [formData.rteStudents.lkg, formData.rteStudents.ukg,
      formData.rteStudents.class1, formData.rteStudents.class2,
      formData.rteStudents.class3, formData.rteStudents.class4,
      formData.rteStudents.class5, formData.rteStudents.class6,
      formData.rteStudents.class7, formData.rteStudents.class8]);
  
  useEffect(() => {
    const debouncedCalculate = setTimeout(() => {
      calculateSectionTotal('rteAmount');
    }, 100);
    return () => clearTimeout(debouncedCalculate);
  }, [formData.rteAmount.lkg, formData.rteAmount.ukg,
      formData.rteAmount.class1, formData.rteAmount.class2,
      formData.rteAmount.class3, formData.rteAmount.class4,
      formData.rteAmount.class5, formData.rteAmount.class6,
      formData.rteAmount.class7, formData.rteAmount.class8]);
  
  useEffect(() => {
    const debouncedCalculate = setTimeout(() => {
      calculateSectionTotal('previousFee');
    }, 100);
    return () => clearTimeout(debouncedCalculate);
  }, [formData.previousFee.lkg, formData.previousFee.ukg,
      formData.previousFee.class1, formData.previousFee.class2,
      formData.previousFee.class3, formData.previousFee.class4,
      formData.previousFee.class5, formData.previousFee.class6,
      formData.previousFee.class7, formData.previousFee.class8,
      formData.previousFee.class9, formData.previousFee.class10,
      formData.previousFee.class11, formData.previousFee.class12]);
  
  useEffect(() => {
    const debouncedCalculate = setTimeout(() => {
      calculateSectionTotal('proposedFee');
    }, 100);
    return () => clearTimeout(debouncedCalculate);
  }, [formData.proposedFee.lkg, formData.proposedFee.ukg,
      formData.proposedFee.class1, formData.proposedFee.class2,
      formData.proposedFee.class3, formData.proposedFee.class4,
      formData.proposedFee.class5, formData.proposedFee.class6,
      formData.proposedFee.class7, formData.proposedFee.class8,
      formData.proposedFee.class9, formData.proposedFee.class10,
      formData.proposedFee.class11, formData.proposedFee.class12]);

  const handleSubmissionError = (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        alert('Authentication failed. Please check your login status.');
      } else {
        alert(`Failed to submit form: ${error.response.data?.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      alert('No response received from server. Please try again.');
    } else {
      alert('Error setting up the request. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
      const token = loginResponse?.output?.token;
      
      if (!token) {
        alert('Unable to authenticate. Please try logging in again.');
        return;
      }
  
      const formattedData = {
        studentStrengthAsOnDate: formatDate(formData.strengthAsOnDate),
        formDate: formatDate(formData.date),
        udiseCode: parseInt(formData.udiseCode),
        schoolName: formData.schoolName,
        address: formData.address,
        localityType: formData.locality,
        locality: formData.address,
        correspondantOrPrincipal: "principal",
        correspondantOrPrincipalName: formData.correspondentDetails,
        email: formData.emailId,
        classesFunctioning: formData.classesFunctioning,
        previousFeeCommitteeOrderValidityFromYear: parseInt(formData.previousFeeValidityYear.from),
        previousFeeCommitteeOrderValidityToYear: parseInt(formData.previousFeeValidityYear.to),
        authorisedPersonDesignation: "Principal",
        authorisedPersonName: formData.authorisedPerson,
        mobileNumber1: parseInt(formData.mobileNumber),
        mobileNumber2: parseInt(formData.mobileNumber2) || null,
        allocatedTo: null,
        schoolCategory: formData.schoolCategory,
        individualOrMultiple: "Individual",
        districtId: parseInt(formData.districtId),
        schoolTypeId: formData.schoolTypeId,
        studentStrengthIndividual: {
          total: parseInt(formData.studentStrength.total) || 0,
          lkg: parseInt(formData.studentStrength.lkg) || 0,
          ukg: parseInt(formData.studentStrength.ukg) || 0,
          one: parseInt(formData.studentStrength.class1) || 0,
          two: parseInt(formData.studentStrength.class2) || 0,
          three: parseInt(formData.studentStrength.class3) || 0,
          four: parseInt(formData.studentStrength.class4) || 0,
          five: parseInt(formData.studentStrength.class5) || 0,
          six: parseInt(formData.studentStrength.class6) || 0,
          seven: parseInt(formData.studentStrength.class7) || 0,
          eight: parseInt(formData.studentStrength.class8) || 0,
          nine: parseInt(formData.studentStrength.class9) || 0,
          ten: parseInt(formData.studentStrength.class10) || 0,
          eleven: parseInt(formData.studentStrength.class11) || 0,
          twelve: parseInt(formData.studentStrength.class12) || 0
        },
        totalNumberOfRteStudentsIndividual: {
          total: parseInt(formData.rteStudents.total) || 0,
          lkg: parseInt(formData.rteStudents.lkg) || 0,
          ukg: parseInt(formData.rteStudents.ukg) || 0,
          one: parseInt(formData.rteStudents.class1) || 0,
          two: parseInt(formData.rteStudents.class2) || 0,
          three: parseInt(formData.rteStudents.class3) || 0,
          four: parseInt(formData.rteStudents.class4) || 0,
          five: parseInt(formData.rteStudents.class5) || 0,
          six: parseInt(formData.rteStudents.class6) || 0,
          seven: parseInt(formData.rteStudents.class7) || 0,
          eight: parseInt(formData.rteStudents.class8) || 0
        },
        rteAmountSanctionedIndividual: {
          total: formData.rteAmount.total || null,
          lkg: formData.rteAmount.lkg || null,
          ukg: formData.rteAmount.ukg || null,
          one: formData.rteAmount.class1 || null,
          two: formData.rteAmount.class2 || null,
          three: formData.rteAmount.class3 || null,
          four: formData.rteAmount.class4 || null,
          five: formData.rteAmount.class5 || null,
          six: formData.rteAmount.class6 || null,
          seven: formData.rteAmount.class7 || null,
          eight: formData.rteAmount.class8 || null
        },
        previousFeeCommitteeOrderFeeIndividual: {
          total: null, 
          lkg: parseInt(formData.previousFee.lkg) || 0,
          ukg: parseInt(formData.previousFee.ukg) || 0,
          one: parseInt(formData.previousFee.class1) || 0,
          two: parseInt(formData.previousFee.class2) || 0,
          three: parseInt(formData.previousFee.class3) || 0,
          four: parseInt(formData.previousFee.class4) || 0,
          five: parseInt(formData.previousFee.class5) || 0,
          six: parseInt(formData.previousFee.class6) || 0,
          seven: parseInt(formData.previousFee.class7) || 0,
          eight: parseInt(formData.previousFee.class8) || 0,
          nine: parseInt(formData.previousFee.class9) || 0,
          ten: parseInt(formData.previousFee.class10) || 0,
          eleven: parseInt(formData.previousFee.class11) || 0,
          twelve: parseInt(formData.previousFee.class12) || 0
        },
        proposedFeeIndividual: {
          total: null, 
          lkg: parseInt(formData.proposedFee.lkg) || 0,
          ukg: parseInt(formData.proposedFee.ukg) || 0,
          one: parseInt(formData.proposedFee.class1) || 0,
          two: parseInt(formData.proposedFee.class2) || 0,
          three: parseInt(formData.proposedFee.class3) || 0,
          four: parseInt(formData.proposedFee.class4) || 0,
          five: parseInt(formData.proposedFee.class5) || 0,
          six: parseInt(formData.proposedFee.class6) || 0,
          seven: parseInt(formData.proposedFee.class7) || 0,
          eight: parseInt(formData.proposedFee.class8) || 0,
          nine: parseInt(formData.proposedFee.class9) || 0,
          ten: parseInt(formData.proposedFee.class10) || 0,
          eleven: parseInt(formData.proposedFee.class11) || 0,
          twelve: parseInt(formData.proposedFee.class12) || 0
        }
      };
  
      let response;
      
      if (isEditMode && (initialData || formId || params.id)) {
        // Update existing form
        const id = initialData?.id || formId || params.id;
        const updatePayload = {
          id: id,
          ...formattedData
        };
        
        response = await api.put('/updateForm', updatePayload, {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200) {
          alert('Form updated successfully!');
          navigate('/forms');
        }
      } else {
        // Create new form
        response = await api.post('/formRegister', formattedData, {
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200) {
          alert('Form submitted successfully!');
          navigate('/forms');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      handleSubmissionError(error);
    }
  };

  const renderClassInputs = (section, start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => i + start).map((num) => (
      <div key={num}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Class {num}
        </label>
        <input
          type="number"
          value={formData[section][`class${num}`]}
          onChange={(e) => handleChange(section, `class${num}`, e.target.value)}
          className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Loading form data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
   
    <form onSubmit={handleSubmit} className="space-y-6">
     {/* Form title based on mode */}
<div className="mb-4">
  <h2 className="text-xl font-semibold text-gray-800">
    {isEditMode ? 'Edit Form' : 'New Form Registration'}
  </h2>
  {isEditMode && (
    <p className="text-sm text-gray-500 mt-1">
      Form ID: {initialData?.id || formId || params.id}
    </p>
  )}
</div>

{/* Initial Information */}
<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">DATE</label>
      <input 
        type="date" 
        value={formData.date} 
        onChange={(e) => setFormData({...formData, date: e.target.value})} 
        className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
      <select 
        value={formData.districtId} 
        onChange={(e) => setFormData({...formData, districtId: e.target.value})} 
        className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select District</option>
        {districts.map((district) => (
          <option key={district.id} value={district.id}>{district.name}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">School Type</label>
      <select 
        value={formData.schoolTypeId} 
        onChange={(e) => {
          const selectedType = e.target.value;
          setFormData({
            ...formData, 
            schoolTypeId: selectedType,
            schoolCategory: selectedType  // Set both fields to the same value
          });
        }} 
        className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select School Type</option>
        {schoolTypes.map((type) => (
          <option key={type.id} value={type.id}>{type.name}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">UDISE CODE</label>
      <input 
        type="text" 
        value={formData.udiseCode} 
        onChange={(e) => setFormData({...formData, udiseCode: e.target.value})} 
        className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
</div>

{/* Basic Information */}
<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">SCHOOL NAME</label>
      <input type="text" value={formData.schoolName} onChange={(e) => setFormData({...formData, schoolName: e.target.value})} className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">ADDRESS</label>
      <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} rows={3} className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">LOCALITY</label>
      <select value={formData.locality} onChange={(e) => setFormData({...formData, locality: e.target.value})} className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
        <option value="">Select</option>
        <option value="Village Panchayat">Village Panchayat</option>
        <option value="Town Panchayat">Town Panchayat</option>
        <option value="Municipality">Municipality</option>
        <option value="Corporation">Corporation</option>
        <option value="Greater Chennai">Greater Chennai</option>
      </select>
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">CORRESPONDENT / PRINCIPAL NAME & CONTACT NUMBER</label>
      <input type="text" value={formData.correspondentDetails} onChange={(e) => setFormData({...formData, correspondentDetails: e.target.value})} className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">EMAIL ID</label>
      <input type="email" value={formData.emailId} onChange={(e) => setFormData({...formData, emailId: e.target.value})} className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">CLASSES FUNCTIONING</label>
      <input type="text" value={formData.classesFunctioning} onChange={(e) => setFormData({...formData, classesFunctioning: e.target.value})} className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">PREVIOUS FEE COMMITTEE ORDER VALIDITY YEAR</label>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <input type="number" value={formData.previousFeeValidityYear.from} onChange={(e) => setFormData({...formData, previousFeeValidityYear: {...formData.previousFeeValidityYear, from: e.target.value}})} className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input type="number" value={formData.previousFeeValidityYear.to} onChange={(e) => setFormData({...formData, previousFeeValidityYear: {...formData.previousFeeValidityYear, to: e.target.value}})} className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
        </div>
      </div>
    </div>
  </div>
</div>

{/* Student Strength Section */}
<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
  <div className="flex items-center gap-4 mb-4">
    <h3 className="text-lg font-medium text-gray-900">STUDENT STRENGTH AS ON</h3>
    <input
      type="date"
      value={formData.strengthAsOnDate}
      onChange={(e) => setFormData({...formData, strengthAsOnDate: e.target.value})}
      className="px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">LKG</label>
        <input
          type="number"
          value={formData.studentStrength.lkg}
          onChange={(e) => handleChange('studentStrength', 'lkg', e.target.value)}
          className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">UKG</label>
        <input
          type="number"
          value={formData.studentStrength.ukg}
          onChange={(e) => handleChange('studentStrength', 'ukg', e.target.value)}
          className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {renderClassInputs('studentStrength', 1, 12)}
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">TOTAL</label>
      <input
        type="number"
        value={formData.studentStrength.total}
        readOnly
        className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50"
      />
    </div>
  </div>
</div>

{/* Total number of RTE students section */}
<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
  <h3 className="text-lg font-medium text-gray-900 mb-4">TOTAL NUMBER OF RTE STUDENTS CLASS</h3>
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">LKG</label>
        <input
          type="number"
          value={formData.rteStudents.lkg}
          onChange={(e) => handleChange('rteStudents', 'lkg', e.target.value)}
          className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">UKG</label>
        <input
          type="number"
          value={formData.rteStudents.ukg}
          onChange={(e) => handleChange('rteStudents', 'ukg', e.target.value)}
          className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {renderClassInputs('rteStudents', 1, 8)}
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">TOTAL</label>
      <input
        type="number"
        value={formData.rteStudents.total}
        readOnly
        className="w-full px-3 py-2 rounded border border-gray-200 bg-gray-50"
      />
    </div>
  </div>
</div>

{/* Previous Fee Section */}
<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
  <h3 className="text-lg font-medium text-gray-900 mb-4">FEE DETERMINED IN THE PREVIOUS ORDER</h3>
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">LKG</label>
        <input type="number" value={formData.previousFee.lkg} onChange={(e) => handleChange('previousFee', 'lkg', e.target.value)} className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">UKG</label>
        <input type="number" value={formData.previousFee.ukg} onChange={(e) => handleChange('previousFee', 'ukg', e.target.value)} className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {renderClassInputs('previousFee', 1, 12)}
    </div>
  </div>
</div>

{/* Proposed Fee Section */}
<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
  <h3 className="text-lg font-medium text-gray-900 mb-4">PROPOSED FEE</h3>
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">LKG</label>
        <input type="number" value={formData.proposedFee.lkg} onChange={(e) => handleChange('proposedFee', 'lkg', e.target.value)} className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">UKG</label>
        <input type="number" value={formData.proposedFee.ukg} onChange={(e) => handleChange('proposedFee', 'ukg', e.target.value)} className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {renderClassInputs('proposedFee', 1, 12)}
    </div>
  </div>
</div>

{/* Authorization Section */}
<div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
  <div className="grid grid-cols-1 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">AUTHORISED PERSON NAME (Submitted by) & DESIGNATION</label>
      <input type="text" value={formData.authorisedPerson} onChange={(e) => setFormData({...formData, authorisedPerson: e.target.value})} className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">MOBILE NUMBER</label>
      <input type="tel" value={formData.mobileNumber} onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})} className="w-full px-3 py-2 rounded border border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
    </div>
  </div>
</div>

{/* Submit Button */}
<div className="flex justify-end">
  <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg">
    {isEditMode ? 'Update Form' : 'Submit Form'}
  </button>
</div>
</form>
  );
}

export default IndividualFeeCommitteeForm;