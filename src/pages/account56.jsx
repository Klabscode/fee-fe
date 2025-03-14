
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Account5Form = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');

  const [form, setForm] = useState({
    items: {
      purchasingOfFurniture: { expenditure: '', allowed: '', reason: '' },
      equipment: { expenditure: '', allowed: '', reason: '' },
      land: { expenditure: '', allowed: '', reason: '' },
      newConstruction: { expenditure: '', allowed: '', reason: '' },
      modernization: { expenditure: '', allowed: '', reason: '' }
    }
  });

  const [totals, setTotals] = useState({
    expenditure: 0,
    allowed: 0
  });

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
              purchasingOfFurniture: {
                // Update these field names to match the API response
                expenditure: data.account5FurnitureExpenditure || '',
                allowed: data.account5FurnitureAllowed || '',
                reason: data.account5FurnitureReason || ''
              },
              equipment: {
                expenditure: data.account5EquipmentExpenditure || '',
                allowed: data.account5EquipmentAllowed || '',
                reason: data.account5EquipmentReason || ''
              },
              land: {
                expenditure: data.account5LandExpenditure || '',
                allowed: data.account5LandAllowed || '',
                reason: data.account5LandReason || ''
              },
              newConstruction: {
                expenditure: data.account5NewConstructionExpenditure || '',
                allowed: data.account5NewConstructionAllowed || '',
                reason: data.account5NewConstructionReason || ''
              },
              modernization: {
                expenditure: data.account5ModernizationExpenditure || '',
                allowed: data.account5ModernizationAllowed || '',
                reason: data.account5ModernizationReason || ''
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
    
      // Store Account 5 totals
      localStorage.setItem('account5TotalExpenditure', expenditureTotal.toString());
      localStorage.setItem('account5TotalAllowed', allowedTotal.toString());
    
      // Calculate grand total (I-V) using values from localStorage
      const account1Expenditure = Math.round(parseFloat(localStorage.getItem('totalExpenditure')) || 0);
      const account1Allowed = Math.round(parseFloat(localStorage.getItem('totalAllowed')) || 0);
      const account2Expenditure = Math.round(parseFloat(localStorage.getItem('account2TotalExpenditure')) || 0);
      const account3Expenditure = Math.round(parseFloat(localStorage.getItem('account3TotalExpenditure')) || 0);
      const account4Expenditure = Math.round(parseFloat(localStorage.getItem('maintenanceGrandTotalExpenditure')) || 0);
    
      const account2Allowed = Math.round(parseFloat(localStorage.getItem('account2TotalAllowed')) || 0);
      const account3Allowed = Math.round(parseFloat(localStorage.getItem('account3TotalAllowed')) || 0);
      const account4Allowed = Math.round(parseFloat(localStorage.getItem('maintenanceGrandTotalAllowed')) || 0);
    
      const grandTotalExpenditure = Math.round(
        account1Expenditure + account2Expenditure + account3Expenditure + account4Expenditure + expenditureTotal
      );
      const grandTotalAllowed = Math.round(
        account1Allowed + account2Allowed + account3Allowed + account4Allowed + allowedTotal
      );
    
      // Store grand totals (I-V)
      localStorage.setItem('accountsItoVTotalExpenditure', grandTotalExpenditure.toString());
      localStorage.setItem('accountsItoVTotalAllowed', grandTotalAllowed.toString());
    
      return { 
        expenditure: expenditureTotal, 
        allowed: allowedTotal,
        grandTotalExpenditure,
        grandTotalAllowed
      };
    };
  
    const calculatedTotals = calculateTotals();
    setTotals(calculatedTotals);
  }, [form]);

  const handleChange = (field, column, value) => {
    // Prevent negative numbers for expenditure and allowed fields
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

  const handleNext = async () => {
    try {
      setLoading(true);
      const feeFormId = localStorage.getItem('feeFormId');
      const allocatedTo = loginResponse?.output?.data?.id;
      
      const headers = {
        'Authorization': loginResponse?.output?.token,
        'Content-Type': 'application/json'
      };
  
      const payload = {
        account5FurnitureExpenditure: parseFloat(form.items.purchasingOfFurniture.expenditure) || 0,
        account5FurnitureAllowed: parseFloat(form.items.purchasingOfFurniture.allowed) || 0,
        account5FurnitureReason: form.items.purchasingOfFurniture.reason || '',
        account5EquipmentExpenditure: parseFloat(form.items.equipment.expenditure) || 0,
        account5EquipmentAllowed: parseFloat(form.items.equipment.allowed) || 0,
        account5EquipmentReason: form.items.equipment.reason || '',
        account5LandExpenditure: parseFloat(form.items.land.expenditure) || 0,
        account5LandAllowed: parseFloat(form.items.land.allowed) || 0,
        account5LandReason: form.items.land.reason || '',
        account5NewConstructionExpenditure: parseFloat(form.items.newConstruction.expenditure) || 0,
        account5NewConstructionAllowed: parseFloat(form.items.newConstruction.allowed) || 0,
        account5NewConstructionReason: form.items.newConstruction.reason || '',
        account5ModernizationExpenditure: parseFloat(form.items.modernization.expenditure) || 0,
        account5ModernizationAllowed: parseFloat(form.items.modernization.allowed) || 0,
        account5ModernizationReason: form.items.modernization.reason || '',
        account5TotalExpenditure: totals.expenditure,
        account5TotalAllowed: totals.allowed,
        // Add the total accounts 1-5 values
        account1to5TotalExpenditure: totals.grandTotalExpenditure || 0,
        account1to5TotalAllowed: totals.grandTotalAllowed || 0,
        account5: "Completed"
      };
  
      await api.put(
        `/editAllocateForm?feeformId=${feeFormId}&allocatedTo=${allocatedTo}`,
        payload,
        { headers }
      );
      
      navigate('/account6');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
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
              <h1 className="ml-4 text-lg font-semibold text-gray-900">Account V - Infrastructure</h1>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">HEAD OF EXPENDITURE</th>
                    <th className="border border-gray-300 px-4 py-2">Expenditure of the previous  year</th>
                    <th className="border border-gray-300 px-4 py-2">Allowed</th>
                    <th className="border border-gray-300 px-4 py-2">If not allowed/reduced-Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Purchasing of Furniture */}
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Purchasing of Furniture</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={form.items.purchasingOfFurniture.expenditure}
                        onChange={(e) => handleChange('purchasingOfFurniture', 'expenditure', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={form.items.purchasingOfFurniture.allowed}
                        onChange={(e) => handleChange('purchasingOfFurniture', 'allowed', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        value={form.items.purchasingOfFurniture.reason}
                        onChange={(e) => handleChange('purchasingOfFurniture', 'reason', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                  </tr>

                  {/* Equipment */}
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Equipment</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={form.items.equipment.expenditure}
                        onChange={(e) => handleChange('equipment', 'expenditure', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={form.items.equipment.allowed}
                        onChange={(e) => handleChange('equipment', 'allowed', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        value={form.items.equipment.reason}
                        onChange={(e) => handleChange('equipment', 'reason', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                  </tr>

                  {/* Land */}
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Land</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={form.items.land.expenditure}
                        onChange={(e) => handleChange('land', 'expenditure', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={form.items.land.allowed}
                        onChange={(e) => handleChange('land', 'allowed', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        value={form.items.land.reason}
                        onChange={(e) => handleChange('land', 'reason', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                  </tr>

                  {/* New Construction */}
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">New Construction</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={form.items.newConstruction.expenditure}
                        onChange={(e) => handleChange('newConstruction', 'expenditure', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={form.items.newConstruction.allowed}
                        onChange={(e) => handleChange('newConstruction', 'allowed', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        value={form.items.newConstruction.reason}
                        onChange={(e) => handleChange('newConstruction', 'reason', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                  </tr>

      {/* Modernization */}
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Modernization</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={form.items.modernization.expenditure}
                        onChange={(e) => handleChange('modernization', 'expenditure', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={form.items.modernization.allowed}
                        onChange={(e) => handleChange('modernization', 'allowed', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        value={form.items.modernization.reason}
                        onChange={(e) => handleChange('modernization', 'reason', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md border-gray-300"
                      />
                    </td>
                  </tr>

                  {/* Total Row */}
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

                  {/* Total Account I-V Row */}
               {/* Total Account I-V Row */}
<tr className="bg-gray-50 font-bold">
  <td className="border border-gray-300 px-4 py-2">Total Account I -V</td>
  <td className="border border-gray-300 px-4 py-2 text-center">
    {totals.grandTotalExpenditure?.toLocaleString() || '0'}
  </td>
  <td className="border border-gray-300 px-4 py-2 text-center">
    {totals.grandTotalAllowed?.toLocaleString() || '0'}
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

export default Account5Form;