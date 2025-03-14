import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Account7Form = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
  const [attendedBy, setAttendedBy] = useState('');
  const meanValue = localStorage.getItem('meanValue');
  const [form, setForm] = useState({
    studentStrength: {
      "LKG": { strength: '', fee: '', income: '' },
      "UKG": { strength: '', fee: '', income: '' },
      "I": { strength: '', fee: '', income: '' },
      "II": { strength: '', fee: '', income: '' },
      "III": { strength: '', fee: '', income: '' },
      "IV": { strength: '', fee: '', income: '' },
      "V": { strength: '', fee: '', income: '' },
      "VI": { strength: '', fee: '', income: '' },
      "VII": { strength: '', fee: '', income: '' },
      "VIII": { strength: '', fee: '', income: '' },
      "IX": { strength: '', fee: '', income: '' },
      "X": { strength: '', fee: '', income: '' },
      "XI": { strength: '', fee: '', income: '' },
      "XII": { strength: '', fee: '', income: '' }
    },
    futureFees: {
      "LKG": { fee2025: '', fee2026: '' },
      "UKG": { fee2025: '', fee2026: '' },
      "I": { fee2025: '', fee2026: '' },
      "II": { fee2025: '', fee2026: '' },
      "III": { fee2025: '', fee2026: '' },
      "IV": { fee2025: '', fee2026: '' },
      "V": { fee2025: '', fee2026: '' },
      "VI": { fee2025: '', fee2026: '' },
      "VII": { fee2025: '', fee2026: '' },
      "VIII": { fee2025: '', fee2026: '' },
      "IX": { fee2025: '', fee2026: '' },
      "X": { fee2025: '', fee2026: '' },
      "XI": { fee2025: '', fee2026: '' },
      "XII": { fee2025: '', fee2026: '' }
    },
    previousFees: {
      "LKG": { proposed: '', previous: '' },
      "UKG": { proposed: '', previous: '' },
      "I": { proposed: '', previous: '' },
      "II": { proposed: '', previous: '' },
      "III": { proposed: '', previous: '' },
      "IV": { proposed: '', previous: '' },
      "V": { proposed: '', previous: '' },
      "VI": { proposed: '', previous: '' },
      "VII": { proposed: '', previous: '' },
      "VIII": { proposed: '', previous: '' },
      "IX": { proposed: '', previous: '' },
      "X": { proposed: '', previous: '' },
      "XI": { proposed: '', previous: '' },
      "XII": { proposed: '', previous: '' }
    }
  });
  const fetchPreviousFeeData = async () => {
    try {
      const feeFormId = localStorage.getItem('feeFormId');
      const headers = {
        'Authorization': loginResponse?.output?.token,
        'Content-Type': 'application/json'
      };
  
      const response = await api.get(`/getFormById?id=${feeFormId}`, { headers });
  
      if (response.data?.results) {
        const data = response.data.results;
        setForm(prev => ({
          ...prev,
          previousFees: {
            "LKG": { 
              proposed: data.proposedFeeIndividual?.lkg || '',
              previous: data.previousFeeCommitteeOrderFeeIndividual?.lkg || ''
            },
            "UKG": { 
              proposed: data.proposedFeeIndividual?.ukg || '',
              previous: data.previousFeeCommitteeOrderFeeIndividual?.ukg || ''
            },
            // Continue for all classes
          }
        }));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const fetchStudentStrength = async () => {
    try {
      const feeFormId = localStorage.getItem('feeFormId');
      const headers = {
        'Authorization': loginResponse?.output?.token,
        'Content-Type': 'application/json'
      };
  
      const response = await api.get(`/getFeeFormByFeeformId`, {
        params: { feeformId: feeFormId },
        headers
      });
  
      if (response.data?.results) {
        const data = response.data.results;
        
        setForm(prevForm => ({
          ...prevForm,
          studentStrength: {
            "LKG": { ...prevForm.studentStrength.LKG, strength: data.lkgStrength?.toString() || '' },
            "UKG": { ...prevForm.studentStrength.UKG, strength: data.ukgStrength?.toString() || '' },
            "I": { ...prevForm.studentStrength.I, strength: data.firstStrength?.toString() || '' },
            "II": { ...prevForm.studentStrength.II, strength: data.secondStrength?.toString() || '' },
            "III": { ...prevForm.studentStrength.III, strength: data.thirdStrength?.toString() || '' },
            "IV": { ...prevForm.studentStrength.IV, strength: data.fourthStrength?.toString() || '' },
            "V": { ...prevForm.studentStrength.V, strength: data.fifthStrength?.toString() || '' },
            "VI": { ...prevForm.studentStrength.VI, strength: data.sixthStrength?.toString() || '' },
            "VII": { ...prevForm.studentStrength.VII, strength: data.seventhStrength?.toString() || '' },
            "VIII": { ...prevForm.studentStrength.VIII, strength: data.eighthStrength?.toString() || '' },
            "IX": { ...prevForm.studentStrength.IX, strength: data.ninthStrength?.toString() || '' },
            "X": { ...prevForm.studentStrength.X, strength: data.tenthStrength?.toString() || '' },
            "XI": { ...prevForm.studentStrength.XI, strength: data.eleventhStrength?.toString() || '' },
            "XII": { ...prevForm.studentStrength.XII, strength: data.twelfthStrength?.toString() || '' }
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching student strength:', error);
    }
  };
  
  const [totals, setTotals] = useState({
    totalStudents: 0,
    totalIncome: 0,
    totalExpenses: parseFloat(localStorage.getItem('grandTotalAllowed(I-VI)')) || '',
    difference: 0
  });

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setInitialLoading(true);
        const feeFormId = localStorage.getItem('feeFormId');
        const allocatedTo = loginResponse?.output?.data?.id;
        const headers = {
          'Authorization': loginResponse?.output?.token,
          'Content-Type': 'application/json'
        };
    
        // First API call for previous fee data
        const prevFeesResponse = await api.get(`/getFormById?id=${feeFormId}`, { headers });
    
        if (prevFeesResponse.data?.results) {
          const prevData = prevFeesResponse.data.results;
          setForm(prev => ({
            ...prev,
            previousFees: {
              "LKG": { 
                proposed: prevData.proposedFeeIndividual?.lkg || '',
                previous: prevData.previousFeeCommitteeOrderFeeIndividual?.lkg || ''
              },
              "UKG": { 
                proposed: prevData.proposedFeeIndividual?.ukg || '',
                previous: prevData.previousFeeCommitteeOrderFeeIndividual?.ukg || ''
              },
              "I": { 
                proposed: prevData.proposedFeeIndividual?.one || '',
                previous: prevData.previousFeeCommitteeOrderFeeIndividual?.one || ''
              },
              "II": { 
                proposed: prevData.proposedFeeIndividual?.two || '',
                previous: prevData.previousFeeCommitteeOrderFeeIndividual?.two || ''
              },
              "III": { 
                proposed: prevData.proposedFeeIndividual?.three || '',
                previous: prevData.previousFeeCommitteeOrderFeeIndividual?.three || ''
              },
              "IV": { 
                proposed: prevData.proposedFeeIndividual?.four || '',
                previous: prevData.previousFeeCommitteeOrderFeeIndividual?.four || ''
              },
              "V": { 
                proposed: prevData.proposedFeeIndividual?.five || '',
                previous: prevData.previousFeeCommitteeOrderFeeIndividual?.five || ''
              },
              "VI": { 
                proposed: prevData.proposedFeeIndividual?.six || '',
                previous: prevData.previousFeeCommitteeOrderFeeIndividual?.six || ''
              },
              "VII": { 
                proposed: prevData.proposedFeeIndividual?.seven || '',
                previous: prevData.previousFeeCommitteeOrderFeeIndividual?.seven || ''
              },
              "VIII": { 
                proposed: prevData.proposedFeeIndividual?.eight || '',
                previous: prevData.previousFeeCommitteeOrderFeeIndividual?.eight || ''
              },
              "IX": { 
                proposed: prevData.proposedFeeIndividual?.nine || '',
                previous: prevData.previousFeeCommitteeOrderFeeIndividual?.nine || ''
              },
              "X": { 
                proposed: prevData.proposedFeeIndividual?.ten || '',
                previous: prevData.previousFeeCommitteeOrderFeeIndividual?.ten || ''
              },
              "XI": { 
                proposed: prevData.proposedFeeIndividual?.eleven || '',
                previous: prevData.previousFeeCommitteeOrderFeeIndividual?.eleven || ''
              },
              "XII": { 
                proposed: prevData.proposedFeeIndividual?.twelve || '',
                previous: prevData.previousFeeCommitteeOrderFeeIndividual?.twelve || ''
              }
            }
          }));
        }
    
        // Fetch student strength data
        const strengthResponse = await api.get('/getFeeFormByFeeformId', {
          params: { feeformId: feeFormId },
          headers
        });
    
        let studentStrengthData = {};
        if (strengthResponse.data?.results) {
          const strengthData = strengthResponse.data.results.studentStrengthIndividual;
          studentStrengthData = {
            "LKG": { strength: strengthData.lkg?.toString() || '' },
            "UKG": { strength: strengthData.ukg?.toString() || '' },
            "I": { strength: strengthData.one?.toString() || '' },
            "II": { strength: strengthData.two?.toString() || '' },
            "III": { strength: strengthData.three?.toString() || '' },
            "IV": { strength: strengthData.four?.toString() || '' },
            "V": { strength: strengthData.five?.toString() || '' },
            "VI": { strength: strengthData.six?.toString() || '' },
            "VII": { strength: strengthData.seven?.toString() || '' },
            "VIII": { strength: strengthData.eight?.toString() || '' },
            "IX": { strength: strengthData.nine?.toString() || '' },
            "X": { strength: strengthData.ten?.toString() || '' },
            "XI": { strength: strengthData.eleven?.toString() || '' },
            "XII": { strength: strengthData.twelve?.toString() || '' }
          };
        }
    
        // Fetch allocated form data
        const response = await api.get('/getAllocatedFormByFeeForm', {
          params: { feeformId: feeFormId, allocatedTo: allocatedTo },
          headers
        });
    
        if (response.data?.results) {
          const data = response.data.results;
          const newForm = {
            studentStrength: {
              "LKG": { 
                strength: studentStrengthData.LKG.strength || '',
                fee: data.currentYearLkgFee?.toString() || '',
                income: data.currentYearLkgIncome?.toString() || ''
              },
              "UKG": { 
                strength: studentStrengthData.UKG.strength || '',
                fee: data.currentYearUkgFee?.toString() || '',
                income: data.currentYearUkgIncome?.toString() || ''
              },
              "I": { 
                strength: studentStrengthData.I.strength || '',
                fee: data.currentYearFirstFee?.toString() || '',
                income: data.currentYearFirstIncome?.toString() || ''
              },
              "II": { 
                strength: studentStrengthData.II.strength || '',
                fee: data.currentYearSecondFee?.toString() || '',
                income: data.currentYearSecondIncome?.toString() || ''
              },
              "III": { 
                strength: studentStrengthData.III.strength || '',
                fee: data.currentYearThirdFee?.toString() || '',
                income: data.currentYearThirdIncome?.toString() || ''
              },
              "IV": { 
                strength: studentStrengthData.IV.strength || '',
                fee: data.currentYearFourFee?.toString() || '',
                income: data.currentYearFourIncome?.toString() || ''
              },
              "V": { 
                strength: studentStrengthData.V.strength || '',
                fee: data.currentYearFiveFee?.toString() || '',
                income: data.currentYearFiveIncome?.toString() || ''
              },
              "VI": { 
                strength: studentStrengthData.VI.strength || '',
                fee: data.currentYearSixFee?.toString() || '',
                income: data.currentYearSixIncome?.toString() || ''
              },
              "VII": { 
                strength: studentStrengthData.VII.strength || '',
                fee: data.currentYearSevenFee?.toString() || '',
                income: data.currentYearSevenIncome?.toString() || ''
              },
              "VIII": { 
                strength: studentStrengthData.VIII.strength || '',
                fee: data.currentYearEightFee?.toString() || '',
                income: data.currentYearEightIncome?.toString() || ''
              },
              "IX": { 
                strength: studentStrengthData.IX.strength || '',
                fee: data.currentYearNineFee?.toString() || '',
                income: data.currentYearNineIncome?.toString() || ''
              },
              "X": { 
                strength: studentStrengthData.X.strength || '',
                fee: data.currentYearTenFee?.toString() || '',
                income: data.currentYearTenIncome?.toString() || ''
              },
              "XI": { 
                strength: studentStrengthData.XI.strength || '',
                fee: data.currentYearElevenFee?.toString() || '',
                income: data.currentYearElevenIncome?.toString() || ''
              },
              "XII": { 
                strength: studentStrengthData.XII.strength || '',
                fee: data.currentYearTwelveFee?.toString() || '',
                income: data.currentYearTwelveIncome?.toString() || ''
              }
            },
            futureFees: {
              "LKG": { 
                fee2025: data.futureYear1LkgFee?.toString() || '',
                fee2026: data.futureYear2LkgFee?.toString() || ''
              },
              "UKG": { 
                fee2025: data.futureYear1UkgFee?.toString() || '',
                fee2026: data.futureYear2UkgFee?.toString() || ''
              },
              "I": { 
                fee2025: data.futureYear1FirstFee?.toString() || '',
                fee2026: data.futureYear2FirstFee?.toString() || ''
              },
              "II": { 
                fee2025: data.futureYear1SecondFee?.toString() || '',
                fee2026: data.futureYear2SecondFee?.toString() || ''
              },
              "III": { 
                fee2025: data.futureYear1ThirdFee?.toString() || '',
                fee2026: data.futureYear2ThirdFee?.toString() || ''
              },
              "IV": { 
                fee2025: data.futureYear1FourFee?.toString() || '',
                fee2026: data.futureYear2FourFee?.toString() || ''
              },
              "V": { 
                fee2025: data.futureYear1FiveFee?.toString() || '',
                fee2026: data.futureYear2FiveFee?.toString() || ''
              },
              "VI": { 
                fee2025: data.futureYear1SixFee?.toString() || '',
                fee2026: data.futureYear2SixFee?.toString() || ''
              },
              "VII": { 
                fee2025: data.futureYear1SevenFee?.toString() || '',
                fee2026: data.futureYear2SevenFee?.toString() || ''
              },
              "VIII": { 
                fee2025: data.futureYear1EightFee?.toString() || '',
                fee2026: data.futureYear2EightFee?.toString() || ''
              },
              "IX": { 
                fee2025: data.futureYear1NineFee?.toString() || '',
                fee2026: data.futureYear2NineFee?.toString() || ''
              },
              "X": { 
                fee2025: data.futureYear1TenFee?.toString() || '',
                fee2026: data.futureYear2TenFee?.toString() || ''
              },
              "XI": { 
                fee2025: data.futureYear1ElevenFee?.toString() || '',
                fee2026: data.futureYear2ElevenFee?.toString() || ''
              },
              "XII": { 
                fee2025: data.futureYear1TwelveFee?.toString() || '',
                fee2026: data.futureYear2TwelveFee?.toString() || ''
              }
            }
          };
    
          setForm(prev => ({
            ...prev,
            studentStrength: newForm.studentStrength,
            futureFees: newForm.futureFees
          }));
          calculateTotals(newForm.studentStrength);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchFormData();
  }, [loginResponse?.output?.token, loginResponse?.output?.data?.id]);

  const calculateTotals = (studentStrength) => {
    let totalStudents = 0;
    let totalIncome = 0;
  
    Object.values(studentStrength).forEach(values => {
      totalStudents += values.strength ? parseInt(values.strength) : 0;
      totalIncome += values.income ? parseInt(values.income) : 0;
    });
  
    const totalExpenses = parseFloat(localStorage.getItem('grandTotalAllowed(I-VI)')) || '';
  
    setTotals({
      totalStudents,
      totalIncome,
      totalExpenses,
      difference: totalIncome ? (totalIncome - totalExpenses) : ''
    });
  };
  const handleStrengthChange = (className, value) => {
    if (value < 0) value = 0;
    value = Math.round(value); // Round the input value
    
    const fee = parseInt(form.studentStrength[className].fee) || 0;
    const income = Math.round(value * fee); // Round the income
  
    const updatedForm = {
      ...form,
      studentStrength: {
        ...form.studentStrength,
        [className]: {
          ...form.studentStrength[className],
          strength: value.toString(),
          income: income.toString()
        }
      }
    };
  
    setForm(updatedForm);
    calculateTotals(updatedForm.studentStrength);
  };
  
  const handleFeeChange = (className, value) => {
    if (value < 0) value = 0;
    value = Math.round(value); // Round the input value
    
    const strength = parseInt(form.studentStrength[className].strength) || 0;
    const income = Math.round(strength * value); // Round the income
    
    // Calculate future fees with 10% increase each year, rounded
    const fee2025 = Math.round(value * 1.10);
    const fee2026 = Math.round(fee2025 * 1.10);
    
    const updatedForm = {
      ...form,
      studentStrength: {
        ...form.studentStrength,
        [className]: {
          ...form.studentStrength[className],
          fee: value.toString(),
          income: income.toString()
        }
      },
      futureFees: {
        ...form.futureFees,
        [className]: {
          fee2025: fee2025.toString(),
          fee2026: fee2026.toString()
        }
      }
    };
  
    setForm(updatedForm);
    calculateTotals(updatedForm.studentStrength);
  };

  const handleFutureFeeChange = (className, year, value) => {
    if (value < 0) value = 0;  
    setForm(prev => ({
      ...prev,
      futureFees: {
        ...prev.futureFees,
        [className]: {
          ...prev.futureFees[className],
          [year]: value.toString()
        }
      }
    }));
  };
  

  const handlePreviousFeeChange = (className, field, value) => {
    if (value < 0) value = 0;  
    setForm(prev => ({
      ...prev,
      previousFees: {
        ...prev.previousFees,
        [className]: {
          ...prev.previousFees[className],
          [field]: value.toString()
        }
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const feeFormId = localStorage.getItem('feeFormId');
      const allocatedTo = loginResponse?.output?.data?.id;
      
      if (!feeFormId || !allocatedTo) {
        throw new Error('Missing required parameters: ' + 
          (!feeFormId ? 'feeFormId ' : '') + 
          (!allocatedTo ? 'allocatedTo' : '')
        );
      }
  
      const headers = {
        'Authorization': loginResponse?.output?.token,
        'Content-Type': 'application/json'
      };
  
      // Determine status based on difference
      const calculatedStatus = totals.difference >= 0 ? "Approved" : "Objection";
  
      const payload = {
        // Student Strength, Fee, and Income for current year
        currentYearLkgStrength: parseInt(form.studentStrength.LKG.strength) || 0,
        currentYearLkgFee: parseInt(form.studentStrength.LKG.fee) || 0,
        currentYearLkgIncome: parseInt(form.studentStrength.LKG.income) || 0,
        currentYearUkgStrength: parseInt(form.studentStrength.UKG.strength) || 0,
        currentYearUkgFee: parseInt(form.studentStrength.UKG.fee) || 0,
        currentYearUkgIncome: parseInt(form.studentStrength.UKG.income) || 0,
        currentYearFirstStrength: parseInt(form.studentStrength.I.strength) || 0,
        currentYearFirstFee: parseInt(form.studentStrength.I.fee) || 0,
        currentYearFirstIncome: parseInt(form.studentStrength.I.income) || 0,
        currentYearSecondStrength: parseInt(form.studentStrength.II.strength) || 0,
        currentYearSecondFee: parseInt(form.studentStrength.II.fee) || 0,
        currentYearSecondIncome: parseInt(form.studentStrength.II.income) || 0,
        currentYearThirdStrength: parseInt(form.studentStrength.III.strength) || 0,
        currentYearThirdFee: parseInt(form.studentStrength.III.fee) || 0,
        currentYearThirdIncome: parseInt(form.studentStrength.III.income) || 0,
        currentYearFourStrength: parseInt(form.studentStrength.IV.strength) || 0,
        currentYearFourFee: parseInt(form.studentStrength.IV.fee) || 0,
        currentYearFourIncome: parseInt(form.studentStrength.IV.income) || 0,
        currentYearFiveStrength: parseInt(form.studentStrength.V.strength) || 0,
        currentYearFiveFee: parseInt(form.studentStrength.V.fee) || 0,
        currentYearFiveIncome: parseInt(form.studentStrength.V.income) || 0,
        currentYearSixStrength: parseInt(form.studentStrength.VI.strength) || 0,
        currentYearSixFee: parseInt(form.studentStrength.VI.fee) || 0,
        currentYearSixIncome: parseInt(form.studentStrength.VI.income) || 0,
        currentYearSevenStrength: parseInt(form.studentStrength.VII.strength) || 0,
        currentYearSevenFee: parseInt(form.studentStrength.VII.fee) || 0,
        currentYearSevenIncome: parseInt(form.studentStrength.VII.income) || 0,
        currentYearEightStrength: parseInt(form.studentStrength.VIII.strength) || 0,
        currentYearEightFee: parseInt(form.studentStrength.VIII.fee) || 0,
        currentYearEightIncome: parseInt(form.studentStrength.VIII.income) || 0,
        currentYearNineStrength: parseInt(form.studentStrength.IX.strength) || 0,
        currentYearNineFee: parseInt(form.studentStrength.IX.fee) || 0,
        currentYearNineIncome: parseInt(form.studentStrength.IX.income) || 0,
        currentYearTenStrength: parseInt(form.studentStrength.X.strength) || 0,
        currentYearTenFee: parseInt(form.studentStrength.X.fee) || 0,
        currentYearTenIncome: parseInt(form.studentStrength.X.income) || 0,
        currentYearElevenStrength: parseInt(form.studentStrength.XI.strength) || 0,
        currentYearElevenFee: parseInt(form.studentStrength.XI.fee) || 0,
        currentYearElevenIncome: parseInt(form.studentStrength.XI.income) || 0,
        currentYearTwelveStrength: parseInt(form.studentStrength.XII.strength) || 0,
        currentYearTwelveFee: parseInt(form.studentStrength.XII.fee) || 0,
        currentYearTwelveIncome: parseInt(form.studentStrength.XII.income) || 0,
  
        // Total calculations
        currentYearTotalIncome: parseInt(totals.totalIncome) || 0,
        currentYearTotalExpenses: parseInt(totals.totalExpenses) || 0,
        currentYearDifference: parseInt(totals.difference) || 0,
  
        // Future year fees
        futureYear1LkgFee: parseInt(form.futureFees.LKG.fee2025) || 0,
        futureYear2LkgFee: parseInt(form.futureFees.LKG.fee2026) || 0,
        futureYear1UkgFee: parseInt(form.futureFees.UKG.fee2025) || 0,
        futureYear2UkgFee: parseInt(form.futureFees.UKG.fee2026) || 0,
        futureYear1FirstFee: parseInt(form.futureFees.I.fee2025) || 0,
        futureYear2FirstFee: parseInt(form.futureFees.I.fee2026) || 0,
        futureYear1SecondFee: parseInt(form.futureFees.II.fee2025) || 0,
        futureYear2SecondFee: parseInt(form.futureFees.II.fee2026) || 0,
        futureYear1ThirdFee: parseInt(form.futureFees.III.fee2025) || 0,
        futureYear2ThirdFee: parseInt(form.futureFees.III.fee2026) || 0,
        futureYear1FourFee: parseInt(form.futureFees.IV.fee2025) || 0,
        futureYear2FourFee: parseInt(form.futureFees.IV.fee2026) || 0,
        futureYear1FiveFee: parseInt(form.futureFees.V.fee2025) || 0,
        futureYear2FiveFee: parseInt(form.futureFees.V.fee2026) || 0,
        futureYear1SixFee: parseInt(form.futureFees.VI.fee2025) || 0,
        futureYear2SixFee: parseInt(form.futureFees.VI.fee2026) || 0,
        futureYear1SevenFee: parseInt(form.futureFees.VII.fee2025) || 0,
        futureYear2SevenFee: parseInt(form.futureFees.VII.fee2026) || 0,
        futureYear1EightFee: parseInt(form.futureFees.VIII.fee2025) || 0,
        futureYear2EightFee: parseInt(form.futureFees.VIII.fee2026) || 0,
        futureYear1NineFee: parseInt(form.futureFees.IX.fee2025) || 0,
        futureYear2NineFee: parseInt(form.futureFees.IX.fee2026) || 0,
        futureYear1TenFee: parseInt(form.futureFees.X.fee2025) || 0,
        futureYear2TenFee: parseInt(form.futureFees.X.fee2026) || 0,
        futureYear1ElevenFee: parseInt(form.futureFees.XI.fee2025) || 0,
        futureYear2ElevenFee: parseInt(form.futureFees.XI.fee2026) || 0,
        futureYear1TwelveFee: parseInt(form.futureFees.XII.fee2025) || 0,
        futureYear2TwelveFee: parseInt(form.futureFees.XII.fee2026) || 0,
  
        // Previous and proposed fees
        proposedFeeLkg: parseInt(form.previousFees.LKG.proposed) || 0,
        previousOrderFeeLkg: parseInt(form.previousFees.LKG.previous) || 0,
        proposedFeeUkg: parseInt(form.previousFees.UKG.proposed) || 0,
        previousOrderFeeUkg: parseInt(form.previousFees.UKG.previous) || 0,
        proposedFeeFirst: parseInt(form.previousFees.I.proposed) || 0,
        previousOrderFeeFirst: parseInt(form.previousFees.I.previous) || 0,
        proposedFeeSecond: parseInt(form.previousFees.II.proposed) || 0,
        previousOrderFeeSecond: parseInt(form.previousFees.II.previous) || 0,
        proposedFeeThird: parseInt(form.previousFees.III.proposed) || 0,
        previousOrderFeeThird: parseInt(form.previousFees.III.previous) || 0,
        proposedFeeFour: parseInt(form.previousFees.IV.proposed) || 0,
        previousOrderFeeFour: parseInt(form.previousFees.IV.previous) || 0,
        proposedFeeFive: parseInt(form.previousFees.V.proposed) || 0,
        previousOrderFeeFive: parseInt(form.previousFees.V.previous) || 0,
        proposedFeeSix: parseInt(form.previousFees.VI.proposed) || 0,
        previousOrderFeeSix: parseInt(form.previousFees.VI.previous) || 0,
        proposedFeeSeven: parseInt(form.previousFees.VII.proposed) || 0,
        previousOrderFeeSeven: parseInt(form.previousFees.VII.previous) || 0,
        proposedFeeEight: parseInt(form.previousFees.VIII.proposed) || 0,
        previousOrderFeeEight: parseInt(form.previousFees.VIII.previous) || 0,
        proposedFeeNine: parseInt(form.previousFees.IX.proposed) || 0,
        previousOrderFeeNine: parseInt(form.previousFees.IX.previous) || 0,
        proposedFeeTen: parseInt(form.previousFees.X.proposed) || 0,
        previousOrderFeeTen: parseInt(form.previousFees.X.previous) || 0,
        proposedFeeEleven: parseInt(form.previousFees.XI.proposed) || 0,
        previousOrderFeeEleven: parseInt(form.previousFees.XI.previous) || 0,
        proposedFeeTwelve: parseInt(form.previousFees.XII.proposed) || 0,
        previousOrderFeeTwelve: parseInt(form.previousFees.XII.previous) || 0,
  
        account7: "Completed",
        AttendedBy: attendedBy,
        status: calculatedStatus  // Using the calculated status here
      };
  
      console.log('Request Details:', {
        url: `/editAllocateForm?feeformId=${feeFormId}&allocatedTo=${allocatedTo}`,
        headers: headers,
        payload: payload
      });
  
      const response = await api.put(
        `/editAllocateForm?feeformId=${feeFormId}&allocatedTo=${allocatedTo}`,
        payload,
        {
          headers: headers,
          validateStatus: null
        }
      );
  
      console.log('API Response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
  
      if (response.status === 200) {
        alert("Success");
        
        // Navigate based on the same condition
        if (totals.difference >= 0) {
          navigate('/objection');
        } else {
          navigate('/approve');
        }
      } else {
        throw new Error(
          response.data?.message || 
          `API Error: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error('Form Submission Error:', {
        message: error.message,
        response: {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        },
        request: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });
  
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Failed to save data. Please try again.';
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
if (initialLoading) {
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
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-4 flex items-center">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-blue-600">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-900">2024-25 Fee Structure</h1>
          </div>
          <div className="p-6">
       

          <div className="fixed top-20 right-8 bg-white p-4 rounded-lg shadow-md border border-gray-300">
  <p className="text-sm font-semibold mb-1">Mean Value</p>
  <p className="text-lg font-bold">{meanValue}</p>
</div>
            {/* Current Year Section */}
            <table className="w-full border-collapse border border-gray-300 mb-8">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2">Class</th>
                  <th className="border border-gray-300 px-4 py-2">Student's strength</th>
                  <th className="border border-gray-300 px-4 py-2">2024-25 Fee Rs.</th>
                  <th className="border border-gray-300 px-4 py-2">Income</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(form.studentStrength).map(([className, values]) => (
                  <tr key={className}>
                    <td className="border border-gray-300 px-4 py-2">{className}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={values.strength}
                        onChange={(e) => handleStrengthChange(className, e.target.value)}
                        className="w-full p-1 text-center"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="number"
                        value={values.fee}
                        onChange={(e) => handleFeeChange(className, e.target.value)}
                        className="w-full p-1 text-center"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
  {values.income}
</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="border border-gray-300 px-4 py-2">Total</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalStudents}</td>
                  <td className="border border-gray-300 px-4 py-2"></td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{totals.totalIncome}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Total Income</td>
                  <td className="border border-gray-300 px-4 py-2" colSpan="3">{totals.totalIncome}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Total Expenses</td>
                  <td className="border border-gray-300 px-4 py-2" colSpan="3">{totals.totalExpenses}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Difference</td>
                  <td className="border border-gray-300 px-4 py-2" colSpan="3">{totals.difference}</td>
                </tr>
              </tbody>
            </table>

            {/* Future Fee Structure Section */}
{/* Future Fee Structure Section */}
<h2 className="text-lg font-semibold mb-4">Fee Structure for 2025-26 to 2026-27</h2>
<table className="w-full border-collapse border border-gray-300 mb-8">
  <thead>
    <tr className="bg-gray-50">
      <th className="border border-gray-300 px-4 py-2">Class</th>
      <th className="border border-gray-300 px-4 py-2">2025-26 Fee (Rs.)</th>
      <th className="border border-gray-300 px-4 py-2">2026-27 Fee (Rs.)</th>
    </tr>
  </thead>
  <tbody>
    {Object.entries(form.futureFees).map(([className, values]) => (
      <tr key={className}>
        <td className="border border-gray-300 px-4 py-2">{className}</td>
        <td className="border border-gray-300 px-4 py-2 text-center">
          {values.fee2025}
        </td>
        <td className="border border-gray-300 px-4 py-2 text-center">
          {values.fee2026}
        </td>
      </tr>
    ))}
  </tbody>
</table>

            {/* Previous Year Fee Section */}
 {/* Previous Year Fee Section */}
<h2 className="text-lg font-semibold mb-4">Previous Year Details</h2>
<table className="w-full border-collapse border border-gray-300 mb-8">
  <thead>
    <tr className="bg-gray-50">
      <th className="border border-gray-300 px-4 py-2">Class</th>
      <th className="border border-gray-300 px-4 py-2">Proposed Fee 2023-24</th>
      <th className="border border-gray-300 px-4 py-2">Previous Year Order Fee - 2022-2023</th>
    </tr>
  </thead>
  <tbody>
    {Object.entries(form.previousFees).map(([className, values]) => (
      <tr key={className}>
        <td className="border border-gray-300 px-4 py-2">{className}</td>
        <td className="border border-gray-300 px-4 py-2 text-center">
          {values.proposed}
        </td>
        <td className="border border-gray-300 px-4 py-2 text-center">
          {values.previous}
        </td>
      </tr>
    ))}
  </tbody>
</table>
{/* Add the new Attended By section here */}

<div className="mb-6 w-1/2"> {/* Changed from w-full to w-1/2 */}
  <label htmlFor="attendedBy" className="block text-sm font-medium text-gray-700 mb-2">
    Attended By *
  </label>
  <input
    type="text"
    id="attendedBy"
    value={attendedBy}
    onChange={(e) => setAttendedBy(e.target.value)}
    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
    placeholder="Enter your name"
    required
  />
</div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account7Form;