import { useState } from 'react';

const TERMS = [
  {
    title: "Eligibility",
    content: "You must be at least 18 years old to use Cashback Farms."
  },
  {
    title: "Booking & Payments",
    content: "All plot bookings are subject to availability. Payments are non-refundable except as per policy."
  },
  {
    title: "User Conduct",
    content: "Do not misuse the platform. Violations may result in account suspension."
  },
  {
    title: "Privacy",
    content: "Your data may be used for service improvement. We do not sell your data."
  },
  {
    title: "Contact",
    content: "For support, email support@cashbackfarms.com."
  }
];

const TermsAndConditions = () => {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center py-10 px-2">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl border border-green-100 p-8 animate-fade-in-fast">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 shadow-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth={2.5} />
              <path d="M8 8h8M8 12h8M8 16h4" stroke="currentColor" strokeWidth={2.5} />
            </svg>
          </span>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-1 tracking-tight drop-shadow">Terms & Conditions</h1>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-6 mb-6 max-h-72 overflow-y-auto shadow-inner">
          {TERMS.map((term, idx) => (
            <div key={idx} className="mb-3">
              <div className="font-semibold text-green-700 mb-1 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="10" />
                </svg>
                {term.title}
              </div>
              <div className="text-sm text-gray-700">{term.content}</div>
            </div>
          ))}
          <div className="text-xs text-gray-400 mt-4 italic">
            This is a demo Terms and Conditions page.
          </div>
        </div>
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            checked={accepted}
            onChange={() => setAccepted(v => !v)}
            id="acceptTerms"
            className="accent-green-600 w-5 h-5"
          />
          <label htmlFor="acceptTerms" className="ml-3 text-sm text-gray-700">
            I accept the Terms and Conditions
          </label>
        </div>
        <button
          onClick={() => {
            if (accepted) {
              alert("Thank you! You have accepted the terms and conditions.");
            } else {
              alert("Please accept the terms and conditions first.");
            }
          }}
          disabled={!accepted}
          className={`w-full py-3 rounded-lg font-bold text-white transition text-lg shadow-lg ${
            accepted
              ? 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 cursor-pointer'
              : 'bg-green-200 cursor-not-allowed'
          }`}
        >
          Confirm
        </button>
      </div>
      <style>{`
        .animate-fade-in-fast {
          animation: fadeInFast 0.5s;
        }
        @keyframes fadeInFast {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
};

export default TermsAndConditions;
        
