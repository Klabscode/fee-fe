import React from 'react';

const SignatureSection = () => {
  return (
    <div className="mt-8 space-y-16"> {/* Reduced from mt-16 and space-y-32 */}
      {/* Chairman Section */}
      <div className="text-center">
        <div className="border-t border-gray-400 pt-2 inline-block px-6"> {/* Reduced padding */}
          <p className="text-gray-800 font-semibold">Mr. Justice R.Balasubramanian</p>
          <p className="text-gray-600">Chairman</p>
        </div>
      </div>

      {/* First Row of Members */}
      <div className="grid grid-cols-2 gap-x-16"> {/* Reduced from gap-x-32 */}
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="text-gray-800 text-sm">
              Deputy Secretary to Government,<br />
              School Education Department<br />
              Member - Secretary
            </p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="text-gray-800 text-sm">
              Director of Matriculation Schools<br />
              Member
            </p>
          </div>
        </div>
      </div>

      {/* Second Row of Members */}
      <div className="grid grid-cols-2 gap-x-16"> {/* Reduced from gap-x-32 */}
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="text-gray-800 text-sm">
              Director of Elementary Education<br />
              Member
            </p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2">
            <p className="text-gray-800 text-sm">
              Joint Chief Engineer(Buildings)<br />
              Public Works Department<br />
              Member
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureSection;