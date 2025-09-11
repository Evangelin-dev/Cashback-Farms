import React, { useState } from 'react';

const HelpAndSupport: React.FC = () => {
  // State for form inputs and submission status
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Handles the form submission
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      setFeedbackMessage('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage('');

    try {
      // 1. Manually retrieve the token from localStorage (if needed)
      // const accessToken = localStorage.getItem('access_token');

      // 2. Check if the user is logged in (if needed)
      // if (!accessToken) {
      //   setFeedbackMessage('You must be logged in to send a message.');
      //   setIsSubmitting(false);
      //   return;
      // }

      // 3. Replace this with your actual API call
      // await apiClient.post(
      //   '/support/inquiry/',
      //   {
      //     subject,
      //     message,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   }
      // );

      // Simulated API call for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setFeedbackMessage('Your message has been sent successfully!');
      // Clear form on success
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Failed to submit support inquiry:', error);
      setFeedbackMessage('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
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

      <div className="relative z-10 min-h-screen py-6 px-3 sm:py-8 sm:px-4">
        <div className="w-full max-w-xl md:max-w-4xl mx-auto">
          
          {/* Header Section */}
          <header className="text-center mb-8 md:mb-16 animate-slide-up">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl mb-6 md:mb-8 animate-bounce-gentle">
              <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6 md:mb-8 animate-fade-in-delayed tracking-tight">
              Help & Support
            </h1>
            <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full animate-expand mb-8"></div>
            <p className="text-base md:text-lg text-green-700 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-300">
              We're here to help! Find answers to your questions or contact our support team.
            </p>
          </header>

          <main className="space-y-12">
            
            {/* FAQ and Contact Info Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              
              {/* FAQ Section */}
              <section className="animate-fade-in-up delay-400">
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg text-2xl md:text-3xl">
                    ❓
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-green-700">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="ml-18 space-y-4">
                  <div className="group cursor-pointer">
                    <div className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-green-100/50 hover:shadow-md">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0 group-hover:bg-green-600 transition-colors"></div>
                      <span className="text-base md:text-lg text-green-800 font-medium group-hover:text-green-900">How do I book a property?</span>
                    </div>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-green-100/50 hover:shadow-md">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0 group-hover:bg-green-600 transition-colors"></div>
                      <span className="text-base md:text-lg text-green-800 font-medium group-hover:text-green-900">How can I download my receipt?</span>
                    </div>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-green-100/50 hover:shadow-md">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0 group-hover:bg-green-600 transition-colors"></div>
                      <span className="text-base md:text-lg text-green-800 font-medium group-hover:text-green-900">How do I edit my profile?</span>
                    </div>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-green-100/50 hover:shadow-md">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0 group-hover:bg-green-600 transition-colors"></div>
                      <span className="text-base md:text-lg text-green-800 font-medium group-hover:text-green-900">How do I contact support?</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact Info Section */}
              <section className="animate-fade-in-up delay-500">
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white shadow-lg text-2xl md:text-3xl">
                    📞
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-green-700">
                    Contact Support
                  </h2>
                </div>
                <div className="ml-18 space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-green-100/50 hover:shadow-md">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl md:text-2xl">
                      ✉️
                    </div>
                    <div>
                      <div className="text-green-600 text-sm md:text-base font-medium">Email</div>
                      <div className="font-bold text-green-800 text-lg md:text-xl">support@cashbackfarm.com</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-green-100/50 hover:shadow-md">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl md:text-2xl">
                      📱
                    </div>
                    <div>
                      <div className="text-green-600 text-sm md:text-base font-medium">Phone</div>
                      <div className="font-bold text-green-800 text-lg md:text-xl">+91 98765 43210</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-green-100/50 hover:shadow-md">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-xl md:text-2xl">
                      💬
                    </div>
                    <div>
                      <div className="text-green-600 text-sm md:text-base font-medium">Live Chat</div>
                      <div className="font-bold text-green-800 text-lg md:text-xl">Available 9am - 6pm</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Contact Form Section */}
            <section className="animate-fade-in-up delay-600">
              <div className="flex items-center gap-4 mb-8 md:mb-10">
                <div className="w-16 h-16 md:w-18 md:h-18 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center text-white shadow-lg text-2xl md:text-3xl">
                  📝
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-700">
                  Send Us a Message
                </h2>
              </div>

              <div className="ml-20">
                <div className="max-w-full md:max-w-3xl">
                  <div className="space-y-6 md:space-y-8">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-6 py-4 md:px-8 md:py-5 rounded-2xl border-2 border-green-200 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 text-lg md:text-xl bg-white/90 backdrop-blur-sm transition-all duration-300 hover:border-green-300 placeholder-green-400 text-green-800"
                        required
                      />
                      <div className="absolute right-4 md:right-6 top-4 md:top-5 text-green-400">
                        <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v1M7 4V3a1 1 0 011-1m0 0V2m0 2h10" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <textarea
                        placeholder="How can we help you? Please describe your issue in detail..."
                        rows={6}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-6 py-4 md:px-8 md:py-5 rounded-2xl border-2 border-green-200 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 text-lg md:text-xl bg-white/90 backdrop-blur-sm transition-all duration-300 hover:border-green-300 resize-none placeholder-green-400 text-green-800"
                        required
                      />
                      <div className="absolute right-4 md:right-6 top-4 md:top-5 text-green-400">
                        <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSubmit}
                      className={`w-full py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-xl ${
                        isSubmitting 
                          ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed' 
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-2xl'
                      }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="w-6 h-6 md:w-7 md:h-7 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Send Message
                        </>
                      )}
                    </button>
                    
                    {feedbackMessage && (
                      <div className={`p-4 md:p-5 rounded-2xl border-2 text-center font-medium text-base md:text-lg animate-fade-in-up ${
                        feedbackMessage.includes('successfully') 
                          ? 'bg-green-50 border-green-300 text-green-800' 
                          : 'bg-red-50 border-red-300 text-red-700'
                      }`}>
                        <div className="flex items-center justify-center gap-3">
                          {feedbackMessage.includes('successfully') ? (
                            <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {feedbackMessage}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Footer Section */}
          <footer className="mt-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-3xl shadow-2xl p-10 md:p-12 animate-fade-in-up delay-1000">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-3xl mb-6 animate-bounce-gentle">
                🤝
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">We're Here to Help</h2>
              <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Our dedicated support team is committed to providing you with the best possible assistance.
              </p>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                    ⏰
                  </div>
                  <div className="text-left">
                    <div className="text-green-100 text-sm">Response Time</div>
                    <div className="text-white font-bold">Within 24 hours</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                    ✨
                  </div>
                  <div className="text-left">
                    <div className="text-green-100 text-sm">Support Quality</div>
                    <div className="text-white font-bold">Premium Service</div>
                  </div>
                </div>
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
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
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
        .ml-20 { margin-left: 5rem; }

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
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.15));
          animation: float 6s ease-in-out infinite;
        }
        
        .circle-1 {
          width: 120px;
          height: 120px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .circle-2 {
          width: 180px;
          height: 180px;
          top: 20%;
          right: 15%;
          animation-delay: -2s;
        }
        
        .circle-3 {
          width: 100px;
          height: 100px;
          bottom: 30%;
          left: 20%;
          animation: floatReverse 8s ease-in-out infinite;
          animation-delay: -1s;
        }
        
        .circle-4 {
          width: 140px;
          height: 140px;
          bottom: 20%;
          right: 10%;
          animation-delay: -3s;
        }
        
        .circle-5 {
          width: 80px;
          height: 80px;
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
          background: linear-gradient(45deg, rgba(34, 197, 94, 0.05), rgba(16, 185, 129, 0.08));
          animation: pulse 4s ease-in-out infinite;
        }
        
        .shape-1 {
          width: 220px;
          height: 220px;
          top: 15%;
          right: 5%;
          transform: rotate(45deg);
          border-radius: 25px;
        }
        
        .shape-2 {
          width: 170px;
          height: 170px;
          bottom: 15%;
          left: 8%;
          transform: rotate(-30deg);
          border-radius: 35px;
          animation-delay: -2s;
        }
        
        .shape-3 {
          width: 120px;
          height: 120px;
          top: 40%;
          right: 20%;
          transform: rotate(60deg);
          border-radius: 20px;
          animation-delay: -1s;
        }
      `}</style>
    </div>
  );
};

export default HelpAndSupport;