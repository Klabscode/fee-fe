import React, { useState, useEffect } from 'react';
import api from '../api/api';

const AccountThreeFormat = () => {
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
        <h2 className="text-center font-bold text-lg mb-6">Account III - Expenses on Specific Purposes</h2>
      
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 table-fixed">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50" style={{width: '20%'}}>HEAD OF EXPENDITURE</th>
                <th className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50" style={{width: '25%'}}>Expenditure</th>
                <th className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50" style={{width: '20%'}}>Allowed</th>
                <th className="border border-gray-300 px-4 py-2 font-semibold bg-gray-50" style={{width: '35%'}}>
                  <div className="break-words">If not allowed/reduced-Reason</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Educational Tour only for students</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account3EducationTourExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account3EducationTourAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account3EducationTourReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Seminar or orientation programme for students</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account3SeminarExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account3SeminarAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account3SeminarReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Group Activities (NCC/NSS/Scouts/JRC/RSO) and camps</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account3GroupActivitiesExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account3GroupActivitiesAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account3GroupActivitiesReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Medical Expenses</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account3MedicalExpensesExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account3MedicalExpensesAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account3MedicalExpensesReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Teaching through Technology (Smart class or any other modern technology)</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account3TeachingThroughTechnologyExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account3TeachingThroughTechnologyAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account3TeachingThroughTechnologyReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Co-Curricular Activities connected with curriculum for all</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account3CoCurricularExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account3CoCurricularAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account3CoCurricularReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words">Extra-Curricular Activities for all</div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account3ExtraCurricularExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {formData?.account3ExtraCurricularAllowed || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="break-words whitespace-normal">{formData?.account3ExtraCurricularReason || ''}</div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Total</td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                  {formData?.account3TotalExpenditure || 0}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                  {formData?.account3TotalAllowed || 0}
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

export default AccountThreeFormat;