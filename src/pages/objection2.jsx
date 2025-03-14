import React, { useState, useEffect } from 'react';
import api from '../api/api';

const AccountTwoFormat = () => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feeFormId = localStorage.getItem('feeFormId');
        const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
        const allocatedTo = loginResponse?.output?.data?.id;

        const headers = {
          'Authorization': loginResponse?.output?.token,
          'Content-Type': 'application/json'
        };

        const response = await api.get(
          `/getAllocatedFormByFeeForm?feeformId=${feeFormId}&allocatedTo=${allocatedTo}`,
          { headers }
        );

        if (response.data.status === 200) {
          setFormData(response.data.results);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-center font-bold text-lg mb-6">Account II - Administration</h2>
     
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 table-fixed">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50" style={{width: '20%'}}>HEAD OF EXPENDITURE</th>
                <th className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50" style={{width: '25%'}}>Expenditure of the previous Academic Year</th>
                <th className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50" style={{width: '20%'}}>Allowed</th>
                <th className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50" style={{width: '35%'}}>
                  <div className="break-words">If not allowed/reduced-Reason</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Electricity Charges</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2ElectricityChargesExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2ElectricityChargesAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2ElectricityChargesReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Fuel for Generator</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2FuelForGeneratorExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2FuelForGeneratorAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2FuelForGeneratorReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Water Taxes & Water Charges</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2WaterTaxesExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2WaterTaxesAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2WaterTaxesReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Property Taxes</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2PropertyTaxesExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2PropertyTaxesAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2PropertyTaxesReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Telephone & Mobile (Administrative Purpose)</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2TelephoneExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2TelephoneAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2TelephoneReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Internet and SMS (Administrative Purpose)</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2InternetExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2InternetAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2InternetReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Postage</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2PostageExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2PostageAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2PostageReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Printing (Printing of Cash Books, Ledgers, Registers, Application, Magazines and Circulars etc.)</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2PrintingExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2PrintingAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2PrintingReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Stationery</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2StationeryExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2StationeryAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2StationeryReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Examination Expenses</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2ExaminationExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2ExaminationAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2ExaminationReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Books and periodicals (Library)</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2BooksExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2BooksAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2BooksReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Teaching Aids</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2TeachingAidsExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2TeachingAidsAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2TeachingAidsReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Sports and Games</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2SportsGamesExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2SportsGamesAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2SportsGamesReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Staff Welfare</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2StaffWelfareExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2StaffWelfareAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2StaffWelfareReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Special Training and Workshop for the skill development of the child</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2SpecialTrainingExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2SpecialTrainingAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2SpecialTrainingReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                <div className="break-words">Recognition Expenses and any other Statutory Payments</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2RecognitionExpensesExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2RecognitionExpensesAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2RecognitionExpensesReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Administrative Travel and Vehicle Expenses</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2AdministrativeTravelExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2AdministrativeTravelAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2AdministrativeTravelReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Professional Fee (Legal, Audit etc) Administration</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2ProfessionalFeeExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2ProfessionalFeeAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2ProfessionalFeeReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Hospitality</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2HospitalityExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2HospitalityAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2HospitalityReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Functions and Celebrations</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2FunctionsExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2FunctionsAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2FunctionsReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Advertisement for Recruitment of Teachers</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2AdvertisementForTeacherRecruitmentExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account2AdvertisementForTeacherRecruitmentAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account2AdvertisementForTeacherRecruitmentReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Total</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                  {formData?.account2TotalExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                  {formData?.account2TotalAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountTwoFormat;