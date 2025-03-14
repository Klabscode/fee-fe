import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';

const Account2Form = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
  const [form, setForm] = useState({
    items: {
      electricityCharges: { expenditure: '', allowed: '', reason: '' },
      fuelForGenerator: { expenditure: '', allowed: '', reason: '' },
      waterTaxesAndCharges: { expenditure: '', allowed: '', reason: '' },
      propertyTaxes: { expenditure: '', allowed: '', reason: '' },
      telephoneAndMobilePhoneAdministrativePurposes: { expenditure: '', allowed: '', reason: '' },
      internetAndSMSServicesAdministrativePurposes: { expenditure: '', allowed: '', reason: '' },
      postage: { expenditure: '', allowed: '', reason: '' },
      printingPrintingOfBookLedgersFeeReceiptsSchoolMagazinesAndCirculars: { expenditure: '', allowed: '', reason: '' },
      stationeryItemsAdministrativePurposes: { expenditure: '', allowed: '', reason: '' },
      examinationExpenses: { expenditure: '', allowed: '', reason: '' },
      booksAndPeriodicalsAdministrativePurposes: { expenditure: '', allowed: '', reason: '' },
      teachingAids: { expenditure: '', allowed: '', reason: '' },
      sportsAndGames: { expenditure: '', allowed: '', reason: '' },
      staffWelfare: { expenditure: '', allowed: '', reason: '' },
      specialTrainingAndWorkshopForTheSkillDevelopmentOfTheStaff: { expenditure: '', allowed: '', reason: '' },
      recognitionExpensesAndAnyOtherStatutoryExpenses: { expenditure: '', allowed: '', reason: '' },
      administrativeTravelAndVehicleExpenses: { expenditure: '', allowed: '', reason: '' },
      professionalFee: { expenditure: '', allowed: '', reason: '' },
      hospitality: { expenditure: '', allowed: '', reason: '' },
      functionsAndCelebrations: { expenditure: '', allowed: '', reason: '' },
      advertisementForRecruitmentOfTeachers: { expenditure: '', allowed: '', reason: '' }
    }
  });

  const [totals, setTotals] = useState({ expenditure: 0, allowed: 0 });

  useEffect(() => {
    const calculateTotals = () => {
      const expenditureTotal = Object.values(form.items).reduce(
        (sum, item) => sum + (parseFloat(item.expenditure) || 0),
        0
      );
      const allowedTotal = Object.values(form.items).reduce(
        (sum, item) => sum + (parseFloat(item.allowed) || 0),
        0
      );
      return { expenditure: expenditureTotal, allowed: allowedTotal };
    };
    setTotals(calculateTotals());
  }, [form]);

  const handleChange = (field, column, value) => {
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
    account2ElectricityChargesExpenditure: parseFloat(form.items.electricityCharges.expenditure) || 0,
    account2ElectricityChargesAllowed: parseFloat(form.items.electricityCharges.allowed) || 0,
    account2ElectricityChargesReason: form.items.electricityCharges.reason || '',
    account2FuelForGeneratorExpenditure: parseFloat(form.items.fuelForGenerator.expenditure) || 0,
    account2FuelForGeneratorAllowed: parseFloat(form.items.fuelForGenerator.allowed) || 0,
    account2FuelForGeneratorReason: form.items.fuelForGenerator.reason || '',
    account2WaterTaxesExpenditure: parseFloat(form.items.waterTaxesAndCharges.expenditure) || 0,
    account2WaterTaxesAllowed: parseFloat(form.items.waterTaxesAndCharges.allowed) || 0,
    account2WaterTaxesReason: form.items.waterTaxesAndCharges.reason || '',
    account2PropertyTaxesExpenditure: parseFloat(form.items.propertyTaxes.expenditure) || 0,
    account2PropertyTaxesAllowed: parseFloat(form.items.propertyTaxes.allowed) || 0,
    account2PropertyTaxesReason: form.items.propertyTaxes.reason || '',
    account2TelephoneExpenditure: parseFloat(form.items.telephoneAndMobilePhoneAdministrativePurposes.expenditure) || 0,
    account2TelephoneAllowed: parseFloat(form.items.telephoneAndMobilePhoneAdministrativePurposes.allowed) || 0,
    account2TelephoneReason: form.items.telephoneAndMobilePhoneAdministrativePurposes.reason || '',
    account2InternetExpenditure: parseFloat(form.items.internetAndSMSServicesAdministrativePurposes.expenditure) || 0,
    account2InternetAllowed: parseFloat(form.items.internetAndSMSServicesAdministrativePurposes.allowed) || 0,
    account2InternetReason: form.items.internetAndSMSServicesAdministrativePurposes.reason || '',
    account2PostageExpenditure: parseFloat(form.items.postage.expenditure) || 0,
    account2PostageAllowed: parseFloat(form.items.postage.allowed) || 0,
    account2PostageReason: form.items.postage.reason || '',
    account2PrintingExpenditure: parseFloat(form.items.printingPrintingOfBookLedgersFeeReceiptsSchoolMagazinesAndCirculars.expenditure) || 0,
    account2PrintingAllowed: parseFloat(form.items.printingPrintingOfBookLedgersFeeReceiptsSchoolMagazinesAndCirculars.allowed) || 0,
    account2PrintingReason: form.items.printingPrintingOfBookLedgersFeeReceiptsSchoolMagazinesAndCirculars.reason || '',
    account2StationeryExpenditure: parseFloat(form.items.stationeryItemsAdministrativePurposes.expenditure) || 0,
    account2StationeryAllowed: parseFloat(form.items.stationeryItemsAdministrativePurposes.allowed) || 0,
    account2StationeryReason: form.items.stationeryItemsAdministrativePurposes.reason || '',
    account2ExaminationExpenditure: parseFloat(form.items.examinationExpenses.expenditure) || 0,
    account2ExaminationAllowed: parseFloat(form.items.examinationExpenses.allowed) || 0,
    account2ExaminationReason: form.items.examinationExpenses.reason || '',
    account2BooksExpenditure: parseFloat(form.items.booksAndPeriodicalsAdministrativePurposes.expenditure) || 0,
    account2BooksAllowed: parseFloat(form.items.booksAndPeriodicalsAdministrativePurposes.allowed) || 0,
    account2BooksReason: form.items.booksAndPeriodicalsAdministrativePurposes.reason || '',
    account2TeachingAidsExpenditure: parseFloat(form.items.teachingAids.expenditure) || 0,
    account2TeachingAidsAllowed: parseFloat(form.items.teachingAids.allowed) || 0,
    account2TeachingAidsReason: form.items.teachingAids.reason || '',
    account2SportsGamesExpenditure: parseFloat(form.items.sportsAndGames.expenditure) || 0,
    account2SportsGamesAllowed: parseFloat(form.items.sportsAndGames.allowed) || 0,
    account2SportsGamesReason: form.items.sportsAndGames.reason || '',
    account2StaffWelfareExpenditure: parseFloat(form.items.staffWelfare.expenditure) || 0,
    account2StaffWelfareAllowed: parseFloat(form.items.staffWelfare.allowed) || 0,
    account2StaffWelfareReason: form.items.staffWelfare.reason || '',
    account2SpecialTrainingExpenditure: parseFloat(form.items.specialTrainingAndWorkshopForTheSkillDevelopmentOfTheStaff.expenditure) || 0,
    account2SpecialTrainingAllowed: parseFloat(form.items.specialTrainingAndWorkshopForTheSkillDevelopmentOfTheStaff.allowed) || 0,
    account2SpecialTrainingReason: form.items.specialTrainingAndWorkshopForTheSkillDevelopmentOfTheStaff.reason || '',
    account2RecognitionExpensesExpenditure: parseFloat(form.items.recognitionExpensesAndAnyOtherStatutoryExpenses.expenditure) || 0,
    account2RecognitionExpensesAllowed: parseFloat(form.items.recognitionExpensesAndAnyOtherStatutoryExpenses.allowed) || 0,
    account2RecognitionExpensesReason: form.items.recognitionExpensesAndAnyOtherStatutoryExpenses.reason || '',
    account2AdministrativeTravelExpenditure: parseFloat(form.items.administrativeTravelAndVehicleExpenses.expenditure) || 0,
    account2AdministrativeTravelAllowed: parseFloat(form.items.administrativeTravelAndVehicleExpenses.allowed) || 0,
    account2AdministrativeTravelReason: form.items.administrativeTravelAndVehicleExpenses.reason || '',
    account2ProfessionalFeeExpenditure: parseFloat(form.items.professionalFee.expenditure) || 0,
    account2ProfessionalFeeAllowed: parseFloat(form.items.professionalFee.allowed) || 0,
    account2ProfessionalFeeReason: form.items.professionalFee.reason || '',
    account2HospitalityExpenditure: parseFloat(form.items.hospitality.expenditure) || 0,
    account2HospitalityAllowed: parseFloat(form.items.hospitality.allowed) || 0,
    account2HospitalityReason: form.items.hospitality.reason || '',
    account2FunctionsExpenditure: parseFloat(form.items.functionsAndCelebrations.expenditure) || 0,
    account2FunctionsAllowed: parseFloat(form.items.functionsAndCelebrations.allowed) || 0,
    account2FunctionsReason: form.items.functionsAndCelebrations.reason || '',
    account2AdvertisementForTeacherRecruitmentExpenditure: parseFloat(form.items.advertisementForRecruitmentOfTeachers.expenditure) || 0,
    account2AdvertisementForTeacherRecruitmentAllowed: parseFloat(form.items.advertisementForRecruitmentOfTeachers.allowed) || 0,
    account2AdvertisementForTeacherRecruitmentReason: form.items.advertisementForRecruitmentOfTeachers.reason || '',
    account2TotalExpenditure: totals.expenditure,
    account2TotalAllowed: totals.allowed,
    account2: "Completed"
  });
  const handleNext = async () => {
    try {
      setLoading(true);
      const transformedData = transformFormData();
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
      const feeFormId = localStorage.getItem('feeFormId');
      const allocatedTo = loginResponse?.output?.data?.id;
      
      const headers = {
        'Authorization': loginResponse?.output?.token,
        'Content-Type': 'application/json'
      };
  
      // Keep the query params in URL and send transformedData as payload
      await api.put(
        `/editAllocateForm?feeformId=${feeFormId}&allocatedTo=${allocatedTo}`, 
        transformedData,  // Just send transformedData as payload
        { headers }
      );
      
      navigate('/account3');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
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
              <h1 className="ml-4 text-lg font-semibold text-gray-900">Account II - Administration</h1>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">HEAD OF EXPENDITURE</th>
                    <th className="border border-gray-300 px-4 py-2">Expenditure of the previous Academic Year</th>
                    <th className="border border-gray-300 px-4 py-2">Allowed</th>
                    <th className="border border-gray-300 px-4 py-2">If not allowed/reduced-Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(form.items).map(([field, values]) => (
                    <tr key={field}>
                      <td className="border border-gray-300 px-4 py-2 capitalize">
                        {field.replace(/([A-Z])/g, ' $1').toLowerCase()}
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
                        <input
                          type="text"
                          value={values.reason}
                          onChange={(e) => handleChange(field, 'reason', e.target.value)}
                          className="w-full px-3 py-2 border rounded-md border-gray-300"
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
              >
                Cancel
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

export default Account2Form;