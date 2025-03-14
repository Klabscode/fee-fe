import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const FeeCommitteeForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    district: '',
    schoolType: '',
    udiseCode: '',
    schoolName: '',
    address: '',
    locality: '',
    correspondentDetails: '',
    emailId: '',
    classesFunctioning: '',
    studentStrengthMultiple: {
      lkgAndUkg: '',
      oneToFive: '',
      sixToEight: '',
      nineToTen: '',
      elevenToTwelve: '',
      total: ''
    },
    previousFeeValidityYear: {
      from: '',
      to: ''
    },
    totalNumberOfRteStudentsMultiple: {
      lkgAndUkg: '',
      oneToFive: '',
      sixToEight: '',
      nineToTen: '',
      elevenToTwelve: '',
      total: ''
    },
    rteAmountSanctionedMultiple: {
      lkgAndUkg: '',
      oneToFive: '',
      sixToEight: ''
    },
    previousFeeCommitteeOrderFeeMultiple: {
      lkgAndUkg: '',
      oneToFive: '',
      sixToEight: '',
      nineToTen: '',
      elevenToTwelve: ''
    },
    proposedFeeMultiple: {
      lkgAndUkg: '',
      oneToFive: '',
      sixToEight: '',
      nineToTen: '',
      elevenToTwelve: ''
    },
    authorisedPerson: '',
    mobileNumber: '',
    mobileNumber2: '',
    individualOrMultiple: 'Multiple'
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
        let token;
        if (loginResponse?.output?.token) {
          token = loginResponse.output.token;
        }
        if (!token) {
          throw new Error('No authentication token found');
        }
  
        const config = {
          headers: { 'Authorization': token }
        };
  
        const [districtsResponse, schoolTypesResponse] = await Promise.all([
          api.get('/getDistricts', config),
          api.get('/getSchoolType', config)
        ]);
        
        if (districtsResponse.data && districtsResponse.data.results) {
          setDistricts(districtsResponse.data.results);
        }
        
        if (schoolTypesResponse.data && schoolTypesResponse.data.results) {
          setSchoolTypes(schoolTypesResponse.data.results);
        }
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rteAmountTotal, setRteAmountTotal] = useState('0');
  const [previousFeeTotal, setPreviousFeeTotal] = useState('0');
  const [proposedFeeTotal, setProposedFeeTotal] = useState('0');
  const [districts, setDistricts] = useState([]);
  const [schoolTypes, setSchoolTypes] = useState([]);
  const navigate = useNavigate();
  const calculateTotal = (values) => {
    return Object.values(values).reduce((sum, val) => {
      const num = parseFloat(val) || 0;
      return sum + num;
    }, 0);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/getUserNamesByUserType', {
          params: { userType: 'Section' }
        });
        if (response.data && response.data.results) {
          setUsers(response.data.results);
        }
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const total = calculateTotal({
      lkgAndUkg: formData.studentStrengthMultiple.lkgAndUkg,
      oneToFive: formData.studentStrengthMultiple.oneToFive,
      sixToEight: formData.studentStrengthMultiple.sixToEight,
      nineToTen: formData.studentStrengthMultiple.nineToTen,
      elevenToTwelve: formData.studentStrengthMultiple.elevenToTwelve
    });
    setFormData(prev => ({
      ...prev,
      studentStrengthMultiple: {
        ...prev.studentStrengthMultiple,
        total: total.toString()
      }
    }));
  }, [
    formData.studentStrengthMultiple.lkgAndUkg,
    formData.studentStrengthMultiple.oneToFive,
    formData.studentStrengthMultiple.sixToEight,
    formData.studentStrengthMultiple.nineToTen,
    formData.studentStrengthMultiple.elevenToTwelve
  ]);
  
  useEffect(() => {
    const total = calculateTotal({
      lkgAndUkg: formData.totalNumberOfRteStudentsMultiple.lkgAndUkg,
      oneToFive: formData.totalNumberOfRteStudentsMultiple.oneToFive,
      sixToEight: formData.totalNumberOfRteStudentsMultiple.sixToEight
    });
    setFormData(prev => ({
      ...prev,
      totalNumberOfRteStudentsMultiple: {
        ...prev.totalNumberOfRteStudentsMultiple,
        total: total.toString()
      }
    }));
  }, [
    formData.totalNumberOfRteStudentsMultiple.lkgAndUkg,
    formData.totalNumberOfRteStudentsMultiple.oneToFive,
    formData.totalNumberOfRteStudentsMultiple.sixToEight
  ]);
  
  useEffect(() => {
    const total = calculateTotal({
      lkgAndUkg: formData.rteAmountSanctionedMultiple.lkgAndUkg,
      oneToFive: formData.rteAmountSanctionedMultiple.oneToFive,
      sixToEight: formData.rteAmountSanctionedMultiple.sixToEight
    });
    setRteAmountTotal(total.toString());
  }, [formData.rteAmountSanctionedMultiple]);
  
  useEffect(() => {
    const total = calculateTotal(formData.previousFeeCommitteeOrderFeeMultiple);
    setPreviousFeeTotal(total.toString());
  }, [formData.previousFeeCommitteeOrderFeeMultiple]);
  
  useEffect(() => {
    const total = calculateTotal(formData.proposedFeeMultiple);
    setProposedFeeTotal(total.toString());
  }, [formData.proposedFeeMultiple]);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
      let token = loginResponse?.output?.token;
      if (!token) {
        alert('Unable to authenticate. Please try logging in again.');
        return;
      }
  
      const rteAmountSanctionedTotal = calculateTotal(formData.rteAmountSanctionedMultiple);
      const previousFeeCommitteeOrderFeeTotal = calculateTotal(formData.previousFeeCommitteeOrderFeeMultiple);
      const proposedFeeTotal = calculateTotal(formData.proposedFeeMultiple);
  
      const formattedData = {
        formDate: formatDate(formData.date),
        districtId: parseInt(formData.district), // This will send the selected district ID
        schoolTypeId: formData.schoolType, // This will send the selected school type ID
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
        mobileNumber2: null,
       
        individualOrMultiple: formData.individualOrMultiple,
        studentStrengthMultiple: formData.studentStrengthMultiple,
        totalNumberOfRteStudentsMultiple: formData.totalNumberOfRteStudentsMultiple,
        rteAmountSanctionedMultiple: {
          lkgAndUkg: formData.rteAmountSanctionedMultiple.lkgAndUkg,
          oneToFive: formData.rteAmountSanctionedMultiple.oneToFive,
          sixToEight: formData.rteAmountSanctionedMultiple.sixToEight,
          total: rteAmountSanctionedTotal
        },
        previousFeeCommitteeOrderFeeMultiple: {
          lkgAndUkg: formData.previousFeeCommitteeOrderFeeMultiple.lkgAndUkg,
          oneToFive: formData.previousFeeCommitteeOrderFeeMultiple.oneToFive,
          sixToEight: formData.previousFeeCommitteeOrderFeeMultiple.sixToEight,
          nineToTen: formData.previousFeeCommitteeOrderFeeMultiple.nineToTen,
          elevenToTwelve: formData.previousFeeCommitteeOrderFeeMultiple.elevenToTwelve,
          total: previousFeeCommitteeOrderFeeTotal
        },
        previousFeeTotal: previousFeeCommitteeOrderFeeTotal,
        proposedFeeMultiple: {
          ...formData.proposedFeeMultiple,
          total: proposedFeeTotal
        }
      };
  
      console.log('Formatted Data:', formattedData);
  
      const response = await api.post('/formRegister', formattedData, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 200) {
        alert('Form submitted successfully!');
        navigate('/allocate'); // Assuming '/allocate' is the route where AllocationForm is rendered
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response) {
        alert(`Failed to submit form: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        alert('No response received from server. Please try again.');
      } else {
        alert('Error setting up the request. Please try again.');
      }
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
          <select
            value={formData.district}
            onChange={(e) => setFormData({...formData, district: e.target.value})}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School Type</label>
          <select
            value={formData.schoolType}
            onChange={(e) => setFormData({...formData, schoolType: e.target.value})}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">Select School Type</option>
            {schoolTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">UDISE CODE</label>
          <input
            type="text"
            value={formData.udiseCode}
            onChange={(e) => setFormData({...formData, udiseCode: e.target.value})}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">SCHOOL NAME</label>
          <input
            type="text"
            value={formData.schoolName}
            onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">ADDRESS</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LOCALITY</label>
            <select
              value={formData.locality}
              onChange={(e) => setFormData({...formData, locality: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Select</option>
              <option value="Town">Town</option>
              <option value="Municipality">Municipality</option>
              <option value="Corporation">Corporation</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">CORRESPONDENT / PRINCIPAL NAME & CONTACT NUMBER</label>
            <input
              type="text"
              value={formData.correspondentDetails}
              onChange={(e) => setFormData({...formData, correspondentDetails: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">EMAIL ID</label>
            <input
              type="email"
              value={formData.emailId}
              onChange={(e) => setFormData({...formData, emailId: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">CLASSES FUNCTIONING</label>
            <input
              type="text"
              value={formData.classesFunctioning}
              onChange={(e) => setFormData({...formData, classesFunctioning: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="md:col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-4">STUDENT STRENGTH</label>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">LKG & UKG</label>
      <input
        type="number"
        value={formData.studentStrengthMultiple.lkgAndUkg}
        onChange={(e) => setFormData({
          ...formData,
          studentStrengthMultiple: {
            ...formData.studentStrengthMultiple,
            lkgAndUkg: e.target.value
          }
        })}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">I - V</label>
      <input
        type="number"
        value={formData.studentStrengthMultiple.oneToFive}
        onChange={(e) => setFormData({
          ...formData,
          studentStrengthMultiple: {
            ...formData.studentStrengthMultiple,
            oneToFive: e.target.value
          }
        })}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">VI - VIII</label>
      <input
        type="number"
        value={formData.studentStrengthMultiple.sixToEight}
        onChange={(e) => setFormData({
          ...formData,
          studentStrengthMultiple: {
            ...formData.studentStrengthMultiple,
            sixToEight: e.target.value
          }
        })}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">IX - X</label>
      <input
        type="number"
        value={formData.studentStrengthMultiple.nineToTen}
        onChange={(e) => setFormData({
          ...formData,
          studentStrengthMultiple: {
            ...formData.studentStrengthMultiple,
            nineToTen: e.target.value
          }
        })}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">XI - XII</label>
      <input
        type="number"
        value={formData.studentStrengthMultiple.elevenToTwelve}
        onChange={(e) => setFormData({
          ...formData,
          studentStrengthMultiple: {
            ...formData.studentStrengthMultiple,
            elevenToTwelve: e.target.value
          }
        })}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">TOTAL</label>
      <input
        type="number"
        value={formData.studentStrengthMultiple.total}
        readOnly
        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
      />
    </div>
  </div>
</div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PREVIOUS FEE COMMITTEE ORDER VALIDITY YEAR
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              value={formData.previousFeeValidityYear.from}
              onChange={(e) => setFormData({
                ...formData,
                previousFeeValidityYear: {
                  ...formData.previousFeeValidityYear,
                  from: e.target.value
                }
              })}
              className="w-32 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <span>-</span>
            <input
              type="number"
              value={formData.previousFeeValidityYear.to}
              onChange={(e) => setFormData({
                ...formData,
                previousFeeValidityYear: {
                  ...formData.previousFeeValidityYear,
                  to: e.target.value
                }
              })}
              className="w-32 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="mb-8">
  <label className="block text-sm font-medium text-gray-700 mb-4">TOTAL NO. OF RTE STUDENTS</label>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">LKG & UKG</label>
      <input
        type="number"
        value={formData.totalNumberOfRteStudentsMultiple.lkgAndUkg}
        onChange={(e) => setFormData({
          ...formData,
          totalNumberOfRteStudentsMultiple: {
            ...formData.totalNumberOfRteStudentsMultiple,
            lkgAndUkg: e.target.value
          }
        })}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">I - V</label>
      <input
        type="number"
        value={formData.totalNumberOfRteStudentsMultiple.oneToFive}
        onChange={(e) => setFormData({
          ...formData,
          totalNumberOfRteStudentsMultiple: {
            ...formData.totalNumberOfRteStudentsMultiple,
            oneToFive: e.target.value
          }
        })}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">VI - VIII</label>
      <input
        type="number"
        value={formData.totalNumberOfRteStudentsMultiple.sixToEight}
        onChange={(e) => setFormData({
          ...formData,
          totalNumberOfRteStudentsMultiple: {
            ...formData.totalNumberOfRteStudentsMultiple,
            sixToEight: e.target.value
          }
        })}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">TOTAL</label>
      <input
        type="number"
        value={formData.totalNumberOfRteStudentsMultiple.total}
        readOnly
        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
      />
    </div>
  </div>
</div>

<div className="mb-8">
  <label className="block text-sm font-medium text-gray-700 mb-4">RTE AMOUNT SANCTIONED CLASSWISE</label>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">LKG & UKG</label>
      <input
        type="number"
        value={formData.rteAmountSanctionedMultiple.lkgAndUkg}
        onChange={(e) => setFormData({
          ...formData,
          rteAmountSanctionedMultiple: {
            ...formData.rteAmountSanctionedMultiple,
            lkgAndUkg: e.target.value
          }
        })}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">I - V</label>
      <input
        type="number"
        value={formData.rteAmountSanctionedMultiple.oneToFive}
        onChange={(e) => setFormData({
          ...formData,
          rteAmountSanctionedMultiple: {
            ...formData.rteAmountSanctionedMultiple,
            oneToFive: e.target.value
          }
        })}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">VI - VIII</label>
      <input
        type="number"
        value={formData.rteAmountSanctionedMultiple.sixToEight}
        onChange={(e) => setFormData({
          ...formData,
          rteAmountSanctionedMultiple: {
            ...formData.rteAmountSanctionedMultiple,
            sixToEight: e.target.value
          }
        })}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">TOTAL</label>
      <input
        type="number"
        value={rteAmountTotal}
        readOnly
        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
      />
    </div>
  </div>
</div>
<div className="mb-8">
  <label className="block text-sm font-medium text-gray-700 mb-4">PREVIOUS FEE COMMITTEE ORDER FEE</label>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[
      { label: 'LKG & UKG', key: 'lkgAndUkg' },
      { label: 'I - V', key: 'oneToFive' },
      { label: 'VI - VIII', key: 'sixToEight' },
      { label: 'IX - X', key: 'nineToTen' },
      { label: 'XI - XII', key: 'elevenToTwelve' }
    ].map(({ label, key }) => (
      <div key={key}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <input
          type="number"
          value={formData.previousFeeCommitteeOrderFeeMultiple[key]}
          onChange={(e) => setFormData({
            ...formData,
            previousFeeCommitteeOrderFeeMultiple: {
              ...formData.previousFeeCommitteeOrderFeeMultiple,
              [key]: e.target.value
            }
          })}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>
    ))}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">TOTAL</label>
      <input
        type="number"
        value={previousFeeTotal}
        readOnly
        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
      />
    </div>
  </div>
</div>

<div className="mb-8">
  <label className="block text-sm font-medium text-gray-700 mb-4">PROPOSED FEE</label>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[
      { label: 'LKG & UKG', key: 'lkgAndUkg' },
      { label: 'I - V', key: 'oneToFive' },
      { label: 'VI - VIII', key: 'sixToEight' },
      { label: 'IX - X', key: 'nineToTen' },
      { label: 'XI - XII', key: 'elevenToTwelve' }
    ].map(({ label, key }) => (
      <div key={key}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <input
          type="number"
          value={formData.proposedFeeMultiple[key]}
          onChange={(e) => setFormData({
            ...formData,
            proposedFeeMultiple: {
              ...formData.proposedFeeMultiple,
              [key]: e.target.value
            }
          })}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>
    ))}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">TOTAL</label>
      <input
        type="number"
        value={proposedFeeTotal}
        readOnly
        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50"
      />
    </div>
  </div>
</div>
</div>

   {/* Authorization Section */}
   <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AUTHORISED PERSON NAME (Submitted by) & DESIGNATION
        </label>
        <input
          type="text"
          value={formData.authorisedPerson}
          onChange={(e) => setFormData({...formData, authorisedPerson: e.target.value})}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>
      
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          MOBILE NUMBER
        </label>
        <input
          type="tel"
          value={formData.mobileNumber}
          onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>
    </div>
  </div>

  {/* Submit Button */}
  <div className="flex justify-end">
    <button
      type="submit"
      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg"
    >
      Submit Form
    </button>
  </div>
</form>
  
  );
};

export default FeeCommitteeForm;