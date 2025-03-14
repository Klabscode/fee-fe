import React, { useState, useEffect } from 'react';
import api from '../api/api';

const AccountFiveFormat = () => {
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

  const tableClasses = "w-full border-collapse border border-gray-300 table-fixed";
  const headerCellClasses = "border border-gray-300 px-4 py-2 font-semibold bg-gray-50";
  const bodyCellClasses = "border border-gray-300 px-4 py-2";
  const numberCellClasses = "border border-gray-300 px-4 py-2 text-center";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-center font-bold text-lg mb-6">Account V - Infrastructure</h2>
     
        
        <div className="overflow-x-auto">
          <table className={tableClasses}>
            <thead>
              <tr>
                <th className={headerCellClasses} style={{width: '20%'}}>HEAD OF EXPENDITURE</th>
                <th className={headerCellClasses} style={{width: '25%'}}>Expenditure</th>
                <th className={headerCellClasses} style={{width: '20%'}}>Allowed</th>
                <th className={headerCellClasses} style={{width: '35%'}}>
                  <div className="break-words">If not allowed/reduced-Reason</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={bodyCellClasses}>
                  <div className="break-words">Purchasing of Furniture</div>
                </td>
                <td className={numberCellClasses}>
                  {formData?.account5FurnitureExpenditure || 0}
                </td>
                <td className={numberCellClasses}>
                  {formData?.account5FurnitureAllowed || 0}
                </td>
                <td className={bodyCellClasses}>
                  <div className="break-words whitespace-normal">{formData?.account5FurnitureReason || ''}</div>
                </td>
              </tr>
              
              <tr>
                <td className={bodyCellClasses}>
                  <div className="break-words">Equipment</div>
                </td>
                <td className={numberCellClasses}>
                  {formData?.account5EquipmentExpenditure || 0}
                </td>
                <td className={numberCellClasses}>
                  {formData?.account5EquipmentAllowed || 0}
                </td>
                <td className={bodyCellClasses}>
                  <div className="break-words whitespace-normal">{formData?.account5EquipmentReason || ''}</div>
                </td>
              </tr>
              
              <tr>
                <td className={bodyCellClasses}>
                  <div className="break-words">Land</div>
                </td>
                <td className={numberCellClasses}>
                  {formData?.account5LandExpenditure || 0}
                </td>
                <td className={numberCellClasses}>
                  {formData?.account5LandAllowed || 0}
                </td>
                <td className={bodyCellClasses}>
                  <div className="break-words whitespace-normal">{formData?.account5LandReason || ''}</div>
                </td>
              </tr>
              
              <tr>
                <td className={bodyCellClasses}>
                  <div className="break-words">New Construction</div>
                </td>
                <td className={numberCellClasses}>
                  {formData?.account5NewConstructionExpenditure || 0}
                </td>
                <td className={numberCellClasses}>
                  {formData?.account5NewConstructionAllowed || 0}
                </td>
                <td className={bodyCellClasses}>
                  <div className="break-words whitespace-normal">{formData?.account5NewConstructionReason || ''}</div>
                </td>
              </tr>
              
              <tr>
                <td className={bodyCellClasses}>
                  <div className="break-words">Modernization</div>
                </td>
                <td className={numberCellClasses}>
                  {formData?.account5ModernizationExpenditure || 0}
                </td>
                <td className={numberCellClasses}>
                  {formData?.account5ModernizationAllowed || 0}
                </td>
                <td className={bodyCellClasses}>
                  <div className="break-words whitespace-normal">{formData?.account5ModernizationReason || ''}</div>
                </td>
              </tr>
              
              <tr>
                <td className={`${bodyCellClasses} font-semibold`}>Total</td>
                <td className={`${numberCellClasses} font-semibold`}>
                  {formData?.account5TotalExpenditure || 0}
                </td>
                <td className={`${numberCellClasses} font-semibold`}>
                  {formData?.account5TotalAllowed || 0}
                </td>
                <td className={bodyCellClasses}></td>
              </tr>
              
              <tr>
                <td className={`${bodyCellClasses} font-semibold`}>
                  <div className="break-words">Grand Total Account I - VI</div>
                </td>
                <td className={`${numberCellClasses} font-semibold`}>
                  {formData?.account1to5TotalExpenditure || 0}
                </td>
                <td className={`${numberCellClasses} font-semibold`}>
                  {formData?.account1to5TotalAllowed || 0}
                </td>
                <td className={bodyCellClasses}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountFiveFormat;