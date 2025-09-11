import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
          <div className="circle circle-4"></div>
          <div className="circle circle-5"></div>
        </div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section */}
          <header className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-2xl mb-6 animate-bounce-gentle">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-4 animate-fade-in-delayed">
              Privacy Policy
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full animate-expand mb-6"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-300">
              Your privacy is our priority. Here's how we collect, use, and protect your personal information.
            </p>
          </header>

          <main className="space-y-8">
            
            {/* Introduction */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-400">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  🛡️
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  Policy Overview
                </h2>
              </div>
              <div className="ml-18">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mb-6">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div><strong className="text-blue-700">Effective Date:</strong> 21 June 2025</div>
                    <div><strong className="text-blue-700">Website:</strong> <span className="text-blue-600 hover:text-blue-700 cursor-pointer">www.cashbackfarms.com</span></div>
                    <div><strong className="text-blue-700">Company:</strong> Greenheap Agro Farms Private Limited</div>
                    <div><strong className="text-blue-700">Phone:</strong> <span className="text-emerald-600">+91 81900 19991</span></div>
                  </div>
                  <div className="mt-4 text-sm">
                    <strong className="text-blue-700">Email:</strong> <span className="text-blue-600 hover:text-blue-700 cursor-pointer">support@cashbackfarms.com</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  At Greenheap Agro Farms Private Limited, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines how we collect, use, share, and protect your data when you use our platform – CashbackFarms.com and our related services.
                </p>
              </div>
            </section>

            {/* Section 1 - Information We Collect */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  📊
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  1. Information We Collect
                </h2>
              </div>
              <div className="ml-18">
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
                    <h3 className="font-bold text-emerald-700 text-lg mb-4">Personal Information</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-lg">Name, contact number, email ID</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-lg">Residential address, PAN/GST number (optional)</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-lg">KYC and bank details for verification and payment processing</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
                    <h3 className="font-bold text-teal-700 text-lg mb-4">Property & Business Information</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-lg">Project and property details uploaded by real estate agents</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-teal-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-lg">Uploaded maps, images, documents, and price-related information</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                    <h3 className="font-bold text-purple-700 text-lg mb-4">Usage Data</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-lg">IP address, browser type, device ID, and session data</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-lg">Log files, cookies, and location data (if enabled)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 - How We Use Your Information */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-600">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  🔧
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  2. How We Use Your Information
                </h2>
              </div>
              <div className="ml-18">
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">Create and manage your account</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">Verify your identity (KYC, bank verification)</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">Facilitate property listing, booking, and transactions</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">Provide customer support and resolve disputes</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">Send booking confirmations, promotional offers, or updates</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">Improve platform features, security, and user experience</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 - Sharing of Information */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  🤝
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  3. Sharing of Information
                </h2>
              </div>
              <div className="ml-18">
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200">
                  <p className="text-gray-700 text-lg mb-4">We do not sell your personal information to third parties. However, we may share data with:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">Trusted service providers and partners involved in transaction processing, verification, and logistics</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">Law enforcement or government bodies when required by law</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">Internal agents and referral partners under agreed terms</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 - Data Security & Your Rights */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  🔐
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  4. Data Security & Your Rights
                </h2>
              </div>
              <div className="ml-18">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
                    <h3 className="font-bold text-violet-700 text-lg mb-4">Data Security</h3>
                    <p className="text-gray-700 text-lg">
                      We implement industry-standard encryption and access control measures to protect your data. However, no method of transmission over the internet or electronic storage is 100% secure.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <h3 className="font-bold text-green-700 text-lg mb-4">Your Rights</h3>
                    <p className="text-gray-700 text-lg mb-3">You have the right to:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-lg">Access or update your personal data</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-lg">Request deletion of your account and associated data</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-lg">Withdraw consent for marketing communication</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 - Additional Policies */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-900">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  📋
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  5. Additional Policies
                </h2>
              </div>
              <div className="ml-18">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
                    <h3 className="font-bold text-cyan-700 text-lg mb-3">Cookies & Tracking</h3>
                    <p className="text-gray-700 text-lg mb-3">Our platform uses cookies to:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="text-lg">• Remember user preferences and improve usability</li>
                      <li className="text-lg">• Analyze website traffic and user behavior</li>
                      <li className="text-lg">• Track campaign performance</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200">
                    <h3 className="font-bold text-yellow-700 text-lg mb-3">Data Retention</h3>
                    <p className="text-gray-700 text-lg">
                      We retain user data only as long as necessary to fulfill contractual obligations, comply with legal requirements, and maintain business records.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                    <h3 className="font-bold text-red-700 text-lg mb-3">Children's Privacy & Third-Party Links</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="text-lg">• Our services are not intended for individuals under 18 years</li>
                      <li className="text-lg">• We're not responsible for external website privacy practices</li>
                      <li className="text-lg">• Policy updates will be communicated via website or email</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Footer Contact Section */}
          <footer className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl shadow-2xl p-10 md:p-12 animate-fade-in-up delay-1000">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Privacy Questions?</h2>
              <p className="text-emerald-100 text-xl mb-8">Contact us for any privacy-related concerns.</p>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
                <a 
                  href="mailto:support@cashbackfarms.com" 
                  className="flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    ✉️
                  </div>
                  <div className="text-left">
                    <div className="text-emerald-100 text-sm">Email us</div>
                    <div className="text-white font-semibold">support@cashbackfarms.com</div>
                  </div>
                </a>
                
                <a 
                  href="tel:+918190019991" 
                  className="flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    📞
                  </div>
                  <div className="text-left">
                    <div className="text-emerald-100 text-sm">Call us</div>
                    <div className="text-white font-semibold">+91 81900 19991</div>
                  </div>
                </a>
              </div>
              
              <div className="border-t border-white/20 pt-6">
                <p className="text-emerald-200 text-lg font-medium">
                  Greenheap Agro Farms Private Limited
                </p>
                <p className="text-emerald-300 text-sm mt-2">
                  This policy is effective as of June 21, 2025
                </p>
              </div>
            </div>
          </footer>

        </div>
      </div>

      <style>{`
        /* Animation Keyframes */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInDelayed {
          0% { opacity: 0; transform: translateY(20px); }
          50% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounceGentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes expand {
          from { width: 0; }
          to { width: 6rem; }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(-10px) rotate(240deg); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        /* Animation Classes */
        .animate-slide-up { animation: slideUp 0.8s ease-out; }
        .animate-fade-in-delayed { animation: fadeInDelayed 1.2s ease-out; }
        .animate-bounce-gentle { animation: bounceGentle 2s ease-in-out infinite; }
        .animate-expand { animation: expand 1s ease-out 0.5s both; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out both; }
        
        /* Delay classes */
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-900 { animation-delay: 0.9s; }
        .delay-1000 { animation-delay: 1.0s; }

        /* Custom utilities */
        .ml-18 { margin-left: 4.5rem; }
        .shadow-3xl { 
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }

        /* Floating Background Elements */
        .floating-circles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .circle {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
          animation: float 6s ease-in-out infinite;
        }
        
        .circle-1 {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .circle-2 {
          width: 150px;
          height: 150px;
          top: 20%;
          right: 15%;
          animation-delay: -2s;
        }
        
        .circle-3 {
          width: 80px;
          height: 80px;
          bottom: 30%;
          left: 20%;
          animation: floatReverse 8s ease-in-out infinite;
          animation-delay: -1s;
        }
        
        .circle-4 {
          width: 120px;
          height: 120px;
          bottom: 20%;
          right: 10%;
          animation-delay: -3s;
        }
        
        .circle-5 {
          width: 60px;
          height: 60px;
          top: 50%;
          left: 5%;
          animation: floatReverse 10s ease-in-out infinite;
          animation-delay: -4s;
        }
        
        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .shape {
          position: absolute;
          background: linear-gradient(45deg, rgba(34, 197, 94, 0.05), rgba(20, 184, 166, 0.05));
          animation: pulse 4s ease-in-out infinite;
        }
        
        .shape-1 {
          width: 200px;
          height: 200px;
          top: 15%;
          right: 5%;
          transform: rotate(45deg);
          border-radius: 20px;
        }
        
        .shape-2 {
          width: 150px;
          height: 150px;
          bottom: 15%;
          left: 8%;
          transform: rotate(-30deg);
          border-radius: 30px;
          animation-delay: -2s;
        }
        
        .shape-3 {
          width: 100px;
          height: 100px;
          top: 40%;
          right: 20%;
          transform: rotate(60deg);
          border-radius: 15px;
          animation-delay: -1s;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;