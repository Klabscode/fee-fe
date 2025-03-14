import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import AccountOneFormat from './objection1';
import AccountTwoFormat from './objection2';
import AccountThreeFormat from './objection3';
import AccountFourFormat from './objection4';
import AccountFiveFormat from './objection5';
import AccountSixFormat from './objection6';
import AccountSevenFormat from './objection7';
import api from '../api/api';

const SchoolOrderFormat = () => {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [schoolDetails, setSchoolDetails] = useState({
    code: '',
    name: '',
    address: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const feeFormId = localStorage.getItem('feeFormId');
      const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
      const headers = {
        'Authorization': loginResponse?.output?.token,
        'Content-Type': 'application/json'
      };

      const response = await api.get(`/getFeeFormByFeeformId`, {
        params: { feeformId: feeFormId },
        headers
      });

      if (response.data?.results) {
        const schoolData = response.data.results;
        setSchoolDetails({
          code: schoolData.udiseCode || '',
          name: schoolData.schoolName || '',
          address: schoolData.address || ''
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
    const element = document.getElementById('full-content');
    
    const printStyles = `
      @page {
        size: A4;
        margin: 15mm 10mm;
      }
      
      #full-content {
        max-width: 100%;
        margin: 0;
        background: white;
        padding: 0;
      }
      
      .account-sections > div {
        margin: 0;
        padding: 10px 0;
      }
  
      .account-sections table {
        width: 100%;
        margin: 0;
        border-collapse: collapse;
      }
  
      h2, h3, h4 {
        margin: 10px 0;
      }
  
      .mb-8, .mb-12, .mb-16 {
        margin-bottom: 10px !important;
      }
  
      .p-6 {
        padding: 10px !important;
      }
  
      /* Remove default page breaks */
      * {
        page-break-inside: avoid;
      }
  
      /* Keep tables together */
      table {
        page-break-inside: avoid;
      }
    `;
  
    const style = document.createElement('style');
    style.textContent = printStyles;
    document.head.appendChild(style);
  
    const opt = {
      margin: 0,
      filename: `school_order_format_${date || 'undated'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: element.scrollHeight
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      }
    };
  
    window.html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        document.head.removeChild(style);
      });
  };
  useEffect(() => {
    fetchData();
    const loadHtml2PdfScript = () => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
    };
    loadHtml2PdfScript();
  }, []);

  const orderSectionClasses = "mb-8 max-w-6xl mx-auto text-justify px-6";
  const orderHeadingClasses = "font-semibold mb-4 text-lg";
  const subHeadingClasses = "font-semibold mb-2 text-base";

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          {/* Header Controls */}
          <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={downloadPDF}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Form
            </button>
          </div>

          <div className="p-6">
          <div id="full-content" className="pdf-content bg-white p-6 print:p-0" style={{ minHeight: 'auto' }}>
              {/* Header with School Details */}
              <div className={orderSectionClasses}>
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm">School Code: {schoolDetails.code}</p>
                  <p className="text-sm">2024-2027 FORMAT</p>
                </div>
                
                <div className="mb-6">
                  <p className="whitespace-pre-wrap">{schoolDetails.address}</p>
                </div>

                <div className="text-center mb-12">
                  <h1 className="text-xl font-bold mb-2">PROCEEDINGS OF THE TAMIL NADU PRIVATE SCHOOLS</h1>
                  <h2 className="text-lg font-bold mb-4">FEE DETERMINATION COMMITTEE</h2>
                  <p className="mb-4">Dated: {date}</p>
                </div>

                <div className="mb-8">
                  <h2 className="text-center font-bold text-lg mb-8">ORDER</h2>
                </div>

                <div className="space-y-6">
                  {/* Introduction */}
                  <section id="introduction" className="avoid-break mb-8">
                    <p className="mb-6 text-justify">
                      In the light of the Judgments of the Hon'ble High Court of Madras reported in 2012
                      WLR.489 Lakshmi school case and the unreported judgement dated 25.01.2018 in
                      W.P.38383 of 2015 batch the present guidelines are formulated to be borne in mind in
                      determining the fee structure for the school.
                    </p>
                  </section>

                  {/* Sections A to I */}
                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>A. Development Fund and Surplus Fund</h3>
                    <div className="mb-6 text-justify">
                      <p>“Development Fund” and “Surplus Fund” serve the same purpose. Tamil
Nadu Act states that a “Reasonable Surplus” only must be provided. Concept
of "Development Fund" was dealt with by the Hon’ble Supreme Court of India
in Modern schools case. 1973 Delhi Act concerning the schools in Delhi
provides for generating “Development Fund”. “Development Fund” and
“Surplus Fund” serve the same purpose namely to meet expenses likely to be
incurred in future for the development of the school. As both the funds serve
the same purpose as indicated above, the Committee is of the view that there
is no need to provide both the funds treating them as two components in
determining the fee structure. It is all the more so because Tamil Nadu Act
22/2009 provides only a “Reasonable Surplus”. In this context the Committee
notes that in the Tamil Nadu Act 22/2009 there is no indication as to how the
“Surplus Fund” is to be quantified. However in the Modern School case,
Hon’ble Supreme Court of India fixed the “Development Fund” from 10% to
15%. The Committee carefully went through the Judgment of the Hon’ble
Madras High Court reported in 2012 WLR 489. In Para 153 of that Judgment,
the Hon’ble High Court of Madras, held that in the light of the Judgment of Hon’ble Supreme Court of India in the “Modern
School” case that “all the Unaided Non-Minority Educational Institutions shall
be entitled to Surplus for Development i.e., Village and Town Panchayats at
10%, Municipalities and District Head Quarters at 12.5% and Corporation at
15%”. Following the above decision the Committee has decided to give
“Development Fund” only at the varying rates specified in the Judgement of
the Madras High Court referred to above, treating “Development Fund”and
“Surplus Fund” as overlapping concept.</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>B. Infrastructure Fund</h3>
                    <div className="mb-6 text-justify">
                      <p>Infrastructure fund to be considered in the percentage fixed by the Hon’ble
High Court of Madras. In Para 154 of the Judgment reported in 2012 WLR 489
the Hon’ble High Court of Madras held that for “Infrastructure Grading”, there
shall be an increase in fee – 7 1⁄2% to 10% depending upon on the availability
of the infrastructure of the school. Initially the Committee then in office prior
to 02.07.2020 were allowing 7% under this head. From the academic year
2020 onwards this Committee has been allowing 8%. Taking into account that
there is expansion of the activities of all the schools the Committee is inclined
to allow “Infrastructure Fund” at 9% commencing from the academic year
2022-2023.</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>C. Internet Consideration</h3>
                    <div className="mb-6 text-justify">
                      <p>Internet to be considered on production of relevant documentary proof.</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>D. Examination Expenses</h3>
                    <div className="mb-6 text-justify">
                      <p>This again depends upon the strength of the school. All the students do
not take Board Examinations. It is common knowledge that students from
10th to 12th standard alone appear for Board Examinations. For appearing in
Board Examinations, Examination fee is charged by the Government
Examinations Department. However what every school has been doing in the
past is to project such fee remitted by the school into the Government
account as a component to be taken into account in determining the fee and
such an expenditure was also accepted all along and taken as a
component in determining the fee structure. However the Committee now
realized that such expenditure cannot be at all taken into account as a
component in determining the fee, because, if so done, the entire expenditure
is put on the head of the entire students strength of the school irrespective of
the fact that a substantial number of strength do not appear for Board Examinations at all. Therefore if
this practice is allowed to continue it would amount to burdening the students
not taking Board Examinations with a heavy burden. Therefore from the
academic year 2022-2023 onwards the fee determined by the Committee
would not include the Board Examinations fee to be paid by those students
who take the Board Examinations. In other words, the school is free to collect
the Board Examination fee from each student and remit the same to the
Government’s account. Fee is also remitted by the school into the
Government account under the head “Common Examinations”. Such
“Common Examinations” are conducted only for students from 6th to 9th
standard. Taking note of the fact that the fee remitted by the school for such
examination is comparatively very very low, when compared to “Board
Examination” fee, the Committee decided to take into account the fee remitted
for “Common Examinations” as a component in determining the fee structure.
Therefore excluding the examination fee remitted into the Government
account for Board Examinations, the remaining expenditure is examined on a
case to case basis and the expenditure claimed under this head is arrived, at
,by examining all the records, on a reasonable basis.</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>E. Claims Not Considered</h3>
                    <div className="mb-6 text-justify">
                      <p>Claims under “Christmas gift”, “staff pension”, “incentive for good results”,
“retirement purse”, “ex-gratia”, “workers uniform”, “staff uniform”, “staff
welfare” and “staff insurance” will not be considered, based on the Division
Bench Judgment of the Hon’ble High Court Of Madras dated 25.01.2018 in WP
38383 of 2015 batch, as it was held in that Judgment that the Committee can
reject those claims by giving reasons. It has been held in the Judgment
reported in 2012 WLR 489 and in the unreported Judgment 25.01.2018 in
Wp.No.38383/2015 batch the expenses should have an utility value to the
development of the child. In the opinion of the Committee the expenses
shown to have been incurred in the above claims have no nexus at all for the
development of the child. Expenses claimed under the head of “Hospitality”,
and in payment of “Property tax”, in the opinion of the Committee is also to be
treated on par with the heads of expenditure mentioned above. In other
words the development of the student has nothing to do with the expenditure
incurred for “Hospitality” and "Property Tax". Therefore the claim made under
“Hospitality” and "Property Tax" will also not be considered. In the unreported
Judgment of the year 2018, the Hon’ble High Court specifically permitted that
the Committee can reject the claims referred to above (except hospitality) by
giving reasons. Both in Lakshmi School case Judgment and in the above Judgment it was held that the expenditures incurred by the school must have
relevance and utility value to the development of the child. After careful
consideration the Committee has no doubt at all that the expenditures covered
under this paragraph have neither utility value nor any relevance to the
development of the child. Consequently the Committee is not considering all
the claims referred to in this paragraph.</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>F. Printing and Other Charges</h3>
                    <div className="mb-6 text-justify">
                      <p>The claims under “Printing charges”, “Stationery Charges”, “ Books and
Periodicals”, “Teaching Aids”, “Sports and Games”, “ Group Activities”,
“Seminar”, “Teaching Through Technology” and “Functions and Celebrations”
will be considered on merit on a case to case basis having the students
strength of the school, subject to relevancy and proof and also taking into
account whether the amount determined is reasonable or not.</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>G. Extra-Curricular Activities</h3>
                    <div className="mb-6 text-justify">
                      <p>Generally this claim will not be considered because these activities are
only optional. It is common knowledge that all the students do not take part
in “Extra Curricular Activities”. Therefore expenses incurred under the above
head in respect of those students who joined these activities cannot be
fastened on the heads of other students who do not participate at all in such
activities. Extra Curricular Activities are outside the curriculum. This means
that the expenses towards Extra Curricular Activities is an additional
expenditure. If a parent is informed that the expenses incurred (Extra
Curricular Teaching staff salary) in conducting Extra Curricular Activities would
be taken as component in determining the fee structure the parent/s may
decide to join or opt out. Therefore it is made clear that the fee structure
determined by the Committee had not taken into account the expenses
incurred by the school in conducting “Extra Curricular Activities”. It is open to
the school to collect fee charges from willing students who wished to join
these activities.</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>H. Functions and Celebrations</h3>
                    <div className="mb-6 text-justify">
                      <p>Any claim made under this head will be decided on a case to case basis.
The amounts claimed shall be supported by reliable documents. It is seen that
the expenditures shown to have been incurred vary from school to school and
there is no cap fixed for the expenditures to be incurred. The amount
determined includes, among other things the expenses incurred for conducting
annual day celebrations. Expenses incurred for conducting founders day are
excluded. Therefore the Committee has decided to determine the amount the
school is entitled to only on a reasonable basis.</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>I. Educational Tour</h3>
                    <div className="mb-6 text-justify">
                      <p>For conducting a local tour which may be once in a year the expenses may
be negligible and therefore the school can bear it. For outstation tour the
school always collects in advance a fixed sum from each student to meet the
expenses likely to be incurred in conducting such tours. Therefore the claim
will not be considered.</p>
                    </div>
                  </section>

                  {/* Numbered Sections 2-10 */}
                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>2. Development Fund and Other Expenses</h3>
                    <div className="mb-6 text-justify">
                      <p>The amount quantified and determined under the heads of “Development Fund”,
“Infrastructure Fund” and “Sundry Expenses” if taken as a whole would be more than
sufficient, in the opinion of the Committee to meet all the other expenses which are
not taken into account by this Order.</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>3. Drivers and Conductors Salary</h3>
                    <div className="mb-6 text-justify">
                      <p>Almost every school treats the above category of person as Non-teaching staff
and claims that the salary paid to them should be taken into account in determining
the fee structure. Several years before, then Committee in office decided and
permitted every school providing transport facility to the students from their residence
to school and back, to charge a fee from each student per kilometer of travel indicated
therein and collect it from them. It was meant that such collection of amount it would
be able to meet the salary commitment of drivers and conductors. In other words
collection of such amount is outside the fee structure determined by the Committee.
It is open to every school to fix their terms with the students who want to avail bus
facility and collect it.</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>4. Text Books and Note Books</h3>
                    <div className="mb-6 text-justify">
                      <p>All the schools include the expenses in the purchase of text books and note
books to be taken into account as a component in determining the fee structure. The
reason given by them is that the expenses in purchasing the above is met by the
school from the fee determined only and they do not separately collect any money
towards the above from any students. This claim has been all along allowed prior to
the academic year 2020-2021. On a second thought the present Committee started examining the
issue. The cost of text books to be provided to the students in the school will not be
uniform. The higher the class the cost would be correspondingly high and such cost
would be in a descending order down to standard 1. It is noted that to allow the entire
cost in purchasing all the text books and note books to be shared by all the students
irrespective of the class in which they are studying would amount to causing
unnecessary burden to those students in lower classes. Therefore the Committee has
decided not to consider this expenditure claim under that head, giving the liberty to
each school to collect the actual cost of text books and note books from each student.
This will definitely lessen the burden of the students in lower class. Therefore it is
made clear that the fee structure determined will not include the cost of text books
and note books to be given to the students.</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>5. Laboratory Expenses</h3>
                    <div className="mb-6 text-justify">
                      <p>Again it is seen that students from 10th to 12th standards alone use
laboratories. The cost of materials to be used in laboratory is very high. These
expenses in the opinion of the Committee cannot be taken as a component in
determining the fee structure on broad principles stated earlier. Under these
circumstances the school is permitted to collect the laboratory expenses from the
students using the laboratory by dividing the total expenditure by the number of
students. However the total expenditures incurred under this head must be supported
by a certificate to be issued by the Principal of the school that the expenses incurred as laboratory expenses are reasonable.</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>6. Expenditure Claims</h3>
                    <div className="mb-6 text-justify">
                      <p>In Para 21 in the unreported judgement dated 25.01.2018 in WP.No.38383/2015
batch, the Hon’ble High Court of Madras had indicated various heads of expenditure
that could be claimed by any school while submitting application proposing a new fee
structure. They are divided into several accounts namely Account I, Account II,
Account III, Account IV, Account V, Account VI and Account VII. Account V is with the
caption “Infrastructure”. Account VII is with the caption “Futuristic Development”.
Under Account VII the Court provided for infrastructure grading. Account V consists of
6 heads of expenditure and they are “purchasing a furniture, equipment, land, new
construction, modernization and any other”. These heads of expenditure are
exhaustive. Further at the foot of Account VII the Hon’ble High Court held as follows:
“If infrastructure grading, 7% to 10% is allowed as mentioned in Account VII
(futuristic development) Account V on infrastructure will become redundant. If not
allowed as mentioned in the Account VII, Account V has to be considered. Both are on
the same heads. Heads V and VII will be applied in the alternative”.
The Committee noted that every school claims an expenditure incurred by them under
any one of the heads Account V to be treated as a component in determining the fee
structure. In view of the Law laid down as referred to above the claim falling under
Account V is rejected.</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>7. Fee Structure Determination Guidelines</h3>
                    <div className="mb-6 text-justify">
                      <p>In determining the fee structure a huge amount quantified under “Development
Fund” and “Infrastructure Fund” is taken into account as a component in fixing the fee
structure. Such quantification in almost all the cases exceeds several lakhs. Many
schools are in rented buildings and a reasonable number of schools are in their own
building. Two enactments namely Transfer of Property Act (applicable to the whole of
India) and Tamil Nadu Lease and Rent Control Act (applicable to this State) are
inforce. Under both the Acts the owner of the building is Statutorily bound to carry
out the repairs and if not done, the tenant has the right to meet those expenses and
deduct the same from the rent payable. It is true that there is limitation in the
expenditure to be incurred. Every person who runs a school is duty bound to repair
and maintain the building in a habitable condition for the safety of not only the
teaching staff / non-teaching staff but also the entire student community. Therefore it
is clear that this is the responsibility primarily on the management. To pass on the
expenses incurred by any school in repairing and maintaining the building to the
students would be a heavy burden on them. Therefore the Committee unanimously
decided that henceforth to adopt the following guidelines:</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>8. Additional Claims</h3>
                    <div className="mb-6 text-justify">
                      <p>Any other claim not covered under any of the claims mentioned above will be
                      considered on merits subject to proof, relevancy and reasonableness.</p>
                    </div>
                  </section>

                  <section className="avoid-break mb-8">
                    <h3 className={subHeadingClasses}>9. Fee Structure Determination</h3>
                    <div className="mb-6 text-justify">
                      <p>Consequently, in the light of the facts noted above, the Committee determine the
                      fee structure for the school as hereunder;</p>
                    </div>
                  </section>

                 
                </div>
              </div>

              {/* Account Tables */}
              <div className="account-sections">
                <div className="avoid-break">
                  <AccountOneFormat />
                </div>
                <div className="avoid-break">
                  <AccountTwoFormat />
                </div>
                <div className="avoid-break">
                  <AccountThreeFormat />
                </div>
                <div className="avoid-break">
                  <AccountFourFormat />
                </div>
                <div className="avoid-break">
                  <AccountFiveFormat />
                </div>
                <div className="avoid-break">
                  <AccountSixFormat />
                </div>
                <div className="avoid-break">
                  <AccountSevenFormat />
               
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolOrderFormat;