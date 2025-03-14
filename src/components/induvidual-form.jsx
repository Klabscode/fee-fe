import React, { useState, useEffect} from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import Account4Form from '../pages/account4';

const IndividualFeeCommitteeForm = () => {
  const [districts, setDistricts] = useState([]);
  const [schoolTypes, setSchoolTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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
          // You might want to redirect to login page here
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchInitialData();
  }, []);
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
        studentStrengthAsOnDate: formatDate(formData.strengthAsOnDate), // Add this new field
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
  
      const response = await api.post('/formRegister', formattedData, {

        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        alert('Form submitted successfully!');
        navigate('/home'); // Corrected navigation to home
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

  return (
   
    <form onSubmit={handleSubmit} className="space-y-6">
   
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
        <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg">Submit Form</button>
      </div>
    </form>
  );
}
export default IndividualFeeCommitteeForm;