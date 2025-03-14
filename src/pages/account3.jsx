
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Account3Form = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
  
  const [form, setForm] = useState({
    items: {
      educationalTour: { expenditure: '', allowed: '', reason: '' },
      seminarOrientation: { expenditure: '', allowed: '', reason: '' },
      groupActivities: { expenditure: '', allowed: '', reason: '' },
      medicalExpenses: { expenditure: '', allowed: '', reason: '' },
      teachingTechnology: { expenditure: '', allowed: '', reason: '' },
      coCurricularActivities: { expenditure: '', allowed: '', reason: '' },
      extraCurricularActivities: { expenditure: '', allowed: '', reason: '' }
    }
  });

  const [totals, setTotals] = useState({ expenditure: 0, allowed: 0 });

  // Fetch initial data
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setInitialLoading(true);
        const feeFormId = localStorage.getItem('feeFormId');
        const allocatedTo = loginResponse?.output?.data?.id;
        
        const headers = {
          'Authorization': loginResponse?.output?.token,
          'Content-Type': 'application/json'
        };

        const response = await api.get('/getAllocatedFormByFeeForm', {
          params: { 
            feeformId: feeFormId,
            allocatedTo: allocatedTo 
          },
          headers
        });

        if (response.data?.results) {
          const data = response.data.results;
          setForm(prev => ({
            ...prev,
            items: {
              educationalTour: {
                expenditure: data.account3EducationTourExpenditure || '',
                allowed: data.account3EducationTourAllowed || '',
                reason: data.account3EducationTourReason || ''
              },
              seminarOrientation: {
                expenditure: data.account3SeminarExpenditure || '',
                allowed: data.account3SeminarAllowed || '',
                reason: data.account3SeminarReason || ''
              },
              groupActivities: {
                expenditure: data.account3GroupActivitiesExpenditure || '',
                allowed: data.account3GroupActivitiesAllowed || '',
                reason: data.account3GroupActivitiesReason || ''
              },
              medicalExpenses: {
                expenditure: data.account3MedicalExpensesExpenditure || '',
                allowed: data.account3MedicalExpensesAllowed || '',
                reason: data.account3MedicalExpensesReason || ''
              },
              teachingTechnology: {
                expenditure: data.account3TeachingThroughTechnologyExpenditure || '',
                allowed: data.account3TeachingThroughTechnologyAllowed || '',
                reason: data.account3TeachingThroughTechnologyReason || ''
              },
              coCurricularActivities: {
                expenditure: data.account3CoCurricularExpenditure || '',
                allowed: data.account3CoCurricularAllowed || '',
                reason: data.account3CoCurricularReason || ''
              },
              extraCurricularActivities: {
                expenditure: data.account3ExtraCurricularExpenditure || '',
                allowed: data.account3ExtraCurricularAllowed || '',
                reason: data.account3ExtraCurricularReason || ''
              }
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching saved data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchFormData();
  }, [loginResponse?.output?.token, loginResponse?.output?.data?.id]);

  useEffect(() => {
    const calculateTotals = () => {
      const expenditureTotal = Math.round(
        Object.values(form.items).reduce(
          (sum, item) => sum + (parseFloat(item.expenditure) || 0),
          0
        )
      );
      const allowedTotal = Math.round(
        Object.values(form.items).reduce(
          (sum, item) => sum + (parseFloat(item.allowed) || 0),
          0
        )
      );
      return { expenditure: expenditureTotal, allowed: allowedTotal };
    };
  
    // Calculate totals
    const calculatedTotals = calculateTotals();
    
    // Store in localStorage
    localStorage.setItem('account3TotalExpenditure', calculatedTotals.expenditure.toString());
    localStorage.setItem('account3TotalAllowed', calculatedTotals.allowed.toString());
    
    // Update totals state
    setTotals(calculatedTotals);
  }, [form]);

  const handleChange = (field, column, value) => {
    // For number inputs (expenditure and allowed), prevent negative values
    if ((column === 'expenditure' || column === 'allowed') && value < 0) {
      value = 0;
    }
    
    setForm(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [field]: {
          ...prev.items[field],
          [column]: value
        }
      }
    }));
  };
  const transformFormData = () => ({
    account3EducationTourExpenditure: parseFloat(form.items.educationalTour.expenditure) || 0,
    account3EducationTourAllowed: parseFloat(form.items.educationalTour.allowed) || 0,
    account3EducationTourReason: form.items.educationalTour.reason || '',
    account3SeminarExpenditure: parseFloat(form.items.seminarOrientation.expenditure) || 0,
    account3SeminarAllowed: parseFloat(form.items.seminarOrientation.allowed) || 0,
    account3SeminarReason: form.items.seminarOrientation.reason || '',
    account3GroupActivitiesExpenditure: parseFloat(form.items.groupActivities.expenditure) || 0,
    account3GroupActivitiesAllowed: parseFloat(form.items.groupActivities.allowed) || 0,
    account3GroupActivitiesReason: form.items.groupActivities.reason || '',
    account3MedicalExpensesExpenditure: parseFloat(form.items.medicalExpenses.expenditure) || 0,
    account3MedicalExpensesAllowed: parseFloat(form.items.medicalExpenses.allowed) || 0,
    account3MedicalExpensesReason: form.items.medicalExpenses.reason || '',
    account3TeachingThroughTechnologyExpenditure: parseFloat(form.items.teachingTechnology.expenditure) || 0,
    account3TeachingThroughTechnologyAllowed: parseFloat(form.items.teachingTechnology.allowed) || 0,
    account3TeachingThroughTechnologyReason: form.items.teachingTechnology.reason || '',
    account3CoCurricularExpenditure: parseFloat(form.items.coCurricularActivities.expenditure) || 0,
    account3CoCurricularAllowed: parseFloat(form.items.coCurricularActivities.allowed) || 0,
    account3CoCurricularReason: form.items.coCurricularActivities.reason || '',
    account3ExtraCurricularExpenditure: parseFloat(form.items.extraCurricularActivities.expenditure) || 0,
    account3ExtraCurricularAllowed: parseFloat(form.items.extraCurricularActivities.allowed) || 0,
    account3ExtraCurricularReason: form.items.extraCurricularActivities.reason || '',
    account3TotalExpenditure: totals.expenditure,
    account3TotalAllowed: totals.allowed,
    account3: "Completed"
  });
  const handleNext = async () => {
    try {
      setLoading(true);
      const transformedData = transformFormData();
      const feeFormId = localStorage.getItem('feeFormId');
      const allocatedTo = loginResponse?.output?.data?.id;
      
      const headers = {
        'Authorization': loginResponse?.output?.token,
        'Content-Type': 'application/json'
      };

      await api.put(
        `/editAllocateForm?feeformId=${feeFormId}&allocatedTo=${allocatedTo}`, 
        transformedData,
        { headers }
      );
      
      navigate('/account4');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (field) => {
    const nameMap = {
      educationalTour: 'Educational Tour only for students',
      seminarOrientation: 'Seminar or orientation programme for students',
      groupActivities: 'Group Activities (NCC/NSS/Scouts/JRC/RS) and camps',
      medicalExpenses: 'Medical Expenses',
      teachingTechnology: 'Teaching through Technology (Smart class or any other modern technology)',
      coCurricularActivities: 'Co-Curricular Activities connected with curriculum to all',
      extraCurricularActivities: 'Extra-Curricular Activities for all'
    };
    return nameMap[field] || field;
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h1 className="ml-4 text-lg font-semibold text-gray-900">Account III - Expenses on Specific Purposes</h1>
            </div>
          </div>

          <div className="p-6">
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
                  {Object.entries(form.items).map(([field, values]) => (
                    <tr key={field}>
                      <td className="border border-gray-300 px-4 py-2">
                        {getDisplayName(field)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          value={values.expenditure}
                          onChange={(e) => handleChange(field, 'expenditure', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md border-gray-300"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="number"
                          value={values.allowed}
                          onChange={(e) => handleChange(field, 'allowed', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md border-gray-300"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <textarea
                          value={values.reason}
                          onChange={(e) => handleChange(field, 'reason', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md border-gray-300 min-h-[60px] resize-y"
                          rows={2}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td className="border border-gray-300 px-4 py-2">Total</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {totals.expenditure.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {totals.allowed.toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              >
                {loading ? 'Saving...' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account3Form;
