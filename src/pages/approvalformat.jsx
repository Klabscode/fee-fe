import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download } from 'lucide-react';
import api from '../api/api';

const ApprovalFormat = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [schoolDetails, setSchoolDetails] = useState({
    code: '',
    name: '',
    address: ''
  });

  const [feeStructure2024, setFeeStructure2024] = useState({
    'LKG': { strength: '', fee: '' },
    'UKG': { strength: '', fee: '' },
    'I': { strength: '', fee: '' },
    'II': { strength: '', fee: '' },
    'III': { strength: '', fee: '' },
    'IV': { strength: '', fee: '' },
    'V': { strength: '', fee: '' },
    'VI': { strength: '', fee: '' },
    'VII': { strength: '', fee: '' },
    'VIII': { strength: '', fee: '' },
    'IX': { strength: '', fee: '' },
    'X': { strength: '', fee: '' },
    'XI': { strength: '', fee: '' },
    'XII': { strength: '', fee: '' }
  });

  const [futureFees, setFutureFees] = useState({
    'LKG': { fee2025: '', fee2026: '' },
    'UKG': { fee2025: '', fee2026: '' },
    'I': { fee2025: '', fee2026: '' },
    'II': { fee2025: '', fee2026: '' },
    'III': { fee2025: '', fee2026: '' },
    'IV': { fee2025: '', fee2026: '' },
    'V': { fee2025: '', fee2026: '' },
    'VI': { fee2025: '', fee2026: '' },
    'VII': { fee2025: '', fee2026: '' },
    'VIII': { fee2025: '', fee2026: '' },
    'IX': { fee2025: '', fee2026: '' },
    'X': { fee2025: '', fee2026: '' },
    'XI': { fee2025: '', fee2026: '' },
    'XII': { fee2025: '', fee2026: '' }
  });

  useEffect(() => {
    const loadHtml2PdfScript = () => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadHtml2PdfScript();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const feeFormId = localStorage.getItem('feeFormId');
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
      const allocatedTo = loginResponse?.output?.data?.id;
      const headers = {
        'Authorization': loginResponse?.output?.token,
        'Content-Type': 'application/json'
      };
  
      // Fetch school details and student strength
      const strengthResponse = await api.get(`/getFeeFormByFeeformId`, {
        params: { feeformId: feeFormId },
        headers
      });
  
      if (strengthResponse.data?.results) {
        const schoolData = strengthResponse.data.results;
        setSchoolDetails({
          code: schoolData.feeformSchoolId || '',
          name: schoolData.schoolName || '',
          address: schoolData.address || ''
        });
      }
  
      // Fetch fee data
      const feeResponse = await api.get('/getAllocatedFormByFeeForm', {
        params: { feeformId: feeFormId, allocatedTo: allocatedTo },
        headers
      });
  
      if (strengthResponse.data?.results?.studentStrengthIndividual && feeResponse.data?.results) {
        const strengthData = strengthResponse.data.results.studentStrengthIndividual;
        const feeData = feeResponse.data.results;
        
        setFeeStructure2024({
          'LKG': { 
            strength: strengthData.lkg?.toString() || '', 
            fee: feeData.currentYearLkgFee?.toString() || '' 
          },
          'UKG': { 
            strength: strengthData.ukg?.toString() || '', 
            fee: feeData.currentYearUkgFee?.toString() || '' 
          },
          'I': { 
            strength: strengthData.one?.toString() || '', 
            fee: feeData.currentYearFirstFee?.toString() || '' 
          },
          'II': { 
            strength: strengthData.two?.toString() || '', 
            fee: feeData.currentYearSecondFee?.toString() || '' 
          },
          'III': { 
            strength: strengthData.three?.toString() || '', 
            fee: feeData.currentYearThirdFee?.toString() || '' 
          },
          'IV': { 
            strength: strengthData.four?.toString() || '', 
            fee: feeData.currentYearFourFee?.toString() || '' 
          },
          'V': { 
            strength: strengthData.five?.toString() || '', 
            fee: feeData.currentYearFiveFee?.toString() || '' 
          },
          'VI': { 
            strength: strengthData.six?.toString() || '', 
            fee: feeData.currentYearSixFee?.toString() || '' 
          },
          'VII': { 
            strength: strengthData.seven?.toString() || '', 
            fee: feeData.currentYearSevenFee?.toString() || '' 
          },
          'VIII': { 
            strength: strengthData.eight?.toString() || '', 
            fee: feeData.currentYearEightFee?.toString() || '' 
          },
          'IX': { 
            strength: strengthData.nine?.toString() || '', 
            fee: feeData.currentYearNineFee?.toString() || '' 
          },
          'X': { 
            strength: strengthData.ten?.toString() || '', 
            fee: feeData.currentYearTenFee?.toString() || '' 
          },
          'XI': { 
            strength: strengthData.eleven?.toString() || '', 
            fee: feeData.currentYearElevenFee?.toString() || '' 
          },
          'XII': { 
            strength: strengthData.twelve?.toString() || '', 
            fee: feeData.currentYearTwelveFee?.toString() || '' 
          }
        });
  
        setFutureFees({
          'LKG': {
            fee2025: feeData.futureYear1LkgFee?.toString() || '',
            fee2026: feeData.futureYear2LkgFee?.toString() || ''
          },
          'UKG': {
            fee2025: feeData.futureYear1UkgFee?.toString() || '',
            fee2026: feeData.futureYear2UkgFee?.toString() || ''
          },
          'I': {
            fee2025: feeData.futureYear1FirstFee?.toString() || '',
            fee2026: feeData.futureYear2FirstFee?.toString() || ''
          },
          'II': {
            fee2025: feeData.futureYear1SecondFee?.toString() || '',
            fee2026: feeData.futureYear2SecondFee?.toString() || ''
          },
          'III': {
            fee2025: feeData.futureYear1ThirdFee?.toString() || '',
            fee2026: feeData.futureYear2ThirdFee?.toString() || ''
          },
          'IV': {
            fee2025: feeData.futureYear1FourFee?.toString() || '',
            fee2026: feeData.futureYear2FourFee?.toString() || ''
          },
          'V': {
            fee2025: feeData.futureYear1FiveFee?.toString() || '',
            fee2026: feeData.futureYear2FiveFee?.toString() || ''
          },
          'VI': {
            fee2025: feeData.futureYear1SixFee?.toString() || '',
            fee2026: feeData.futureYear2SixFee?.toString() || ''
          },
          'VII': {
            fee2025: feeData.futureYear1SevenFee?.toString() || '',
            fee2026: feeData.futureYear2SevenFee?.toString() || ''
          },
          'VIII': {
            fee2025: feeData.futureYear1EightFee?.toString() || '',
            fee2026: feeData.futureYear2EightFee?.toString() || ''
          },
          'IX': {
            fee2025: feeData.futureYear1NineFee?.toString() || '',
            fee2026: feeData.futureYear2NineFee?.toString() || ''
          },
          'X': {
            fee2025: feeData.futureYear1TenFee?.toString() || '',
            fee2026: feeData.futureYear2TenFee?.toString() || ''
          },
          'XI': {
            fee2025: feeData.futureYear1ElevenFee?.toString() || '',
            fee2026: feeData.futureYear2ElevenFee?.toString() || ''
          },
          'XII': {
            fee2025: feeData.futureYear1TwelveFee?.toString() || '',
            fee2026: feeData.futureYear2TwelveFee?.toString() || ''
          }
        });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    // Create a custom formatted version for PDF
    const pdfContent = `
      <div id="pdf-content" style="padding: 20px; max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="text-align: right; margin-bottom: 10px;">
          <p style="margin: 0;">School Code: ${schoolDetails.code}</p>
         
        </div>
   
        <div style="margin-bottom: 20px;">
           <p style="white-space: pre-wrap; margin: 0;">${schoolDetails.name}</p>
          <p style="white-space: pre-wrap; margin: 0;">${schoolDetails.address}</p>
        </div>
   
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0 0 10px 0; font-size: 18px;">PROCEEDINGS OF THE TAMIL NADU PRIVATE SCHOOLS</h1>
          <h2 style="margin: 0 0 10px 0; font-size: 18px;">FEE DETERMINATION COMMITTEE</h2>
          <p style="margin: 0;">Dated: ${date}</p>
        </div>
   
        <div style="margin-bottom: 30px;">
          <h2 style="text-align: center; margin-bottom: 20px; font-size: 16px;">ORDER</h2>
          <p style="text-align: justify; margin-bottom: 10px;">1. In the Judgement reported in 2010(4) CTC 353, it is held in Paragraph 20(b) and (c) as follows:</p>
          <div style="margin-left: 20px;">
            <p style="text-align: justify; margin-bottom: 10px;">(b) "After the receipt of the proposal from the concerned Institution, the Committee has to verify as to whether the fee proposed by the Private School is Justified and it does not amount to profiteering or charging of exorbitant fee"</p>
            <p style="text-align: justify; margin-bottom: 10px;">(c) "In case the Committee is of the view that the fee structure proposed by the institution appears to be correct, taking note of the various facilities provided and that there was no profiteering or collection of exorbitant fee under the guise of capitation fee, it has to approve the fee structure"</p>
          </div>
          <p style="text-align: justify;">2. The Committee examined the application along with the records submitted with due care and caution. On such examination the Committee is satisfied that the fee structure submitted by the school does not amount to profiteering or charging exorbitant fee. Therefore the committee is approving and determining the fee structure as proposed by the school</p>
        </div>
   
        <div style="margin-bottom: 30px;">
          <h3 style="margin-bottom: 15px; font-size: 16px;">Fee structure for 2024-25 (Approval)</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background-color: #f3f4f6;">
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">Class</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">Student strength</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">Annual Fee (Rs.)</th>
            </tr>
            ${Object.entries(feeStructure2024).map(([className, values]) => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">${className}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">${values.strength}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">${values.fee}</td>
              </tr>
            `).join('')}
          </table>
   
          <h3 style="margin-bottom: 15px; font-size: 16px;">Fee Structure for 2025-26 & 2026-27</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background-color: #f3f4f6;">
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">Class</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">2025-26 Fees (Rs.)</th>
              <th style="border: 1px solid #000; padding: 8px; text-align: center;">2026-27 Fees (Rs.)</th>
            </tr>
            ${Object.entries(futureFees).map(([className, values]) => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">${className}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">${values.fee2025}</td>
                <td style="border: 1px solid #000; padding: 8px; text-align: center;">${values.fee2026}</td>
              </tr>
            `).join('')}
          </table>
        </div>
   
        <div style="margin-bottom: 60px; page-break-inside: avoid;">
          <p style="text-align: justify; margin-bottom: 80px;">
            3. The School in question is directed to have this order affixed on the notice board of 
            the school for the information of the students and parents etc.,
          </p>
   


<div style="page-break-inside: avoid; margin-top: 80px;">
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 60px; margin-bottom: 60px;">
    <div style="text-align: center;">
      <div style="border-top: 1px solid #000; padding-top: 12px; margin: 0 auto; width: 250px;">
        <p style="margin: 0; font-size: 14px;">Chairman</p>
      </div>
    </div>
    <div style="text-align: center;">
      <div style="border-top: 1px solid #000; padding-top: 12px; margin: 0 auto; width: 250px;">
        <p style="margin: 0; font-size: 14px;">Member</p>
      </div>
    </div>
    <div style="text-align: center;">
      <div style="border-top: 1px solid #000; padding-top: 12px; margin: 0 auto; width: 250px;">
        <p style="margin: 0; font-size: 14px;">School Education Department</p>
        <p style="margin: 0; font-size: 14px;">Member - Secretary</p>
      </div>
    </div>
    <div style="text-align: center;">
      <div style="border-top: 1px solid #000; padding-top: 12px; margin: 0 auto; width: 250px;">
        <p style="margin: 0; font-size: 14px;">Member</p>
      </div>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 60px;">
    <div style="border-top: 1px solid #000; padding-top: 12px; margin: 0 auto; width: 250px;">
      <p style="margin: 0; font-size: 14px;">Public Works Department</p>
      <p style="margin: 0; font-size: 14px;">Member</p>
    </div>
  </div>
</div>
        </div>
      </div>
    `;
   
    // Create a temporary container
    const container = document.createElement('div');
    container.innerHTML = pdfContent;
    document.body.appendChild(container);
   
    // PDF options
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `approval_format_${date || 'undated'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };
   
    // Generate PDF
    window.html2pdf()
      .set(opt)
      .from(container)
      .save()
      .then(() => {
        document.body.removeChild(container);
      });
   };
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header Controls */}
          <div className="border-b border-gray-200 p-4 flex flex-col sm:flex-row items-center justify-between">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-gray-600 hover:text-blue-600 mb-4 sm:mb-0"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={downloadPDF}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Download className="h-5 w-5 mr-2" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div id="approval-form" className="max-w-4xl mx-auto">
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm">School Code: {schoolDetails.code}</p>
                  
                </div>
                <div className="mb-4 text-left">
                <p className="whitespace-pre-wrap">{schoolDetails.name}</p>
                  <p className="whitespace-pre-wrap">{schoolDetails.address}</p>
                </div>
                <h1 className="text-xl font-bold mb-2">PROCEEDINGS OF THE TAMIL NADU PRIVATE SCHOOLS</h1>
                <h2 className="text-xl font-bold mb-4">FEE DETERMINATION COMMITTEE</h2>
                <div className="flex justify-center items-center gap-2 mb-2">
                  <span>Dated: {date}</span>
                </div>
              </div>

              {/* Order Content */}
              <div className="mb-8">
                <h2 className="text-lg font-bold text-center mb-6">ORDER</h2>
                <div className="space-y-4">
                  <p className="text-justify">1. In the Judgement reported in 2010(4) CTC 353, it is held in Paragraph 20(b) and (c) as follows:</p>
                  <div className="ml-8">
                    <p className="mb-4 text-justify">(b) "After the receipt of the proposal from the concerned Institution, the Committee has to verify as to whether the fee proposed by the Private School is Justified and it does not amount to profiteering or charging of exorbitant fee"</p>
                    <p className="text-justify">(c) "In case the Committee is of the view that the fee structure proposed by the institution appears to be correct, taking note of the various facilities provided and that there was no profiteering or collection of exorbitant fee under the guise of capitation fee, it has to approve the fee structure"</p>
                  </div>
                  <p className="mt-4 text-justify">2. The Committee examined the application along with the records submitted with due care and caution. On such examination the Committee is satisfied that the fee structure submitted by the school does not amount to profiteering or charging exorbitant fee. Therefore the committee is approving and determining the fee structure as proposed by the school</p>
                </div>
              </div>

              {/* Fee Tables */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Fee structure for 2024-25 (Approval)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 mb-8">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-center">Class</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Student strength</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Annual Fee (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(feeStructure2024).map(([className, values]) => (
                        <tr key={className}>
                          <td className="border border-gray-300 px-4 py-2 text-center">{className}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{values.strength}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{values.fee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-semibold mb-4">Fee Structure for 2025-26 & 2026-27</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 mb-8">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-center">Class</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">2025-26 Fees (Rs.)</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">2026-27 Fees (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(futureFees).map(([className, values]) => (
                        <tr key={className}>
                          <td className="border border-gray-300 px-4 py-2 text-center">{className}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{values.fee2025}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{values.fee2026}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

   {/* Direction Text and Signature Section Combined */}
<div className="mb-8">
  <p className="text-justify mb-16">
    3. The School in question is directed to have this order affixed on the notice board of
    the school for the information of the students and parents etc.,
  </p>

  {/* Signature Section - Removed pageBreakBefore */}
  <div className="mt-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
      <div className="text-center">
        <div className="mt-8 border-t border-black pt-2">
          <p className="text-gray-600">Chairman</p>
        </div>
      </div>

      <div className="text-center">
        <div className="mt-8 border-t border-black pt-2">
          <p className="text-gray-600">Member</p>
        </div>
      </div>

      <div className="text-center">
        <div className="mt-8 border-t border-black pt-2">
          <p className="text-gray-600">School Education Department</p>
          <p className="text-gray-600">Member - Secretary</p>
        </div>
      </div>

      <div className="text-center">
        <div className="mt-8 border-t border-black pt-2">
          <p className="text-gray-600">Member</p>
        </div>
      </div>
    </div>

    <div className="text-center mt-12">
      <div className="mt-8 border-t border-black pt-2 max-w-xs mx-auto">
        <p className="text-gray-600">Public Works Department</p>
        <p className="text-gray-600">Member</p>
      </div>
    </div>
  </div>
</div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalFormat;