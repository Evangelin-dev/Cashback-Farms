import React from "react";

const PrivacyPolicy: React.FC = () => (
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
          <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-1 tracking-tight drop-shadow">Privacy Policy</h1>
        </div>
      </div>
      <div className="bg-green-50 rounded-lg border border-green-200 p-6 mb-6 max-h-[70vh] overflow-y-auto shadow-inner text-gray-800 text-base whitespace-pre-line">
{`
Effective Date: 21 June 2025

Website: www.cashbackfarms.com

Company: Greenheap Agro Farms Private Limited

Phone: ‪+91 81900 19991‬

Email: support@cashbackfarms.com

At Greenheap Agro Farms Private Limited, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines how we collect, use, share, and protect your data when you use our platform – CashbackFarms.com and our related services.

1. 
Information We Collect

We may collect the following types of information:

a. 
Personal Information
Name, contact number, email ID
Residential address, PAN/GST number (optional)
KYC and bank details for verification and payment processing

b. 
Property & Business Information
Project and property details uploaded by real estate agents
Uploaded maps, images, documents, and price-related information

c. 
Usage Data
IP address, browser type, device ID, and session data
Log files, cookies, and location data (if enabled)

2. 
How We Use Your Information

We use your information to:
Create and manage your account
Verify your identity (KYC, bank verification)
Facilitate property listing, booking, and transactions
Provide customer support and resolve disputes
Send booking confirmations, promotional offers, or updates
Improve platform features, security, and user experience

3. 
Sharing of Information

We do not sell your personal information to third parties. However, we may share data with:
Trusted service providers and partners involved in transaction processing, verification, and logistics
Law enforcement or government bodies when required by law
Internal agents and referral partners under agreed terms

4. 
Cookies and Tracking

Our platform uses cookies to:
Remember user preferences and improve usability
Analyze website traffic and user behavior
Track campaign performance (if ads or promotions are used)

You may disable cookies via your browser settings, though some features may not function properly.

5. 
Data Security

We implement industry-standard encryption and access control measures to protect your data. However, no method of transmission over the internet or electronic storage is 100% secure.

6. 
Your Rights

You have the right to:
Access or update your personal data
Request deletion of your account and associated data
Withdraw consent for marketing communication
Lodge a complaint with a data protection authority (if applicable)

To make a request, contact us at support@cashbackfarms.com.

7. 
Data Retention

We retain user data only as long as necessary to:
Fulfill our contractual obligations
Comply with legal and regulatory requirements
Maintain business records or resolve disputes

8. 
Children’s Privacy

Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal data from minors.

9. 
Third-Party Links

CashbackFarms.com may contain links to external websites. We are not responsible for the privacy practices or content of such sites.

10. 
Policy Updates

We may update this Privacy Policy from time to time. You will be notified of material changes via the website or email. Continued use of the platform signifies your acceptance of the updated terms.

11. 
Contact Us

For any queries or concerns about your privacy, please contact:

Greenheap Agro Farms Private Limited

📞 ‪+91 81900 19991‬
📧 support@cashbackfarms.com 
`}
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
  </div>
);

export default PrivacyPolicy;
