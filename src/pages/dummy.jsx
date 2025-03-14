import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../api/api';

const ObjectionFormat = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [hearingDate, setHearingDate] = useState('');
  const [studentStrength, setStudentStrength] = useState({});
  const [futureYearFees, setFutureYearFees] = useState(null);

  // Account-I details state
  const [accountIDetails, setAccountIDetails] = useState({
    principal: '0',
    teachingStaff: '0',
    nonTeachingStaff: '0',
    epfContribution: '0',
    esi: '0',
    gratuity: '0',
    occasionalFestivalGift: '0'
  });

  // Account states (II to V)
  const [accounts, setAccounts] = useState({
    accountII: '0',
    accountIII: '0',
    accountIV: '0',
    accountV: '0'
  });

  // Review items state
  const [reviewItems, setReviewItems] = useState(['0', '0', '0', '0', '0']);

  // Part II states
  const [partIIAmounts, setPartIIAmounts] = useState({
    developmentFund: '0',
    infrastructureGrading: '0',
    sundryExpenses: '0'
  });

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const feeFormId = localStorage.getItem('feeFormId');
        console.log('feeFormId:', feeFormId);
  
        const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
        const headers = {
          'Authorization': loginResponse?.output?.token,
          'Content-Type': 'application/json'
        };
        const allocatedTo = loginResponse?.output?.data?.id;
  
        // Fetch fee form data
        const feeFormResponse = await api.get(`/getFeeFormByFeeformId?feeformId=${feeFormId}`, { headers });
        console.log('Fee Form API Response:', feeFormResponse);
  
        if (feeFormResponse.data.status === 200) {
          setStudentStrength(feeFormResponse.data.results.studentStrengthIndividual);
        }
  
        // Fetch allocated form data
        const allocatedFormResponse = await api.get(`/getAllocatedFormByFeeForm?feeformId=${feeFormId}&allocatedTo=${allocatedTo}`, { headers });
        console.log('Allocated Form API Response:', allocatedFormResponse);
  
        if (allocatedFormResponse.data.status === 200) {
          setFutureYearFees(allocatedFormResponse.data.results);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  // Function to get future year fees
  const getFutureYearFee = (year, className) => {
    if (!futureYearFees) return 0;
    const keyMap = {
      'LKG': { year1: 'futureYear1LkgFee', year2: 'futureYear2LkgFee' },
      'UKG': { year1: 'futureYear1UkgFee', year2: 'futureYear2UkgFee' },
      'I': { year1: 'futureYear1FirstFee', year2: 'futureYear2FirstFee' },
      'II': { year1: 'futureYear1SecondFee', year2: 'futureYear2SecondFee' },
      'III': { year1: 'futureYear1ThirdFee', year2: 'futureYear2ThirdFee' },
      'IV': { year1: 'futureYear1FourFee', year2: 'futureYear2FourFee' },
      'V': { year1: 'futureYear1FiveFee', year2: 'futureYear2FiveFee' },
      'VI': { year1: 'futureYear1SixFee', year2: 'futureYear2SixFee' },
      'VII': { year1: 'futureYear1SevenFee', year2: 'futureYear2SevenFee' },
      'VIII': { year1: 'futureYear1EightFee', year2: 'futureYear2EightFee' },
      'IX': { year1: 'futureYear1NineFee', year2: 'futureYear2NineFee' },
      'X': { year1: 'futureYear1TenFee', year2: 'futureYear2TenFee' },
      'XI': { year1: 'futureYear1ElevenFee', year2: 'futureYear2ElevenFee' },
      'XII': { year1: 'futureYear1TwelveFee', year2: 'futureYear2TwelveFee' }
    };
    const key = year === 1 ? keyMap[className].year1 : keyMap[className].year2;
    return futureYearFees[key] || 0;
  };

  // Calculate Account I total (sum of first table)
  const calculateAccountITotal = () => {
    return Object.values(accountIDetails).reduce((sum, value) => sum + (Number(value) || 0), 0);
  };

  // Calculate total for accounts I to V
  const calculateTotalAccounts = () => {
    const accountITotal = calculateAccountITotal();
    const otherAccountsTotal = Object.values(accounts).reduce((sum, value) => sum + (Number(value) || 0), 0);
    return accountITotal + otherAccountsTotal;
  };

  const calculateReviewTotal = () => {
    return reviewItems.reduce((sum, value) => sum + (Number(value) || 0), 0);
  };

  const handleAccountIChange = (field, value) => {
    setAccountIDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccountChange = (account, value) => {
    setAccounts(prev => ({
      ...prev,
      [account]: value
    }));
  };

  const handleReviewItemChange = (index, value) => {
    const newReviewItems = [...reviewItems];
    newReviewItems[index] = value;
    setReviewItems(newReviewItems);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
  {/* Header Section */}
           <div className="flex items-center mb-6">
             <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-blue-600">
               <ChevronLeft className="h-5 w-5 mr-1" />
               Back
             </button>
           </div>
 
           <div className="text-center mb-8">
             <h1 className="text-xl font-bold mb-2">
               PROCEEDINGS OF THE TAMIL NADU PRIVATE SCHOOLS FEE DETERMINATION COMMITTEE
             </h1>
             <div className="flex justify-center items-center gap-2 mb-2">
               <span>Dated:</span>
               <input
                 type="date"
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 className="border border-gray-300 rounded px-2 py-1"
               />
             </div>
           </div>
 
           {/* Order Section */}
           <div className="mb-8">
             <h2 className="text-lg font-bold text-center mb-6">ORDER</h2>
             <p className="text-center mb-4">(Order passed under Sec 6(4) of the Act 22 of 2009)</p>
             
             <div className="space-y-4">
               <div>
                 <p>Notice of hearing on the objection petition was given to the objector.</p>
                 <div className="flex gap-2 items-center mt-2">
                   <span>The objections are heard on</span>
                   <input
                     type="date"
                     value={hearingDate}
                     onChange={(e) => setHearingDate(e.target.value)}
                     className="border border-gray-300 rounded px-2 py-1"
                   />
                 </div>
               </div>
             </div>
           </div>
 
           {/* Part I - Account Section */}
           <div className="mb-8">
             <table className="w-full border-collapse border border-black">
               <thead>
                 <tr>
                   <th className="border border-black px-4 py-2 text-left font-normal">HEAD OF EXPENDITURE</th>
                   <th className="border border-black px-4 py-2 text-left font-normal">
                     Amount allowed in the order issued by the committee under sec 6(1)
                   </th>
                   <th className="border border-black px-4 py-2"></th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td colSpan="3" className="border border-black px-4 py-2 text-center">(PART - I)</td>
                 </tr>
                 <tr>
                   <td colSpan="3" className="border border-black px-4 py-2">ACCOUNT - I</td>
                 </tr>
                 {[
                   ['Principal', 'principal'],
                   ['Teaching Staff', 'teachingStaff'],
                   ['Non-teaching Staff', 'nonTeachingStaff'],
                   ['E.P.F. Contribution', 'epfContribution'],
                   ['E.S.I', 'esi'],
                   ['Gratuity', 'gratuity'],
                   ['Occasional Festival Gift', 'occasionalFestivalGift']
                 ].map(([label, key]) => (
                   <tr key={key}>
                     <td className="border border-black px-4 py-2">{label}</td>
                     <td className="border border-black px-4 py-2">
                       <input
                         type="number"
                         value={accountIDetails[key]}
                         onChange={(e) => handleAccountIChange(key, e.target.value)}
                         className="w-full p-1 text-center"
                       />
                     </td>
                     <td className="border border-black px-4 py-2"></td>
                   </tr>
                 ))}
               </tbody>
             </table>
 
             {/* Accounts I to V Summary */}
             <table className="w-full border-collapse border border-black mt-4">
               <tbody>
                 <tr>
                   <td className="border border-black px-4 py-2">ACCOUNT - I</td>
                   <td className="border border-black px-4 py-2 text-center">{calculateAccountITotal()}</td>
                   <td className="border border-black px-4 py-2"></td>
                 </tr>
                 {[
                   ['II', 'accountII'],
                   ['III', 'accountIII'],
                   ['IV', 'accountIV'],
                   ['V', 'accountV']
                 ].map(([num, key]) => (
                   <tr key={key}>
                     <td className="border border-black px-4 py-2">ACCOUNT - {num}</td>
                     <td className="border border-black px-4 py-2">
                       <input
                         type="number"
                         value={accounts[key]}
                         onChange={(e) => handleAccountChange(key, e.target.value)}
                         className="w-full p-1 text-center"
                       />
                     </td>
                     <td className="border border-black px-4 py-2"></td>
                   </tr>
                 ))}
                 <tr>
                   <td className="border border-black px-4 py-2">Total Account I to V in the impugned order</td>
                   <td className="border border-black px-4 py-2 text-center">{calculateTotalAccounts()}</td>
                   <td className="border border-black px-4 py-2"></td>
                 </tr>
               </tbody>
             </table>
 
             {/* Added As per Review Section */}
             <table className="w-full border-collapse border border-black mt-4">
               <tbody>
                 <tr>
                   <td colSpan="3" className="border border-black px-4 py-2 text-center">Added As per Review</td>
                 </tr>
                 {reviewItems.map((value, index) => (
                   <tr key={index}>
                     <td className="border border-black px-4 py-2"></td>
                     <td className="border border-black px-4 py-2"></td>
                     <td className="border border-black px-4 py-2">
                       <input
                         type="number"
                         value={value}
                         onChange={(e) => handleReviewItemChange(index, e.target.value)}
                         className="w-full p-1 text-center"
                       />
                     </td>
                   </tr>
                 ))}
                 <tr>
                   <td colSpan="2" className="border border-black px-4 py-2">Review Total</td>
                   <td className="border border-black px-4 py-2 text-center">{calculateReviewTotal()}</td>
                 </tr>
                 <tr>
                   <td colSpan="2" className="border border-black px-4 py-2">
                     Total (Impugned Order Part I and Review)
                   </td>
                   <td className="border border-black px-4 py-2 text-center">
                     {calculateTotalAccounts() + calculateReviewTotal()}
                   </td>
                 </tr>
               </tbody>
             </table>
 
             {/* PART - II */}
             <table className="w-full border-collapse border border-black mt-4">
               <tbody>
                 <tr>
                   <td colSpan="3" className="border border-black px-4 py-2 text-center">PART - II</td>
                 </tr>
                 <tr>
                   <td className="border border-black px-4 py-2" style={{width: '60%'}}>
                     Development fund (10% to 15%)<br/>
                     Panchayat 10%<br/>
                     Municipality 12.5%<br/>
                     Corporation 15%<br/>
                     (For Christian Catholic minority school irrespective of location 15%)
                   </td>
                   <td className="border border-black px-4 py-2">
                     <input type="text" className="w-full p-1 text-center" defaultValue="10%" />
                   </td>
                   <td className="border border-black px-4 py-2">
                     <input type="number" className="w-full p-1 text-center" defaultValue="0" />
                   </td>
                 </tr>
                 <tr>
                   <td className="border border-black px-4 py-2">
                     Minority Catholic school - Corporate school Development Fund (10%)
                   </td>
                   <td className="border border-black px-4 py-2">
                     <input type="text" className="w-full p-1 text-center" defaultValue="10%" />
                   </td>
                   <td className="border border-black px-4 py-2">
                     <input type="number" className="w-full p-1 text-center" defaultValue="0" />
                   </td>
                 </tr>
                 <tr>
                   <td className="border border-black px-4 py-2">
                     Infrastructure Grading (7% to 10%) Additional income
                   </td>
                   <td className="border border-black px-4 py-2">
                     <input type="text" className="w-full p-1 text-center" defaultValue="9%" />
                   </td>
                   <td className="border border-black px-4 py-2">
                     <input type="number" className="w-full p-1 text-center" defaultValue="0" />
                   </td>
                 </tr>
                 <tr>
                   <td className="border border-black px-4 py-2">
                     Sundry Expenses: Unexpected expenditure which cannot be included
                     in any of the above heads. (If a fixed amount Rs.750/- or Rs.1000/-)
                     is not allowed already
                   </td>
                   <td className="border border-black px-4 py-2"></td>
                   <td className="border border-black px-4 py-2">
                     <input type="number" className="w-full p-1 text-center" defaultValue="0" />
                   </td>
                 </tr>
                 <tr>
                   <td className="border border-black px-4 py-2">TOTAL EXPENDITURE (PART I + II)</td>
                   <td className="border border-black px-4 py-2"></td>
                   <td className="border border-black px-4 py-2">
                     <input type="number" className="w-full p-1 text-center" defaultValue="0" />
                   </td>
                 </tr>
               </tbody>
             </table>
 
   {/* Student Information */}
<table className="w-full border-collapse border border-black mt-4">
  <tbody>
    <tr>
      <td className="border border-black px-4 py-2">Student Strength</td>
      <td className="border border-black px-4 py-2 text-center">0</td>
      <td className="border border-black px-4 py-2 text-center">0</td>
    </tr>
    <tr>
      <td className="border border-black px-4 py-2">Average Annual Expenditure per student</td>
      <td className="border border-black px-4 py-2 text-center"></td>
      <td className="border border-black px-4 py-2 text-center"></td>
    </tr>
  </tbody>
</table>

{/* Fee Structure Tables */}
<h3 className="font-normal mb-2">Fee structure for 2024-25</h3>
<table className="w-full border-collapse border border-black mb-4">
  <thead>
    <tr>
      <th className="border border-black px-4 py-2 font-normal">Class</th>
      <th className="border border-black px-4 py-2 font-normal">Student's strength</th>
      <th className="border border-black px-4 py-2 font-normal">Fee fixed in the Impugned Order(1)</th>
      <th className="border border-black px-4 py-2 font-normal">Revised Fee</th>
    </tr>
  </thead>
  <tbody>
    {[
      { display: 'LKG', key: 'lkg' },
      { display: 'UKG', key: 'ukg' },
      { display: 'I', key: 'one' },
      { display: 'II', key: 'two' },
      { display: 'III', key: 'three' },
      { display: 'IV', key: 'four' },
      { display: 'V', key: 'five' },
      { display: 'VI', key: 'six' },
      { display: 'VII', key: 'seven' },
      { display: 'VIII', key: 'eight' },
      { display: 'IX', key: 'nine' },
      { display: 'X', key: 'ten' },
      { display: 'XI', key: 'eleven' },
      { display: 'XII', key: 'twelve' }
    ].map(({ display, key }) => (
      <tr key={key}>
        <td className="border border-black px-4 py-2">{display}</td>
        <td className="border border-black px-4 py-2">
          <input
            type="number"
            value={studentStrength[key] || 0}
            readOnly
            className="w-full p-1 text-center bg-gray-100"
          />
        </td>
        <td className="border border-black px-4 py-2">
          <input type="number" className="w-full p-1 text-center" defaultValue="0" />
        </td>
        <td className="border border-black px-4 py-2">
          <input type="number" className="w-full p-1 text-center" defaultValue="0" />
        </td>
      </tr>
    ))}
  </tbody>
</table>
 

          <h3 className="font-normal mb-2">Fee Structure for 2025-26 & 2026-27</h3>
          <table className="w-full border-collapse border border-black mb-4">
            <thead>
              <tr>
                <th className="border border-black px-4 py-2 font-normal">Class</th>
                <th className="border border-black px-4 py-2 font-normal">2025-26 Fee (Rs.)</th>
                <th className="border border-black px-4 py-2 font-normal">2026-27 Fee (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {[
                'LKG', 'UKG',
                'I', 'II', 'III', 'IV', 'V',
                'VI', 'VII', 'VIII',
                'IX', 'X',
                'XI', 'XII'
              ].map((className) => (
                <tr key={className}>
                  <td className="border border-black px-4 py-2">{className}</td>
                  <td className="border border-black px-4 py-2">
                    <input 
                      type="number"
                      value={getFutureYearFee(1, className)}
                      readOnly
                      className="w-full p-1 text-center bg-gray-100"
                    />
                  </td>
                  <td className="border border-black px-4 py-2">
                    <input 
                      type="number"
                      value={getFutureYearFee(2, className)}
                      readOnly
                      className="w-full p-1 text-center bg-gray-100"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>



            {/* Signatures Section */}
            <div className="mt-16">
              <div className="grid grid-cols-2 gap-16">
                <div className="text-center">
                  <p className="font-bold">Mr. Justice R.Balasubramanian</p>
                  <p>Chairman</p>
                </div>

                <div className="text-center">
                  <p className="font-bold">Director of Matriculation Schools</p>
                  <p>Member</p>
                </div>

                <div className="text-center">
                  <p className="font-bold">Deputy Secretary to Government,</p>
                  <p>School Education Department</p>
                  <p>Member - Secretary</p>
                </div>

                <div className="text-center">
                  <p className="font-bold">Director of Elementary Education</p>
                  <p>Member</p>
                </div>

                <div className="text-center col-span-2">
                  <p className="font-bold">Joint Chief Engineer/(Buildings)</p>
                  <p>Public Works Department</p>
                  <p>Member</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ObjectionFormat;