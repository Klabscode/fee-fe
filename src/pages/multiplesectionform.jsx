import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import expenditureHeads from '../data.json';

// SVG Icons
const ChevronLeftIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
   <path d="M15 18l-6-6 6-6" />
 </svg>
);

const PlusIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
   <line x1="12" y1="5" x2="12" y2="19" />
   <line x1="5" y1="12" x2="19" y2="12" />
 </svg>
);

const TrashIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
   <path d="M3 6h18" />
   <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
   <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
 </svg>
);

const MultipleSectionForm = () => {
 const navigate = useNavigate();
 const { id } = useParams();
 const [loading, setLoading] = useState(true);
 const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
 const emptySection = {
   sectionName: '',
   strength: '',
   fee: ''
 };

 const initialForm = {
   schoolName: '',
   address: '',
   email: '',
   localityType: '',
   locality: '',
   correspondantOrPrincipal: 'principal',
   correspondantOrPrincipalName: '',
   classesFunctioning: '',
   previousFeeCommitteeOrderValidityFromYear: '',
   previousFeeCommitteeOrderValidityToYear: '',
   authorisedPersonDesignation: '',
   authorisedPersonName: '',
   mobileNumber1: '',
   mobileNumber2: '',
   individualOrMultiple: 'Multiple',
   sections: [{ ...emptySection }]
 };

 const [form, setForm] = useState(initialForm);
 const [totalStrength, setTotalStrength] = useState(0);

 useEffect(() => {
   const fetchFormData = async () => {
     try {
       setLoading(true);
       const headers = { 'Authorization': loginResponse?.output?.token };
       const response = await api.get('/getFormById', {
         params: { id },
         headers
       });
       if (response.data?.results) {
         const formData = response.data.results;
         setForm(prev => ({
           ...prev,
           ...formData,
           sections: formData.sections || [{ ...emptySection }]
         }));
         setTotalStrength(formData.studentStrengthMultiple?.total || 0);
       }
     } catch (error) {
       console.error('Error fetching form data:', error);
     } finally {
       setLoading(false);
     }
   };
   if (id) {
     fetchFormData();
   }
 }, [id]);

 const handleSectionChange = (index, e) => {
   const { name, value } = e.target;
   setForm(prev => {
     const newSections = [...prev.sections];
     newSections[index] = {
       ...newSections[index],
       [name]: value
     };
     if (name === 'strength') {
       const newTotal = newSections.reduce((sum, section) => sum + (parseInt(section.strength) || 0), 0);
       setTotalStrength(newTotal);
     }
     return {
       ...prev,
       sections: newSections
     };
   });
 };

 const addSection = () => {
   setForm(prev => ({
     ...prev,
     sections: [...prev.sections, { ...emptySection }]
   }));
 };

 const removeSection = (index) => {
   if (form.sections.length > 1) {
     setForm(prev => {
       const newSections = prev.sections.filter((_, i) => i !== index);
       const newTotal = newSections.reduce((sum, section) => sum + (parseInt(section.strength) || 0), 0);
       setTotalStrength(newTotal);
       return {
         ...prev,
         sections: newSections
       };
     });
   }
 };

 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     const headers = { 'Authorization': loginResponse?.output?.token };
     const response = await api.post('/submitForm', { ...form }, { headers });
     if (response.data?.success) {
       console.log('Form submitted successfully');
       navigate('/forms');
     }
   } catch (error) {
     console.error('Error submitting form:', error);
   }
 };

 if (loading) {
   return (
     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
       <div className="text-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
         <p className="mt-4 text-gray-600">Loading form data...</p>
       </div>
     </div>
   );
 }

 return (
   <div className="min-h-screen bg-gray-50 py-6">
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="mb-6">
         <button
           onClick={() => navigate(-1)}
           className="flex items-center text-gray-600 hover:text-gray-900"
         >
           <ChevronLeftIcon /> Back
         </button>
       </div>

       <div className="mb-6 bg-white rounded-lg shadow">
         <div className="border-b border-gray-200 p-4">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold text-gray-900">School Information</h2>
             <div className="text-sm font-medium text-gray-500">
               School Code: <span className="text-gray-900">222</span>
             </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <p className="text-sm font-medium text-gray-500">School Name</p>
               <p className="mt-1 text-sm text-gray-900">{form.schoolName}</p>
             </div>
             <div>
               <p className="text-sm font-medium text-gray-500">Address</p>
               <p className="mt-1 text-sm text-gray-900">{form.address}</p>
             </div>
             <div>
               <p className="text-sm font-medium text-gray-500">Email ID</p>
               <p className="mt-1 text-sm text-gray-900">{form.email}</p>
             </div>
             <div>
               <p className="text-sm font-medium text-gray-500">Total Student Strength</p>
               <p className="mt-1 text-sm font-bold text-blue-600">{totalStrength}</p>
             </div>
           </div>
         </div>
       </div>

       <form onSubmit={handleSubmit} className="space-y-6">
         <div className="bg-white rounded-lg shadow">
           <div className="p-6">
             <h2 className="text-lg font-semibold text-gray-900 mb-4">Account (PART-1)</h2>
             <h3 className="text-md font-medium text-gray-700 mb-4">A. Salary and Allowances</h3>
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200">
                 <thead>
                   <tr>
                     <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HEAD OF EXPENDITURE</th>
                     <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenditure of the previous Academic Year</th>
                     <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allowed</th>
                     <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">If not allowed/reduced-Reason</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white divide-y divide-gray-200">
                   {expenditureHeads.expenditureHeads.map((head, index) => (
                     <tr key={index}>
                       <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{head}</td>
                       <td className="px-4 py-2 whitespace-nowrap">
                         <input 
                           type="text" 
                           name={`expenditure_${index}`}
                           className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm text-sm"
                         />
                       </td>
                       <td className="px-4 py-2 whitespace-nowrap">
                         <input 
                           type="text" 
                           name={`allowed_${index}`}
                           className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm text-sm"
                         />
                       </td>
                       <td className="px-4 py-2 whitespace-nowrap">
                         <input 
                           type="text" 
                           name={`reason_${index}`}
                           className="w-full px-3 py-2 bg-white border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md shadow-sm text-sm"
                         />
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>

             <div className="mt-6 flex justify-end">
               <button
                 type="submit"
                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                 Save Changes
               </button>
             </div>
           </div>
         </div>
       </form>
     </div>
   </div>
 );
};

export default MultipleSectionForm;