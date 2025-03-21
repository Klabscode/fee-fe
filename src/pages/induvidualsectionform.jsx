
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import Account4Form from './account4';
const IndividualSectionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [totalStrength, setTotalStrength] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
  
  const [form, setForm] = useState({
    schoolName: '',
    address: '',
    email: '',
    sectionA: {
      principal: { expenditure: '', allowed: '', reason: '' },
      teachingStaff: { expenditure: '', allowed: '', reason: '' },
      nonTeachingStaff: { expenditure: '', allowed: '', reason: '' },
      epfContribution: { expenditure: '', allowed: '', reason: '' },
      esi: { expenditure: '', allowed: '', reason: '' },
      earnedLeave: { expenditure: '', allowed: '', reason: '' },
      gratuity: { expenditure: '', allowed: '', reason: '' },
      pension: { expenditure: '', allowed: '', reason: '' },
      retirementPurse: { expenditure: '', allowed: '', reason: '' }
    },
    sectionB: {
      managementContributionToLic: { expenditure: '', allowed: '', reason: '' },
      staffUniform: { expenditure: '', allowed: '', reason: '' },
      occasionalFestivalGifts: { expenditure: '', allowed: '', reason: '' },
      incentiveForGoodResults: { expenditure: '', allowed: '', reason: '' }
    }
  });

  const [totals, setTotals] = useState({
    sectionA: { expenditure: 0, allowed: 0 },
    sectionB: { expenditure: 0, allowed: 0 }
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const headers = { 'Authorization': loginResponse?.output?.token };
        
        // Get basic form data
        const formResponse = await api.get('/getFormById', {
          params: { id },
          headers
        });

        // Get previously filled data if exists
        const allocatedFormResponse = await api.get('/getAllocatedFormByFeeForm', {
          params: { 
            feeformId: id,
            allocatedTo: loginResponse?.output?.data?.id 
          },
          headers
        });

        // Set basic form data
     // Inside fetchFormData function, within the if (formResponse.data?.results) block
     if (formResponse.data?.results) {
      const formData = formResponse.data.results;
      setForm(prev => ({
        ...prev,
        schoolName: formData.schoolName || '',
        address: formData.address || '',
        schoolId: formData.feeformSchoolId || '',
        email: formData.email || ''
      }));

  // Store locality type in localStorage
  localStorage.setItem('localityType', formData.localityType || '');

  // Store total student strength in localStorage
  if (formData.studentStrengthIndividual) {
    try {
      // Parse the JSON string to an object
      const studentStrength = typeof formData.studentStrengthIndividual === 'string' 
        ? JSON.parse(formData.studentStrengthIndividual) 
        : formData.studentStrengthIndividual;
      
      // Now access the total property
      if (studentStrength && studentStrength.total !== undefined) {
        localStorage.setItem('totalStudentStrength', studentStrength.total.toString());
        setTotalStrength(studentStrength.total);
      }
    } catch (error) {
      console.error('Error parsing student strength:', error);
      // Fallback to 0 if parsing fails
      localStorage.setItem('totalStudentStrength', '0');
      setTotalStrength(0);
    }
  }
}      // Set previously filled data if exists
        if (allocatedFormResponse.data?.results) {
          const allocatedData = allocatedFormResponse.data.results;
          setForm(prev => ({
            ...prev,
            sectionA: {
              principal: { 
                expenditure: allocatedData.account1aPrincipalPreviousExpenditure || '',
                allowed: allocatedData.account1aPrincipalAllowed || '',
                reason: allocatedData.account1aPrincipalReason || ''
              },
              teachingStaff: {
                expenditure: allocatedData.account1aTeachingStaffPreviousExpenditure || '',
                allowed: allocatedData.account1aTeachingStaffAllowed || '',
                reason: allocatedData.account1aTeachingStaffReason || ''
              },
              nonTeachingStaff: {
                expenditure: allocatedData.account1aNonTeachingStaffPreviousExpenditure || '',
                allowed: allocatedData.account1aNonTeachingStaffAllowed || '',
                reason: allocatedData.account1aNonTeachingStaffReason || ''
              },
              epfContribution: {
                expenditure: allocatedData.account1aEpfPreviousExpenditure || '',
                allowed: allocatedData.account1aEpfAllowed || '',
                reason: allocatedData.account1aEpfReason || ''
              },
              esi: {
                expenditure: allocatedData.account1aEsiPreviousExpenditure || '',
                allowed: allocatedData.account1aEsiAllowed || '',
                reason: allocatedData.account1aEsiReason || ''
              },
              earnedLeave: {
                expenditure: allocatedData.account1aEarnedLeavePreviousExpenditure || '',
                allowed: allocatedData.account1aEarnedLeaveAllowed || '',
                reason: allocatedData.account1aEarnedLeaveReason || ''
              },
              gratuity: {
                expenditure: allocatedData.account1aGratuityExpenditure || '',
                allowed: allocatedData.account1aGratuityAllowed || '',
                reason: allocatedData.account1aGratuityReason || ''
              },
              pension: {
                expenditure: allocatedData.account1aPensionExpenditure || '',
                allowed: allocatedData.account1aPensionAllowed || '',
                reason: allocatedData.account1aPensionReason || ''
              },
              retirementPurse: {
                expenditure: allocatedData.account1aRetirementPurseExpenditure || '',
                allowed: allocatedData.account1aRetirementPurseAllowed || '',
                reason: allocatedData.account1aRetirementPurseReason || ''
              }
            },
            sectionB: {
              managementContributionToLic: {
                expenditure: allocatedData.account1bLicExpenditure || '',
                allowed: allocatedData.account1bLicAllowed || '',
                reason: allocatedData.account1bLicReason || ''
              },
              staffUniform: {
                expenditure: allocatedData.account1bStaffUniformExpenditure || '',
                allowed: allocatedData.account1bStaffUniformAllowed || '',
                reason: allocatedData.account1bStaffUniformReason || ''
              },
              occasionalFestivalGifts: {
                expenditure: allocatedData.account1bGiftsExpenditure || '',
                allowed: allocatedData.account1bGiftsAllowed || '',
                reason: allocatedData.account1bGiftsReason || ''
              },
              incentiveForGoodResults: {
                expenditure: allocatedData.account1bIncentiveExpenditure || '',
                allowed: allocatedData.account1bIncentiveAllowed || '',
                reason: allocatedData.account1bIncentiveReason || ''
              }
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Failed to fetch form data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFormData();
    }
  }, [id, loginResponse?.output?.token, loginResponse?.output?.data?.id]);useEffect(() => {
    const calculateSectionTotals = (section) => {
      const expenditureTotal = Math.round(
        Object.values(section).reduce(
          (sum, item) => sum + (parseFloat(item.expenditure) || 0),
          0
        )
      );
      const allowedTotal = Math.round(
        Object.values(section).reduce(
          (sum, item) => sum + (parseFloat(item.allowed) || 0),
          0
        )
      );
      return { expenditure: expenditureTotal, allowed: allowedTotal };
    };
  
    const sectionATotals = calculateSectionTotals(form.sectionA);
    const sectionBTotals = calculateSectionTotals(form.sectionB);
  
    // Store individual section totals (now rounded)
    localStorage.setItem('sectionAExpenditure', sectionATotals.expenditure.toString());
    localStorage.setItem('sectionAAllowed', sectionATotals.allowed.toString());
    localStorage.setItem('sectionBExpenditure', sectionBTotals.expenditure.toString());
    localStorage.setItem('sectionBAllowed', sectionBTotals.allowed.toString());
  
    // Calculate and store combined totals (rounded)
    const combinedExpenditure = Math.round(sectionATotals.expenditure + sectionBTotals.expenditure);
    const combinedAllowed = Math.round(sectionATotals.allowed + sectionBTotals.allowed);
    localStorage.setItem('totalExpenditure', combinedExpenditure.toString());
    localStorage.setItem('totalAllowed', combinedAllowed.toString());
  
    // Update totals state
    setTotals({
      sectionA: sectionATotals,
      sectionB: sectionBTotals
    });
  }, [form]);
  const handleChange = (section, field, column, value) => {
    // Prevent negative numbers for expenditure and allowed fields
    if ((column === 'expenditure' || column === 'allowed') && value < 0) {
      value = 0;
    }
  
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          ...prev[section][field],
          [column]: value
        }
      }
    }));
  };
  const handleNext = async () => {
    try {
      setSubmitting(true);
      
      const payload = {
        account1: "Completed",
        feeformId: parseInt(id),
        allocatedTo: loginResponse?.output?.data?.id,
        account1aPrincipalPreviousExpenditure: parseFloat(form.sectionA.principal.expenditure) || 0,
        account1aPrincipalAllowed: parseFloat(form.sectionA.principal.allowed) || 0,
        account1aPrincipalReason: form.sectionA.principal.reason || '',
        account1aTeachingStaffPreviousExpenditure: parseFloat(form.sectionA.teachingStaff.expenditure) || 0,
        account1aTeachingStaffAllowed: parseFloat(form.sectionA.teachingStaff.allowed) || 0,
        account1aTeachingStaffReason: form.sectionA.teachingStaff.reason || '',
        account1aNonTeachingStaffPreviousExpenditure: parseFloat(form.sectionA.nonTeachingStaff.expenditure) || 0,
        account1aNonTeachingStaffAllowed: parseFloat(form.sectionA.nonTeachingStaff.allowed) || 0,
        account1aNonTeachingStaffReason: form.sectionA.nonTeachingStaff.reason || '',
        account1aEpfPreviousExpenditure: parseFloat(form.sectionA.epfContribution.expenditure) || 0,
        account1aEpfAllowed: parseFloat(form.sectionA.epfContribution.allowed) || 0,
        account1aEpfReason: form.sectionA.epfContribution.reason || '',
        account1aEsiPreviousExpenditure: parseFloat(form.sectionA.esi.expenditure) || 0,
        account1aEsiAllowed: parseFloat(form.sectionA.esi.allowed) || 0,
        account1aEsiReason: form.sectionA.esi.reason || '',
        account1aEarnedLeavePreviousExpenditure: parseFloat(form.sectionA.earnedLeave.expenditure) || 0,
        account1aEarnedLeaveAllowed: parseFloat(form.sectionA.earnedLeave.allowed) || 0,
        account1aEarnedLeaveReason: form.sectionA.earnedLeave.reason || '',
        account1aGratuityExpenditure: parseFloat(form.sectionA.gratuity.expenditure) || 0,
        account1aGratuityAllowed: parseFloat(form.sectionA.gratuity.allowed) || 0,
        account1aGratuityReason: form.sectionA.gratuity.reason || '',
        account1aPensionExpenditure: parseFloat(form.sectionA.pension.expenditure) || 0,
        account1aPensionAllowed: parseFloat(form.sectionA.pension.allowed) || 0,
        account1aPensionReason: form.sectionA.pension.reason || '',
        account1aRetirementPurseExpenditure: parseFloat(form.sectionA.retirementPurse.expenditure) || 0,
        account1aRetirementPurseAllowed: parseFloat(form.sectionA.retirementPurse.allowed) || 0,
        account1aRetirementPurseReason: form.sectionA.retirementPurse.reason || '',
        account1aTotalExpenditure: totals.sectionA.expenditure,
        account1aTotalAllowed: totals.sectionA.allowed,
        account1bLicExpenditure: parseFloat(form.sectionB.managementContributionToLic.expenditure) || 0,
        account1bLicAllowed: parseFloat(form.sectionB.managementContributionToLic.allowed) || 0,
        account1bLicReason: form.sectionB.managementContributionToLic.reason || '',
        account1bStaffUniformExpenditure: parseFloat(form.sectionB.staffUniform.expenditure) || 0,
        account1bStaffUniformAllowed: parseFloat(form.sectionB.staffUniform.allowed) || 0,
        account1bStaffUniformReason: form.sectionB.staffUniform.reason || '',
        account1bGiftsExpenditure: parseFloat(form.sectionB.occasionalFestivalGifts.expenditure) || 0,
        account1bGiftsAllowed: parseFloat(form.sectionB.occasionalFestivalGifts.allowed) || 0,
        account1bGiftsReason: form.sectionB.occasionalFestivalGifts.reason || '',
        account1bIncentiveExpenditure: parseFloat(form.sectionB.incentiveForGoodResults.expenditure) || 0,
        account1bIncentiveAllowed: parseFloat(form.sectionB.incentiveForGoodResults.allowed) || 0,
        account1bIncentiveReason: form.sectionB.incentiveForGoodResults.reason || '',
        account1bTotalExpenditure: totals.sectionB.expenditure,
        account1bTotalAllowed: totals.sectionB.allowed
      };

      const headers = {
        'Authorization': loginResponse?.output?.token,
        'Content-Type': 'application/json'
      };

      const response = await api.post('/allocateFormRegister', payload, { headers });
      
      if (response.status === 200) {
        localStorage.setItem('feeFormId', id);
        navigate('/form2');
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Rest of the JSX remains exactly the same as in your original code
  return (

    <div className="min-h-screen bg-gray-50 py-6">
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">School Information</h2>
              <div className="text-sm font-medium text-gray-500">
  School Code: <span className="text-gray-900">{form.schoolId || '-'}</span>
</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">School Name</p>
                <p className="mt-1 text-sm text-gray-900">{form.schoolName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="mt-1 text-sm text-gray-900">{form.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email ID</p>
                <p className="mt-1 text-sm text-gray-900">{form.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Student Strength</p>
                <p className="mt-1 text-sm font-bold text-blue-600">{totalStrength}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back
              </button>
              <h1 className="ml-4 text-lg font-semibold text-gray-900">Account (PART-I)</h1>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">A. Salary and Allowances</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">HEAD OF EXPENDITURE</th>
                      <th className="border border-gray-300 px-4 py-2">Expenditure of the previous  Year</th>
                      <th className="border border-gray-300 px-4 py-2">Allowed</th>
                      <th className="border border-gray-300 px-4 py-2">If not allowed/reduced-Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(form.sectionA).map(([field, values]) => (
                      <tr key={field}>
                        <td className="border border-gray-300 px-4 py-2 capitalize">
                        {field === 'epfContribution' ? 'EPF Contribution' : 
 field === 'esi' ? 'ESI' :
 field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="number"
                            value={values.expenditure}
                            onChange={(e) => handleChange('sectionA', field, 'expenditure', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md border-gray-300"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="number"
                            value={values.allowed}
                            onChange={(e) => handleChange('sectionA', field, 'allowed', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md border-gray-300"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="text"
                            value={values.reason}
                            onChange={(e) => handleChange('sectionA', field, 'reason', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md border-gray-300"
                          />
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="border border-gray-300 px-4 py-2">Total</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {totals.sectionA.expenditure.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {totals.sectionA.allowed.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">B. Other Schemes and Benefits for the Staff</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">HEAD OF EXPENDITURE</th>
                      <th className="border border-gray-300 px-4 py-2">Expenditure of the previous Year</th>
                      <th className="border border-gray-300 px-4 py-2">Allowed</th>
                      <th className="border border-gray-300 px-4 py-2">If not allowed/reduced-Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(form.sectionB).map(([field, values]) => (
                      <tr key={field}>
                        <td className="border border-gray-300 px-4 py-2 capitalize">
                          {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="number"
                            value={values.expenditure}
                            onChange={(e) => handleChange('sectionB', field, 'expenditure', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md border-gray-300"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="number"
                            value={values.allowed}
                            onChange={(e) => handleChange('sectionB', field, 'allowed', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md border-gray-300"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <input
                            type="text"
                            value={values.reason}
                            onChange={(e) => handleChange('sectionB', field, 'reason', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md border-gray-300"
                          />
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td className="border border-gray-300 px-4 py-2">Total</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {totals.sectionB.expenditure.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {totals.sectionB.allowed.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={submitting}
              >
                Back
              </button>
              <button
  onClick={handleNext}
  disabled={submitting}
  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
>
  {submitting ? 'Submitting...' : 'Next'}
</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualSectionForm;
