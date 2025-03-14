import React, { useState, useEffect } from 'react';
import api from '../api/api';

const AccountFourFormat = () => {
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
        <h2 className="text-center font-bold text-lg mb-6">Account IV - Maintenance</h2>
 
        
        <div className="mb-6">
          <h3 className="font-semibold mb-4">a) Campus Maintenance</h3>
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
                  <td className={bodyCellClasses}><div className="break-words">Gardening</div></td>
                  <td className={numberCellClasses}>{formData?.account4aGardeningExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4aGardeningAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4aGardeningReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={bodyCellClasses}><div className="break-words">Sweeping</div></td>
                  <td className={numberCellClasses}>{formData?.account4aSweepingExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4aSweepingAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4aSweepingReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={bodyCellClasses}><div className="break-words">Sanitation</div></td>
                  <td className={numberCellClasses}>{formData?.account4aSanitationExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4aSanitationAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4aSanitationReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={bodyCellClasses}><div className="break-words">Security Services</div></td>
                  <td className={numberCellClasses}>{formData?.account4aSecurityServicesExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4aSecurityServicesAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4aSecurityServicesReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={`${bodyCellClasses} font-semibold`}>Total</td>
                  <td className={`${numberCellClasses} font-semibold`}>{formData?.account4aTotalExpenditure || 0}</td>
                  <td className={`${numberCellClasses} font-semibold`}>{formData?.account4aTotalAllowed || 0}</td>
                  <td className={bodyCellClasses}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-4">b) Laboratory Maintenance</h3>
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
                  <td className={bodyCellClasses}><div className="break-words">Science Lab</div></td>
                  <td className={numberCellClasses}>{formData?.account4bScienceLabExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4bScienceLabAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4bScienceLabReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={bodyCellClasses}><div className="break-words">Language Lab</div></td>
                  <td className={numberCellClasses}>{formData?.account4bLanguageLabExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4bLanguageLabAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4bLanguageLabReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={bodyCellClasses}><div className="break-words">Computer Lab</div></td>
                  <td className={numberCellClasses}>{formData?.account4bComputerLabExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4bComputerLabAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4bComputerLabReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={bodyCellClasses}><div className="break-words">Digital Library Lab</div></td>
                  <td className={numberCellClasses}>{formData?.account4bDigitalLibraryLabExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4bDigitalLibraryLabAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4bDigitalLibraryLabReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={`${bodyCellClasses} font-semibold`}>Total</td>
                  <td className={`${numberCellClasses} font-semibold`}>{formData?.account4bTotalExpenditure || 0}</td>
                  <td className={`${numberCellClasses} font-semibold`}>{formData?.account4bTotalAllowed || 0}</td>
                  <td className={bodyCellClasses}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-4">c) Equipment Maintenance</h3>
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
                  <td className={bodyCellClasses}><div className="break-words">Xerox</div></td>
                  <td className={numberCellClasses}>{formData?.account4cXeroxExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4cXeroxAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4cXeroxReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={`${bodyCellClasses} font-semibold`}>Total</td>
                  <td className={`${numberCellClasses} font-semibold`}>{formData?.account4cTotalExpenditure || 0}</td>
                  <td className={`${numberCellClasses} font-semibold`}>{formData?.account4cTotalAllowed || 0}</td>
                  <td className={bodyCellClasses}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-4">d) Maintenance Expenditures Electrical and other Machines</h3>
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
                  <td className={bodyCellClasses}><div className="break-words">Electric Lines</div></td>
                  <td className={numberCellClasses}>{formData?.account4dElectricLinesExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4dElectricLinesAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4dElectricLinesReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={bodyCellClasses}><div className="break-words">Generator</div></td>
                  <td className={numberCellClasses}>{formData?.account4dGeneratorExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4dGeneratorAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4dGeneratorReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={bodyCellClasses}><div className="break-words">Fire Extinguisher</div></td>
                  <td className={numberCellClasses}>{formData?.account4dFireExtinguisherExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4dFireExtinguisherAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4dFireExtinguisherReason || ''}</div></td>
                </tr>
                <tr>
                <td className={bodyCellClasses}><div className="break-words">Air Conditioner</div></td>
                  <td className={numberCellClasses}>{formData?.account4dAirConditionerExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4dAirConditionerAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4dAirConditionerReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={`${bodyCellClasses} font-semibold`}>Total</td>
                  <td className={`${numberCellClasses} font-semibold`}>{formData?.account4dTotalExpenditure || 0}</td>
                  <td className={`${numberCellClasses} font-semibold`}>{formData?.account4dTotalAllowed || 0}</td>
                  <td className={bodyCellClasses}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-4">e) Building Maintenance</h3>
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
                  <td className={bodyCellClasses}><div className="break-words">Colour Wash</div></td>
                  <td className={numberCellClasses}>{formData?.account4eColourWashExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4eColourWashAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4eColourWashReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={bodyCellClasses}><div className="break-words">Repairs</div></td>
                  <td className={numberCellClasses}>{formData?.account4eRepairsExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4eRepairsAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4eRepairsReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={bodyCellClasses}><div className="break-words">Lease</div></td>
                  <td className={numberCellClasses}>{formData?.account4eLeaseExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4eLeaseAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4eLeaseReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={bodyCellClasses}><div className="break-words">Depreciation</div></td>
                  <td className={numberCellClasses}>{formData?.account4eDepreciationExpenditure || 0}</td>
                  <td className={numberCellClasses}>{formData?.account4eDepreciationAllowed || 0}</td>
                  <td className={bodyCellClasses}><div className="break-words whitespace-normal">{formData?.account4eDepreciationReason || ''}</div></td>
                </tr>
                <tr>
                  <td className={`${bodyCellClasses} font-semibold`}>Total</td>
                  <td className={`${numberCellClasses} font-semibold`}>{formData?.account4eTotalExpenditure || 0}</td>
                  <td className={`${numberCellClasses} font-semibold`}>{formData?.account4eTotalAllowed || 0}</td>
                  <td className={bodyCellClasses}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-6">
          <div className="overflow-x-auto">
            <table className={tableClasses}>
              <tbody>
                <tr>
                  <td className={`${bodyCellClasses} font-semibold`}><div className="break-words">Maintenance Grand Total</div></td>
                  <td className={`${numberCellClasses} font-semibold`}>{formData?.account4MaintanenceGrandTotalExpenditure || 0}</td>
                  <td className={`${numberCellClasses} font-semibold`}>{formData?.account4MaintanenceGrandTotalAllowed || 0}</td>
                  <td className={bodyCellClasses}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountFourFormat;