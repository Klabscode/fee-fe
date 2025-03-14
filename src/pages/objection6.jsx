import React, { useState, useEffect } from 'react';
import api from '../api/api';

const AccountSixFormat = () => {
  const [formData, setFormData] = useState(null);
  const [studentStrength, setStudentStrength] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feeFormId = localStorage.getItem('feeFormId');
        const totalStudentStrength = localStorage.getItem('totalStudentStrength');
        const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
        const allocatedTo = loginResponse?.output?.data?.id;

        setStudentStrength(totalStudentStrength || 0);

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

  const tableClasses = "w-full border-collapse border border-gray-300 table-fixed";
  const bodyCellClasses = "border border-gray-300 px-4 py-2";
  const numberCellClasses = "border border-gray-300 px-4 py-2 text-center";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-center font-bold text-lg mb-6">Account VI - Futuristic Development</h2>
       
        
        <div className="overflow-x-auto">
          <table className={tableClasses}>
            <thead>
              <tr>
                <th className={`${bodyCellClasses} font-semibold bg-gray-50`} style={{width: '50%'}}>
                  <div className="break-words">HEAD OF EXPENDITURE</div>
                </th>
                <th className={`${bodyCellClasses} font-semibold bg-gray-50`} style={{width: '25%'}}>
                  <div className="break-words">Percentage</div>
                </th>
                <th className={`${bodyCellClasses} font-semibold bg-gray-50`} style={{width: '25%'}}>
                  <div className="break-words">Amount</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={bodyCellClasses}>
                  <div className="break-words whitespace-pre-line">
                    Development fund (10% to 15%)
                    Panchayat 10%
                    Municipality 12.5%
                    Corporation 15%
                    (For Christian Catholic minority school irrespective of location 15%)
                  </div>
                </td>
                <td className={numberCellClasses}>
                  {formData?.account6DevelopmentFundPercentage || 0}%
                </td>
                <td className={numberCellClasses}>
                  {formData?.account6DevelopmentFundAmount || 0}
                </td>
              </tr>

              <tr>
                <td className={bodyCellClasses}>
                  <div className="break-words">
                    Minority Catholic school - Corporate school Development Fund (10%)
                  </div>
                </td>
                <td className={numberCellClasses}>
                  {formData?.account6MinorityPercentage || 0}%
                </td>
                <td className={numberCellClasses}>
                  {formData?.account6MinorityAmount || 0}
                </td>
              </tr>

              <tr>
                <td className={bodyCellClasses}>
                  <div className="break-words">
                    Infrastructure Grading (7% to 10%) Additional income
                  </div>
                </td>
                <td className={numberCellClasses}>
                  {formData?.account6InfrastructurePercentage || 0}%
                </td>
                <td className={numberCellClasses}>
                  {formData?.account6InfrastructureAmount || 0}
                </td>
              </tr>

              <tr>
                <td className={bodyCellClasses}>
                  <div className="break-words">
                    Sundry Expenses: Unexpected expenditures, which cannot be included in any of the above heads. (If a fixed amount Rs.750/- or Rs.1000/-) is not allowed already
                  </div>
                </td>
                <td className={numberCellClasses}>
                  {formData?.account6UnexpectedExpendituresPercentage || 0}
                </td>
                <td className={numberCellClasses}>
                  {formData?.account6UnexpectedExpendituresAmount || 0}
                </td>
              </tr>

              <tr>
                <td className={`${bodyCellClasses} font-semibold`}>Total</td>
                <td className={numberCellClasses}></td>
                <td className={`${numberCellClasses} font-semibold`}>
                  {formData?.account6Total || 0}
                </td>
              </tr>

              <tr>
                <td className={`${bodyCellClasses} font-semibold`}>
                  <div className="break-words">Grand Total Account I -VI</div>
                </td>
                <td className={numberCellClasses}></td>
                <td className={`${numberCellClasses} font-semibold`}>
                  {formData?.account1to6Total || 0}
                </td>
              </tr>

              <tr>
                <td className={bodyCellClasses}>
                  <div className="break-words">Student Strength</div>
                </td>
                <td className={numberCellClasses}></td>
                <td className={numberCellClasses}>
                  {studentStrength}
                </td>
              </tr>

              <tr>
                <td className={bodyCellClasses}>
                  <div className="break-words">Average Annual Expenditure per student</div>
                </td>
                <td className={numberCellClasses}></td>
                <td className={numberCellClasses}>
                  {formData?.account6MeanValue || 0}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountSixFormat;