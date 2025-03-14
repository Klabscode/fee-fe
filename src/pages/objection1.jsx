import React, { useState, useEffect } from 'react';
import api from '../api/api';

const AccountOneFormat = () => {
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
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">

        
        {/* Account Part-I Section */}
        <div className="mb-8">
          <h2 className="text-center font-bold text-lg mb-6">Account (PART-I)</h2>
          <h3 className="text-center mb-4">Salary, Allowances, Welfare Scheme and other Welfare Activities</h3>
          
          <div className="mb-8">
            <h4 className="font-semibold mb-4">A. Salary and Allowances</h4>
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
                    <td className="border border-gray-300 px-4 py-2">Principal</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aPrincipalPreviousExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aPrincipalAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="break-words whitespace-normal">{formData?.account1aPrincipalReason || ''}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Teaching staff</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aTeachingStaffPreviousExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aTeachingStaffAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="break-words whitespace-normal">{formData?.account1aTeachingStaffReason || ''}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Non-teaching staff</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aNonTeachingStaffPreviousExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aNonTeachingStaffAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="break-words whitespace-normal">{formData?.account1aNonTeachingStaffReason || ''}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">E.P.F. Contribution</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aEpfPreviousExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aEpfAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="break-words whitespace-normal">{formData?.account1aEpfReason || ''}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">E.S.I</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aEsiPreviousExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aEsiAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="break-words whitespace-normal">{formData?.account1aEsiReason || ''}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Earned Leave</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aEarnedLeavePreviousExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aEarnedLeaveAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="break-words whitespace-normal">{formData?.account1aEarnedLeaveReason || ''}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Gratuity</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aGratuityExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aGratuityAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="break-words whitespace-normal">{formData?.account1aGratuityReason || ''}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Pension</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aPensionExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aPensionAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="break-words whitespace-normal">{formData?.account1aPensionReason || ''}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Retirement Purse</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aRetirementPurseExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1aRetirementPurseAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="break-words whitespace-normal">{formData?.account1aRetirementPurseReason || ''}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Total</td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                      {formData?.account1aTotalExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                      {formData?.account1aTotalAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-semibold mb-4">B. Other Schemes and Benefits for the Staff</h4>
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
                    <td className="border border-gray-300 px-4 py-2">Management Contribution to LIC/(Medical Insurance)</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1bLicExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1bLicAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="break-words whitespace-normal">{formData?.account1bLicReason || ''}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Staff Uniform</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1bStaffUniformExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1bStaffUniformAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="break-words whitespace-normal">{formData?.account1bStaffUniformReason || ''}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Incentive for Good Results</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1bIncentiveExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1bIncentiveAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="break-words whitespace-normal">{formData?.account1bIncentiveReason || ''}</div>
                    </td>
                  </tr>
                  <tr>
                  <td className="border border-gray-300 px-4 py-2">Occasional Festival Gifts</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1bGiftsExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {formData?.account1bGiftsAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="break-words whitespace-normal">{formData?.account1bGiftsReason || ''}</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 font-semibold">Total</td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                      {formData?.account1bTotalExpenditure || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center font-semibold">
                      {formData?.account1bTotalAllowed || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOneFormat;