import { useState } from 'react';

const TermsAndConditions = () => {
  const [accepted, setAccepted] = useState(false);

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
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-4 animate-fade-in-delayed">
              Terms & Conditions
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full animate-expand mb-6"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-300">
              Please read these terms carefully. By using our services, you agree to these conditions.
            </p>
          </header>

          <main className="space-y-8">
            
            {/* Introduction */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-400">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  📋
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  Introduction
                </h2>
              </div>
              <div className="ml-18">
                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                  <strong className="text-emerald-700">Effective Date:</strong> 21 June 2025
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Welcome to <span className="text-blue-600 font-semibold">CashbackFarms.com</span>, operated by <strong className="text-emerald-700">Greenheap Agro Farms Private Limited</strong> ("we", "our", or "us"). By accessing or using our website and mobile application, you agree to comply with and be bound by the following terms and conditions.
                </p>
              </div>
            </section>

            {/* Section 1 - About Us */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  🏢
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  1. About Us
                </h2>
              </div>
              <div className="ml-18">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  Cashback Farms is a real estate-integrated technology platform powered by Greenheap Agro Farms Private Limited.
                </p>
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                  <p className="text-emerald-700 font-semibold text-lg mb-4">We offer:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">A digital solution for real estate agents to list, manage, and sell properties.</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">A trusted platform for end users to explore and book properties and access real estate services.</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">An integrated ecosystem to connect with service providers (e.g., architects, civil engineers, material suppliers).</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 - Eligibility */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-600">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  👥
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  2. Eligibility
                </h2>
              </div>
              <div className="ml-18">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">To use CashbackFarms.com:</p>
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">You must be at least <strong className="text-teal-700">18 years of age</strong>.</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">You must be legally competent to enter into binding contracts.</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">You must provide accurate, up-to-date, and complete information during registration.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 - User Roles */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  🎭
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  3. User Roles
                </h2>
              </div>
              <div className="ml-18">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                    <h3 className="font-bold text-purple-700 text-lg mb-4">a. Real Estate Agents</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-lg">Must complete KYC verification (GST optional).</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-lg">Can create projects (plots, villas, skyrise) and upload maps, price per sq. ft., and individual plot listings.</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-lg">Are responsible for the accuracy of all information provided.</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="font-bold text-blue-700 text-lg mb-4">b. End Users</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-lg">Can explore projects and book properties by plot, cent, sq. ft., or sq. yard.</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-lg">May choose from public listings, Greenheap Verified properties, or use the "Book My Sqft" model.</span>
                      </li>
                      <li className="flex items-start gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                        <span className="text-lg">Must verify all project details before making any financial transaction.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 - Booking, Payments & Refunds */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-800">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  💳
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  4. Booking, Payments & Refunds
                </h2>
              </div>
              <div className="ml-18">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mb-6">
                  <p className="text-green-700 font-bold text-lg mb-4">Booking includes a token amount of ₹5,000</p>
                  <div className="bg-white/60 rounded-xl p-4">
                    <p className="text-gray-700 font-semibold text-lg mb-3">Payment Schedule:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-lg">20% advance (less ₹5,000 token)</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-lg">50% on registration</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-lg">10% for miscellaneous expenses</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-lg">10% for rental processing</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-lg">Full upfront payment qualifies for a <strong className="text-emerald-700">20% discount</strong>.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-lg">Refunds, if applicable, will follow individual project terms.</span>
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-lg">Greenheap Agro Farms is not liable for third-party agent disputes.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5 - Greenheap Verified Properties */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-900">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  ✅
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  5. Greenheap Verified Properties
                </h2>
              </div>
              <div className="ml-18">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">These listings are inspected and certified as <strong className="text-yellow-700">risk-free</strong>.</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">Offers <strong className="text-yellow-700">100% secure ownership</strong> with structured payment plans.</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">Other listings are third-party and must be independently verified by the user.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Additional sections abbreviated for space - Platform Usage, Commission Structure, etc. */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-1000">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  ⚖️
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  Additional Terms
                </h2>
              </div>
              <div className="ml-18">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                    <h3 className="font-bold text-gray-700 text-lg mb-3">Platform Usage & Commission Structure</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="text-lg">• 3-level referral commission: Level 1 (1.5%), Level 2 & 3 (0.25% each)</li>
                      <li className="text-lg">• Features include project uploads, pricing calculator, rental yield estimator</li>
                      <li className="text-lg">• Misuse results in legal action and account termination</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                    <h3 className="font-bold text-red-700 text-lg mb-3">Limitation of Liability</h3>
                    <p className="text-gray-700 text-lg mb-3">Greenheap Agro Farms provides technology enablement only. We are not responsible for:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="text-lg">• Title disputes or construction delays</li>
                      <li className="text-lg">• Agent misconduct or data errors</li>
                      <li className="text-lg">• Third-party service provider issues</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="font-bold text-blue-700 text-lg mb-3">Governing Law</h3>
                    <p className="text-gray-700 text-lg">These Terms are governed by Indian law. All disputes are subject to Chennai, Tamil Nadu court jurisdiction.</p>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Acceptance Section */}
          <section className="mt-12 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 animate-fade-in-up delay-1100">
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                checked={accepted}
                onChange={() => setAccepted(v => !v)}
                id="acceptTerms"
                className="w-6 h-6 text-emerald-600 bg-white border-2 border-emerald-300 rounded focus:ring-emerald-500 focus:ring-2"
              />
              <label htmlFor="acceptTerms" className="ml-4 text-gray-700 font-medium cursor-pointer select-none text-lg">
                I have read and accept the Terms and Conditions
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
              className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 text-lg shadow-lg transform ${
                accepted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 cursor-pointer hover:scale-105 hover:shadow-xl'
                  : 'bg-gray-300 cursor-not-allowed opacity-50'
              }`}
            >
              {accepted ? 'Confirm Acceptance' : 'Please Accept Terms First'}
            </button>
          </section>

          {/* Footer Contact Section */}
          <footer className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl shadow-2xl p-10 md:p-12 animate-fade-in-up delay-1200">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
              <p className="text-emerald-100 text-xl mb-8">Questions about our terms? We're here to help.</p>
              
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
                  Effective as of June 21, 2025
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
        .delay-1100 { animation-delay: 1.1s; }
        .delay-1200 { animation-delay: 1.2s; }

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

export default TermsAndConditions;