import { useState } from 'react';

const TERMS = [
  {
    title: "Terms and Conditions",
    content: `
Effective Date: [Insert Date]

Welcome to CashbackFarms.com, operated by Greenheap Agro Farms Private Limited (“we”, “our”, or “us”). By accessing or using our website and mobile application, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
`
  },
  {
    title: "1. About Us",
    content: `
Cashback Farms is a real estate-integrated technology platform powered by Greenheap Agro Farms Private Limited.

We offer:
• A digital solution for real estate agents to list, manage, and sell properties.
• A trusted platform for end users to explore and book properties and access real estate services.
• An integrated ecosystem to connect with service providers (e.g., architects, civil engineers, material suppliers).
`
  },
  {
    title: "2. Eligibility",
    content: `
To use CashbackFarms.com:
• You must be at least 18 years of age.
• You must be legally competent to enter into binding contracts.
• You must provide accurate, up-to-date, and complete information during registration.
`
  },
  {
    title: "3. User Roles",
    content: `
a. Real Estate Agents
• Must complete KYC verification (GST optional).
• Can create projects (plots, villas, skyrise) and upload maps, price per sq. ft., and individual plot listings.
• Are responsible for the accuracy of all information provided.
• Agree to Cashback Farms’ commission and referral policies.

b. End Users
• Can explore projects and book properties by plot, cent, sq. ft., or sq. yard.
• May choose from public listings, Greenheap Verified properties, or use the “Book My Sqft” model.
• Must verify all project details before making any financial transaction.
`
  },
  {
    title: "4. Booking, Payments & Refunds",
    content: `
• Booking includes a token amount of ₹5,000.
• Payment Schedule:
  • 20% advance (less ₹5,000 token),
  • 50% on registration,
  • 10% for miscellaneous expenses,
  • 10% for rental processing.
• Full upfront payment qualifies for a 20% discount.
• Refunds, if applicable, will follow individual project terms.
• Greenheap Agro Farms is not liable for third-party agent disputes.
`
  },
  {
    title: "5. Greenheap Verified Properties",
    content: `
• These listings are inspected and certified as risk-free.
• Offers 100% secure ownership with structured payment plans.
• Other listings are third-party and must be independently verified by the user.
`
  },
  {
    title: "6. Platform Usage",
    content: `
• Features include project/plot uploads, pricing calculator, rental yield estimator, and vendor services.
• Misuse of the platform, data scraping, or unauthorized access will result in legal action and account termination.
`
  },
  {
    title: "7. Commission & Referral Structure",
    content: `
• Cashback Farms operates a 3-level referral commission system:
  • Level 1: 1.5%
  • Level 2: 0.25%
  • Level 3: 0.25%
• Commissions are paid only after the successful completion of transactions.
`
  },
  {
    title: "8. Limitation of Liability",
    content: `
• Greenheap Agro Farms provides technology enablement only.
• We are not responsible for:
  • Title disputes,
  • Construction delays,
  • Agent misconduct or data errors.
`
  },
  {
    title: "9. Termination",
    content: `
We reserve the right to suspend or permanently block users violating these terms or engaging in fraud or misconduct.
`
  },
  {
    title: "10. Modifications",
    content: `
These terms may be updated periodically. Your continued use of CashbackFarms.com indicates acceptance of the updated terms.
`
  },
  {
    title: "11. Governing Law",
    content: `
These Terms and Conditions are governed by Indian law. All disputes will be subject to the jurisdiction of the courts of [Insert Jurisdiction – e.g., Chennai or Tirunelveli].
`
  },
  {
    title: "12. Contact Us",
    content: `
Greenheap Agro Farms Private Limited

🌐 Website: www.cashbackfarms.com
📞 Phone: ‪+91 81900 19991‬
📧 Email: support@cashbackfarms.com
`
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
              <div className="text-sm text-gray-700 whitespace-pre-line">{term.content}</div>
            </div>
          ))}
          
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

