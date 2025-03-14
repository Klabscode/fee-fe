
import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Account4Form = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');

  const [form, setForm] = useState({
    campusMaintenance: {
      gardening: { expenditure: '', allowed: '', reason: '' },
      sweepingAndCleaning: { expenditure: '', allowed: '', reason: '' },
      sanitation: { expenditure: '', allowed: '', reason: '' },
      securityServices: { expenditure: '', allowed: '', reason: '' }
    },
    laboratoryMaintenance: {
      scienceLab: { expenditure: '', allowed: '', reason: '' },
      languageLab: { expenditure: '', allowed: '', reason: '' },
      computerLab: { expenditure: '', allowed: '', reason: '' },
      digitalLibraryLab: { expenditure: '', allowed: '', reason: '' }
    },
    equipmentMaintenance: {
      amc: { expenditure: '', allowed: '', reason: '' }
    },
    electricalMaintenance: {
      electricLines: { expenditure: '', allowed: '', reason: '' },
      generator: { expenditure: '', allowed: '', reason: '' },
      fireExtinguisher: { expenditure: '', allowed: '', reason: '' },
      AirConditioner: { expenditure: '', allowed: '', reason: '' }
    },
    buildingMaintenance: {
      colorWash: { expenditure: '', allowed: '', reason: '' },
      repairsAndRenovation: { expenditure: '', allowed: '', reason: '' },
      depreciation: { expenditure: '', allowed: '', reason: '' },
      lease: { expenditure: '', allowed: '', reason: '' }
    }
  });

  const [totals, setTotals] = useState({
    campusMaintenance: { expenditure: 0, allowed: 0 },
    laboratoryMaintenance: { expenditure: 0, allowed: 0 },
    equipmentMaintenance: { expenditure: 0, allowed: 0 },
    electricalMaintenance: { expenditure: 0, allowed: 0 },
    buildingMaintenance: { expenditure: 0, allowed: 0 },
    grandTotal: { expenditure: 0, allowed: 0 }
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setInitialLoading(true);
        const feeFormId = localStorage.getItem('feeFormId');
        const allocatedTo = loginResponse?.output?.data?.id;
        
        const headers = { 'Authorization': loginResponse?.output?.token };
        const response = await api.get('/getAllocatedFormByFeeForm', {
          params: { 
            feeformId: feeFormId,
            allocatedTo: allocatedTo 
          },
          headers
        });
  
        if (response.data?.results) {
          const data = response.data.results;
          
          // First update form state with individual field values
          setForm({
            campusMaintenance: {
              gardening: {
                expenditure: data.account4aGardeningExpenditure || '',
                allowed: data.account4aGardeningAllowed || '',
                reason: data.account4aGardeningReason || ''
              },
              sweepingAndCleaning: {
                expenditure: data.account4aSweepingExpenditure || '',
                allowed: data.account4aSweepingAllowed || '',
                reason: data.account4aSweepingReason || ''
              },
              sanitation: {
                expenditure: data.account4aSanitationExpenditure || '',
                allowed: data.account4aSanitationAllowed || '',
                reason: data.account4aSanitationReason || ''
              },
              securityServices: {
                expenditure: data.account4aSecurityServicesExpenditure || '',
                allowed: data.account4aSecurityServicesAllowed || '',
                reason: data.account4aSecurityServicesReason || ''
              }
            },
            laboratoryMaintenance: {
              scienceLab: {
                expenditure: data.account4bScienceLabExpenditure || '',
                allowed: data.account4bScienceLabAllowed || '',
                reason: data.account4bScienceLabReason || ''
              },
              languageLab: {
                expenditure: data.account4bLanguageLabExpenditure || '',
                allowed: data.account4bLanguageLabAllowed || '',
                reason: data.account4bLanguageLabReason || ''
              },
              computerLab: {
                expenditure: data.account4bComputerLabExpenditure || '',
                allowed: data.account4bComputerLabAllowed || '',
                reason: data.account4bComputerLabReason || ''
              },
              digitalLibraryLab: {
                expenditure: data.account4bDigitalLibraryLabExpenditure || '',
                allowed: data.account4bDigitalLibraryLabAllowed || '',
                reason: data.account4bDigitalLibraryLabReason || ''
              }
            },
            equipmentMaintenance: {
              amc: {
                expenditure: data.account4cXeroxExpenditure || '',
                allowed: data.account4cXeroxAllowed || '',
                reason: data.account4cXeroxReason || ''
              }
            },
            electricalMaintenance: {
              electricLines: {
                expenditure: data.account4dElectricLinesExpenditure || '',
                allowed: data.account4dElectricLinesAllowed || '',
                reason: data.account4dElectricLinesReason || ''
              },
              generator: {
                expenditure: data.account4dGeneratorExpenditure || '',
                allowed: data.account4dGeneratorAllowed || '',
                reason: data.account4dGeneratorReason || ''
              },
              fireExtinguisher: {
                expenditure: data.account4dFireExtinguisherExpenditure || '',
                allowed: data.account4dFireExtinguisherAllowed || '',
                reason: data.account4dFireExtinguisherReason || ''
              },
              AirConditioner: {
                expenditure: data.account4dAirConditionerExpenditure || '',
                allowed: data.account4dAirConditionerAllowed || '',
                reason: data.account4dAirConditionerReason || ''
              }
            },
            buildingMaintenance: {
              colorWash: {
                expenditure: data.account4eColourWashExpenditure || '',
                allowed: data.account4eColourWashAllowed || '',
                reason: data.account4eColourWashReason || ''
              },
              repairsAndRenovation: {
                expenditure: data.account4eRepairsExpenditure || '',
                allowed: data.account4eRepairsAllowed || '',
                reason: data.account4eRepairsReason || ''
              },
              depreciation: {
                expenditure: data.account4eDepreciationExpenditure || '',
                allowed: data.account4eDepreciationAllowed || '',
                reason: data.account4eDepreciationReason || ''
              },
              lease: {
                expenditure: data.account4eLeaseExpenditure || '',
                allowed: data.account4eLeaseAllowed || '',
                reason: data.account4eLeaseReason || ''
              }
            }
          });
  
          // Then update totals state
          setTotals({
            campusMaintenance: {
              expenditure: parseFloat(data.account4aTotalExpenditure) || 0,
              allowed: parseFloat(data.account4aTotalAllowed) || 0
            },
            laboratoryMaintenance: {
              expenditure: parseFloat(data.account4bTotalExpenditure) || 0,
              allowed: parseFloat(data.account4bTotalAllowed) || 0
            },
            equipmentMaintenance: {
              expenditure: parseFloat(data.account4cTotalExpenditure) || 0,
              allowed: parseFloat(data.account4cTotalAllowed) || 0
            },
            electricalMaintenance: {
              expenditure: parseFloat(data.account4dTotalExpenditure) || 0,
              allowed: parseFloat(data.account4dTotalAllowed) || 0
            },
            buildingMaintenance: {
              expenditure: parseFloat(data.account4eTotalExpenditure) || 0,
              allowed: parseFloat(data.account4eTotalAllowed) || 0
            },
            grandTotal: {
              expenditure: parseFloat(data.account4MaintanenceGrandTotalExpenditure) || 0,
              allowed: parseFloat(data.account4MaintanenceGrandTotalAllowed) || 0
            }
          });
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      } finally {
        setInitialLoading(false);
      }
    };
  
    fetchFormData();
  }, [loginResponse?.output?.token, loginResponse?.output?.data?.id]);
  useEffect(() => {
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
  
    const sectionTotals = {
      campusMaintenance: calculateSectionTotals(form.campusMaintenance),
      laboratoryMaintenance: calculateSectionTotals(form.laboratoryMaintenance),
      equipmentMaintenance: calculateSectionTotals(form.equipmentMaintenance),
      electricalMaintenance: calculateSectionTotals(form.electricalMaintenance),
      buildingMaintenance: calculateSectionTotals(form.buildingMaintenance)
    };
  
    const grandTotal = {
      expenditure: Math.round(
        Object.values(sectionTotals).reduce((sum, section) => sum + section.expenditure, 0)
      ),
      allowed: Math.round(
        Object.values(sectionTotals).reduce((sum, section) => sum + section.allowed, 0)
      )
    };
  
    // Store grand totals in localStorage
    localStorage.setItem('maintenanceGrandTotalExpenditure', grandTotal.expenditure.toString());
    localStorage.setItem('maintenanceGrandTotalAllowed', grandTotal.allowed.toString());
  
    setTotals({
      ...sectionTotals,
      grandTotal
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
      setLoading(true);
      const feeFormId = localStorage.getItem('feeFormId');
      const allocatedTo = loginResponse?.output?.data?.id;
      
      const headers = {
        'Authorization': loginResponse?.output?.token,
        'Content-Type': 'application/json'
      };

      const payload = {
        account4aGardeningExpenditure: parseFloat(form.campusMaintenance.gardening.expenditure) || 0,
        account4aGardeningAllowed: parseFloat(form.campusMaintenance.gardening.allowed) || 0,
        account4aGardeningReason: form.campusMaintenance.gardening.reason || '',
        account4aSweepingExpenditure: parseFloat(form.campusMaintenance.sweepingAndCleaning.expenditure) || 0,
        account4aSweepingAllowed: parseFloat(form.campusMaintenance.sweepingAndCleaning.allowed) || 0,
        account4aSweepingReason: form.campusMaintenance.sweepingAndCleaning.reason || '',
        account4aSanitationExpenditure: parseFloat(form.campusMaintenance.sanitation.expenditure) || 0,
        account4aSanitationAllowed: parseFloat(form.campusMaintenance.sanitation.allowed) || 0,
        account4aSanitationReason: form.campusMaintenance.sanitation.reason || '',
        account4aSecurityServicesExpenditure: parseFloat(form.campusMaintenance.securityServices.expenditure) || 0,
        account4aSecurityServicesAllowed: parseFloat(form.campusMaintenance.securityServices.allowed) || 0,
        account4aSecurityServicesReason: form.campusMaintenance.securityServices.reason || '',
        account4aTotalExpenditure: totals.campusMaintenance.expenditure,
        account4aTotalAllowed: totals.campusMaintenance.allowed,

        account4bScienceLabExpenditure: parseFloat(form.laboratoryMaintenance.scienceLab.expenditure) || 0,
        account4bScienceLabAllowed: parseFloat(form.laboratoryMaintenance.scienceLab.allowed) || 0,
        account4bScienceLabReason: form.laboratoryMaintenance.scienceLab.reason || '',
        account4bLanguageLabExpenditure: parseFloat(form.laboratoryMaintenance.languageLab.expenditure) || 0,
        account4bLanguageLabAllowed: parseFloat(form.laboratoryMaintenance.languageLab.allowed) || 0,
        account4bLanguageLabReason: form.laboratoryMaintenance.languageLab.reason || '',
        account4bComputerLabExpenditure: parseFloat(form.laboratoryMaintenance.computerLab.expenditure) || 0,
        account4bComputerLabAllowed: parseFloat(form.laboratoryMaintenance.computerLab.allowed) || 0,
        account4bComputerLabReason: form.laboratoryMaintenance.computerLab.reason || '',
        account4bDigitalLibraryLabExpenditure: parseFloat(form.laboratoryMaintenance.digitalLibraryLab.expenditure) || 0,
        account4bDigitalLibraryLabAllowed: parseFloat(form.laboratoryMaintenance.digitalLibraryLab.allowed) || 0,
        account4bDigitalLibraryLabReason: form.laboratoryMaintenance.digitalLibraryLab.reason || '',
        account4bTotalExpenditure: totals.laboratoryMaintenance.expenditure,
        account4bTotalAllowed: totals.laboratoryMaintenance.allowed,

        account4cXeroxExpenditure: parseFloat(form.equipmentMaintenance.amc.expenditure) || 0,
        account4cXeroxAllowed: parseFloat(form.equipmentMaintenance.amc.allowed) || 0,
        account4cXeroxReason: form.equipmentMaintenance.amc.reason || '',
        account4cTotalExpenditure: totals.equipmentMaintenance.expenditure,
        account4cTotalAllowed: totals.equipmentMaintenance.allowed,

        account4dElectricLinesExpenditure: parseFloat(form.electricalMaintenance.electricLines.expenditure) || 0,
        account4dElectricLinesAllowed: parseFloat(form.electricalMaintenance.electricLines.allowed) || 0,
        account4dElectricLinesReason: form.electricalMaintenance.electricLines.reason || '',
        account4dGeneratorExpenditure: parseFloat(form.electricalMaintenance.generator.expenditure) || 0,
        account4dGeneratorAllowed: parseFloat(form.electricalMaintenance.generator.allowed) || 0,
        account4dGeneratorReason: form.electricalMaintenance.generator.reason || '',
        account4dFireExtinguisherExpenditure: parseFloat(form.electricalMaintenance.fireExtinguisher.expenditure) || 0,
        account4dFireExtinguisherAllowed: parseFloat(form.electricalMaintenance.fireExtinguisher.allowed) || 0,
        account4dFireExtinguisherReason: form.electricalMaintenance.fireExtinguisher.reason || '',
        account4dAirConditionerExpenditure: parseFloat(form.electricalMaintenance.AirConditioner.expenditure) || 0,
        account4dAirConditionerAllowed: parseFloat(form.electricalMaintenance.AirConditioner.allowed) || 0,
        account4dAirConditionerReason: form.electricalMaintenance.AirConditioner.reason || '',
        account4dTotalExpenditure: totals.electricalMaintenance.expenditure,
        account4dTotalAllowed: totals.electricalMaintenance.allowed,

        account4eColourWashExpenditure: parseFloat(form.buildingMaintenance.colorWash.expenditure) || 0,
        account4eColourWashAllowed: parseFloat(form.buildingMaintenance.colorWash.allowed) || 0,
        account4eColourWashReason: form.buildingMaintenance.colorWash.reason || '',
        account4eRepairsExpenditure: parseFloat(form.buildingMaintenance.repairsAndRenovation.expenditure) || 0,
        account4eRepairsAllowed: parseFloat(form.buildingMaintenance.repairsAndRenovation.allowed) || 0,
        account4eRepairsReason: form.buildingMaintenance.repairsAndRenovation.reason || '',
        account4eDepreciationExpenditure: parseFloat(form.buildingMaintenance.depreciation.expenditure) || 0,
        account4eDepreciationAllowed: parseFloat(form.buildingMaintenance.depreciation.allowed) || 0,
        account4eDepreciationReason: form.buildingMaintenance.depreciation.reason || '',
        account4eLeaseExpenditure: parseFloat(form.buildingMaintenance.lease.expenditure) || 0,
        account4eLeaseAllowed: parseFloat(form.buildingMaintenance.lease.allowed) || 0,
        account4eLeaseReason: form.buildingMaintenance.lease.reason || '',
        account4eTotalExpenditure: totals.buildingMaintenance.expenditure,
        account4eTotalAllowed: totals.buildingMaintenance.allowed,
        
        account4MaintanenceGrandTotalExpenditure: totals.grandTotal.expenditure,
        account4MaintanenceGrandTotalAllowed: totals.grandTotal.allowed,
        account4: "Completed"
      };

      await api.put(
        `/editAllocateForm?feeformId=${feeFormId}&allocatedTo=${allocatedTo}`,
        payload,
        { headers }
      );
      
      navigate('/account56');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (field) => {
    const nameMap = {
      amc: 'AMC of Xerox, Printers, CCTV Camera, LCD projectors and other modern equipments',
      lease: 'Lease or Rent (If the land/ building is 3rd party)'
    };
    return nameMap[field] || field.replace(/([A-Z])/g, ' $1').toLowerCase();
  };

  const renderSection = (title, sectionKey, items) => (
    <div className="mb-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          {Object.entries(items).map(([field, values]) => (
            <tr key={field}>
              <td className="border border-gray-300 px-4 py-2 capitalize">
                {getDisplayName(field)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={values.expenditure}
                  onChange={(e) => handleChange(sectionKey, field, 'expenditure', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="number"
                  value={values.allowed}
                  onChange={(e) => handleChange(sectionKey, field, 'allowed', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <input
                  type="text"
                  value={values.reason}
                  onChange={(e) => handleChange(sectionKey, field, 'reason', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md border-gray-300"
                />
              </td>
            </tr>
          ))}
          <tr className="bg-gray-50 font-bold">
            <td className="border border-gray-300 px-4 py-2">Total</td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {totals[sectionKey].expenditure.toLocaleString()}
            </td>
            <td className="border border-gray-300 px-4 py-2 text-center">
              {totals[sectionKey].allowed.toLocaleString()}
            </td>
            <td className="border border-gray-300 px-4 py-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );

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
              <h1 className="ml-4 text-lg font-semibold text-gray-900">Account IV - Maintenance</h1>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 mb-8">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">HEAD OF EXPENDITURE</th>
                    <th className="border border-gray-300 px-4 py-2">Expenditure of the previous Year</th>
                    <th className="border border-gray-300 px-4 py-2">Allowed</th>
                    <th className="border border-gray-300 px-4 py-2">If not allowed/reduced-Reason</th>
                  </tr>
                </thead>
              </table>

              {renderSection('a) Campus Maintenance', 'campusMaintenance', form.campusMaintenance)}
              {renderSection('b) Laboratory Maintenance', 'laboratoryMaintenance', form.laboratoryMaintenance)}
              {renderSection('c) Equipment Maintenance', 'equipmentMaintenance', form.equipmentMaintenance)}
              {renderSection('d) Maintenance/Expenditure at Electrical and other Machines', 'electricalMaintenance', form.electricalMaintenance)}
              {renderSection('e) Building Maintenance', 'buildingMaintenance', form.buildingMaintenance)}

              <div className="mt-8">
                <table className="w-full border-collapse border border-gray-300">
                  <tbody>
                    <tr className="bg-gray-100 font-bold text-lg">
                      <td className="border border-gray-300 px-4 py-3">Maintenance Grand Total</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        {totals.grandTotal.expenditure.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        {totals.grandTotal.allowed.toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-3"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
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

export default Account4Form;