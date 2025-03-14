import React, { useState, useEffect } from 'react';
import api from '../api/api';

const AccountSevenFormat = () => {
  const [formData, setFormData] = useState(null);
  const [strengthData, setStrengthData] = useState(null);

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

        const allocatedResponse = await api.get(
          `/getAllocatedFormByFeeForm?feeformId=${feeFormId}&allocatedTo=${allocatedTo}`,
          { headers }
        );

        const strengthResponse = await api.get(
          `/getFeeFormByFeeformId?feeformId=${feeFormId}`,
          { headers }
        );

        if (allocatedResponse.data.status === 200) {
          setFormData(allocatedResponse.data.results);
        }

        if (strengthResponse.data.status === 200) {
          setStrengthData(strengthResponse.data.results);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const tableClasses = "w-full border-collapse border border-gray-300 table-fixed";
  const headerCellClasses = "border border-gray-300 px-4 py-2 font-semibold bg-gray-50";
  const bodyCellClasses = "border border-gray-300 px-4 py-2";
  const numberCellClasses = "border border-gray-300 px-4 py-2 text-center";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-center font-bold text-lg mb-6">Account VII - Fee Structure</h2>


        {/* Fee Structure 2024-25 */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4">Fee structure for 2024-25</h3>
          <div className="overflow-x-auto">
            <table className={tableClasses}>
              <thead>
                <tr>
                  <th className={headerCellClasses} style={{width: '33%'}}>Class</th>
                  <th className={headerCellClasses} style={{width: '33%'}}>Student strength</th>
                  <th className={headerCellClasses} style={{width: '34%'}}>Annual Fee (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { class: 'LKG', strength: 'lkg', currentFee: 'currentYearLkgFee' },
                  { class: 'UKG', strength: 'ukg', currentFee: 'currentYearUkgFee' },
                  { class: 'I', strength: 'one', currentFee: 'currentYearFirstFee' },
                  { class: 'II', strength: 'two', currentFee: 'currentYearSecondFee' },
                  { class: 'III', strength: 'three', currentFee: 'currentYearThirdFee' },
                  { class: 'IV', strength: 'four', currentFee: 'currentYearFourFee' },
                  { class: 'V', strength: 'five', currentFee: 'currentYearFiveFee' },
                  { class: 'VI', strength: 'six', currentFee: 'currentYearSixFee' },
                  { class: 'VII', strength: 'seven', currentFee: 'currentYearSevenFee' },
                  { class: 'VIII', strength: 'eight', currentFee: 'currentYearEightFee' },
                  { class: 'IX', strength: 'nine', currentFee: 'currentYearNineFee' },
                  { class: 'X', strength: 'ten', currentFee: 'currentYearTenFee' },
                  { class: 'XI', strength: 'eleven', currentFee: 'currentYearElevenFee' },
                  { class: 'XII', strength: 'twelve', currentFee: 'currentYearTwelveFee' }
                ].map((item, index) => (
                  <tr key={index}>
                    <td className={bodyCellClasses}>
                      <div className="break-words">{item.class}</div>
                    </td>
                    <td className={numberCellClasses}>
                      {strengthData?.studentStrengthIndividual?.[item.strength] || 0}
                    </td>
                    <td className={numberCellClasses}>
                      {formData?.[item.currentFee] || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fee Structure 2025-26 & 2026-27 */}
        <div className="mb-8">
          <h3 className="font-semibold mb-4">Fee Structure for 2025-26 & 2026-27</h3>
          <div className="overflow-x-auto">
            <table className={tableClasses}>
              <thead>
                <tr>
                  <th className={headerCellClasses} style={{width: '33%'}}>Class</th>
                  <th className={headerCellClasses} style={{width: '33%'}}>2025-26 Fees (Rs.)</th>
                  <th className={headerCellClasses} style={{width: '34%'}}>2026-27 Fees (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { class: 'LKG', future1: 'futureYear1LkgFee', future2: 'futureYear2LkgFee' },
                  { class: 'UKG', future1: 'futureYear1UkgFee', future2: 'futureYear2UkgFee' },
                  { class: 'I', future1: 'futureYear1FirstFee', future2: 'futureYear2FirstFee' },
                  { class: 'II', future1: 'futureYear1SecondFee', future2: 'futureYear2SecondFee' },
                  { class: 'III', future1: 'futureYear1ThirdFee', future2: 'futureYear2ThirdFee' },
                  { class: 'IV', future1: 'futureYear1FourFee', future2: 'futureYear2FourFee' },
                  { class: 'V', future1: 'futureYear1FiveFee', future2: 'futureYear2FiveFee' },
                  { class: 'VI', future1: 'futureYear1SixFee', future2: 'futureYear2SixFee' },
                  { class: 'VII', future1: 'futureYear1SevenFee', future2: 'futureYear2SevenFee' },
                  { class: 'VIII', future1: 'futureYear1EightFee', future2: 'futureYear2EightFee' },
                  { class: 'IX', future1: 'futureYear1NineFee', future2: 'futureYear2NineFee' },
                  { class: 'X', future1: 'futureYear1TenFee', future2: 'futureYear2TenFee' },
                  { class: 'XI', future1: 'futureYear1ElevenFee', future2: 'futureYear2ElevenFee' },
                  { class: 'XII', future1: 'futureYear1TwelveFee', future2: 'futureYear2TwelveFee' }
                ].map((item, index) => (
                  <tr key={index}>
                    <td className={bodyCellClasses}>
                      <div className="break-words">{item.class}</div>
                    </td>
                    <td className={numberCellClasses}>
                      {formData?.[item.future1] || 0}
                    </td>
                    <td className={numberCellClasses}>
                      {formData?.[item.future2] || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

     
      </div>
    </div>
  );
};

export default AccountSevenFormat;