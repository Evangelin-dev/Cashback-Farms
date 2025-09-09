import React from 'react';

const RefundPolicyPage: React.FC = () => {
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-2xl mb-6 animate-bounce-gentle text-4xl">
              🌱
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-4 animate-fade-in-delayed">
              Refund Policy
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full animate-expand mb-6"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-300">
              Your trust is our priority. Here's how our refund process works, kept simple and clear.
            </p>
          </header>

          <main className="space-y-8">
            
            {/* Section 1 - Booking Confirmation */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-400">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  📄
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  1. Booking Confirmation
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg ml-18">
                All bookings made through <span className="text-blue-600 font-semibold">CashbackFarms.com</span> are processed after confirmation of token amount or full payment via <span className="text-emerald-600 font-semibold">Razorpay</span>. A confirmation email and receipt will be shared upon successful transaction.
              </p>
            </section>

            {/* Section 2 - Refund Eligibility */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  ✅
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  2. Refund Eligibility
                </h2>
              </div>
              <div className="ml-18">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  We offer refunds only under the following conditions:
                </p>
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200 mb-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">If the plot/property selected is unavailable or already booked.</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">If the booking is canceled by Cashback Farms due to technical or operational issues.</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">If the buyer cancels within <strong className="text-emerald-700">3 business days</strong> from the date of payment and before documentation has begun.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white shadow-lg text-xl flex-shrink-0">
                    💡
                  </div>
                  <div>
                    <p className="text-amber-800 text-lg">
                      <strong className="font-bold">Important Note:</strong> The token amount is non-refundable once the documentation or legal process is initiated.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 - The Refund Process */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-600">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  🔄
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  3. The Refund Process
                </h2>
              </div>
              <div className="ml-18">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 bg-gradient-to-r from-white to-emerald-50 rounded-2xl p-6 border border-emerald-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-bold text-emerald-700 text-lg mb-2">Request</h3>
                      <p className="text-gray-700 text-lg">Email us at <a href="mailto:support@cashbackfarms.com" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">support@cashbackfarms.com</a> or call <a href="tel:+918190019991" className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-colors">+91 81900 19991</a> with your payment reference number.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 bg-gradient-to-r from-white to-teal-50 rounded-2xl p-6 border border-teal-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-bold text-teal-700 text-lg mb-2">Approval</h3>
                      <p className="text-gray-700 text-lg">Once approved, we will process the refund (excluding any non-refundable charges).</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 bg-gradient-to-r from-white to-green-50 rounded-2xl p-6 border border-green-200">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-bold text-green-700 text-lg mb-2">Receive</h3>
                      <p className="text-gray-700 text-lg">The amount will be refunded to your original mode of payment within <strong className="text-green-700">7–10 business days</strong>.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 - Cancellation Charges */}
            <section className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-emerald-200/50 p-8 md:p-10 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up delay-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white shadow-lg text-2xl">
                  💰
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
                  4. Cancellation Charges
                </h2>
              </div>
              <div className="ml-18">
                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                  In case of cancellations initiated by the buyer:
                </p>
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg">A <strong className="text-red-700">5% processing fee</strong> may be deducted from the refund amount.</span>
                    </li>
                    <li className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                      <span className="text-lg"><strong className="text-red-700">No refund</strong> is applicable once documentation is submitted or registration is initiated.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </main>

          {/* Footer Contact Section */}
          <footer className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl shadow-2xl p-10 md:p-12 animate-fade-in-up delay-800">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Have Questions?</h2>
              <p className="text-emerald-100 text-xl mb-8">We're here to help you.</p>
              
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
                  Committed to transparent and fair refund policies
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

export default RefundPolicyPage;