import React, { useState } from 'react';
import AssistedPlansRoadmap from './AssistedPlansRoadmap';

const TermsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-4 max-h-[70vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Terms and Conditions</h2>
        <p className="text-gray-700 text-sm mb-4">
          <b>Freedom Plan:</b><br />
          Valid for 3 Months.<br /><br />
          <b>Relax Plan:</b><br />
          Valid for 45 days.<br /><br />
          <b>MoneyBack Plan:</b><br />
          Valid for 45 days.<br /><br />
          100% refund has to be claimed within a week of plan expiry. The refund will be processed once you shift to your new property which is not available on NoBroker website.<br /><br />
          For claiming the refund, you just need to submit a valid copy of your rental agreement. The rental agreement should match the requirement given to NoBroker. NoBroker will verify the claim, this may include physical visit of the property premises.<br /><br />
          The rent and deposit amount in the registered rental agreement should be equal or lower than the one given to NoBroker relationship manager at the time of plan subscription.
        </p>
        <div className="text-center">
          <button onClick={onClose} className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition duration-300">Close</button>
        </div>
      </div>
    </div>
  );
};

const PLAN_CARDS = [
  {
    name: "Freedom Plan",
    price: "₹ 1,499",
    oldPrice: "₹ 1,999",
    bg: "bg-green-100",
    features: [
      "Get genuine house owner contacts matching your requirements",
      "Complete Relocation Assistance on Call",
      "Free Customized Packer and Mover Quote",
      "Free Rental Agreement consultation with expert",
      "On-Demand Support",
      "Premium Filters",
      "Number of Contacts upto 25",
      "Instant Property Alerts on SMS",
      "Locality Experts",
      "Rent Negotiation",
    ],
    gst: "+18% GST",
  },
  {
    name: "Relax Plan",
    price: "₹ 3,499",
    oldPrice: "₹ 4,499",
    bg: "bg-green-100",
    features: [
      "Get Relationship Manager to help you SAVE time and money",
      "Relationship Manager",
      "Contacts owners and fixes meetings",
      "Negotiates rent on your behalf",
      "Provides locality level expertise",
      "Premium Filters",
      "Number of Contacts upto 50",
      "Instant Property Alerts",
      "Locality Experts",
      "Rent Negotiation",
    ],
    gst: "+18% GST",
  },
  {
    name: "MoneyBack Plan",
    price: "₹ 5,999",
    oldPrice: "₹ 7,999",
    bg: "bg-green-100",
    features: [
      "Get Relationship Manager to help you SAVE time and money",
      "Relationship Manager",
      "Contacts owners and fixes meetings",
      "Negotiates rent on your behalf",
      "Provides locality level expertise",
      "Premium Filters",
      "Number of Contacts upto 50",
      "Instant Property Alerts",
      "Locality Experts",
      "Rent Negotiation",
    ],
    gst: "+18% GST",
  },
];

// Subscription Payment Component
export const SubscriptionPayment: React.FC<{ planName: string; onClose: () => void }> = ({ planName, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [paid, setPaid] = useState(false);

  // Animation helpers
  const [showCheck, setShowCheck] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setPaid(true);
    setTimeout(() => setShowCheck(true), 400);
    setTimeout(onClose, 1800);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 animate-fade-in-fast">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center relative animate-slide-up">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg animate-bounce-slow">
            {!paid ? (
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
              </svg>
            ) : (
              <svg className={`w-12 h-12 text-white transition-all duration-500 ${showCheck ? "scale-110" : "scale-0"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
              </svg>
            )}
          </div>
        </div>
        <div className="mt-12 w-full">
          <h2 className="text-xl font-bold text-green-700 mb-2 text-center animate-fade-in-fast">Subscribe: {planName}</h2>
          {!paid ? (
            <form className="w-full animate-fade-in-fast" onSubmit={handlePay}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    className={`flex-1 py-2 rounded-lg border transition-all duration-200 ${
                      paymentMethod === "card"
                        ? "bg-green-100 border-green-500 text-green-700 font-bold shadow"
                        : "bg-gray-50 border-gray-200 text-gray-500"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    Card
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 rounded-lg border transition-all duration-200 ${
                      paymentMethod === "upi"
                        ? "bg-green-100 border-green-500 text-green-700 font-bold shadow"
                        : "bg-gray-50 border-gray-200 text-gray-500"
                    }`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    UPI
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 rounded-lg border transition-all duration-200 ${
                      paymentMethod === "cod"
                        ? "bg-green-100 border-green-500 text-green-700 font-bold shadow"
                        : "bg-gray-50 border-gray-200 text-gray-500"
                    }`}
                    onClick={() => setPaymentMethod("cod")}
                  >
                    COD
                  </button>
                </div>
              </div>
              {paymentMethod === "card" && (
                <div className="mb-4 space-y-2 animate-fade-in-fast">
                  <input className="w-full border rounded px-3 py-2" placeholder="Card Number" required />
                  <div className="flex gap-2">
                    <input className="w-1/2 border rounded px-3 py-2" placeholder="MM/YY" required />
                    <input className="w-1/2 border rounded px-3 py-2" placeholder="CVV" required />
                  </div>
                  <input className="w-full border rounded px-3 py-2" placeholder="Name on Card" required />
                </div>
              )}
              {paymentMethod === "upi" && (
                <div className="mb-4 animate-fade-in-fast">
                  <input className="w-full border rounded px-3 py-2" placeholder="UPI ID" required />
                </div>
              )}
              {paymentMethod === "cod" && (
                <div className="mb-4 text-center text-green-700 font-semibold animate-fade-in-fast">
                  Pay on delivery (No advance needed)
                </div>
              )}
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold hover:from-green-600 hover:to-green-800 transition text-lg shadow-lg animate-fade-in-fast"
              >
                Pay & Subscribe
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center animate-fade-in-fast">
              <div className="text-green-700 font-semibold mb-2 text-lg animate-fade-in-fast">Payment Successful!</div>
              <div className="text-gray-500 text-sm mb-4 text-center animate-fade-in-fast">Thank you for subscribing.</div>
            </div>
          )}
          {!paid && (
            <button
              className="w-full mt-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
      <style>{`
        .animate-fade-in-fast {
          animation: fadeInFast 0.4s;
        }
        @keyframes fadeInFast {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-slide-up {
          animation: slideUp 0.5s cubic-bezier(.4,2,.6,1) both;
        }
        @keyframes slideUp {
          from { transform: translateY(80px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-10px);}
        }
      `}</style>
    </div>
  );
};

const PlansPage: React.FC = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [showPayment, setShowPayment] = useState<{ open: boolean; plan: string }>({ open: false, plan: "" });

  const openTermsModal = () => setIsTermsOpen(true);
  const closeTermsModal = () => setIsTermsOpen(false);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Subscription Plans</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">Choose the plan that best suits your needs.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLAN_CARDS.map((plan, idx) => (
          <div
            key={plan.name}
            className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full min-h-[540px]"
          >
            <div className={`py-4 px-6 ${plan.bg}`}>
              <h3 className="text-xl font-semibold text-green-700 text-center">{plan.name}</h3>
            </div>
            <div className="flex flex-col flex-1 p-6">
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl font-bold text-green-700">{plan.price}</span>
                <span className="text-gray-500 ml-2 line-through">{plan.oldPrice}</span>
              </div>
              <p className="text-gray-600 text-sm text-center mb-4">{plan.gst}</p>
              <ul className="text-gray-700 text-sm flex-1 mb-4">
                {plan.features.map((feature, i) => (
                  <li className="mb-2 flex items-start" key={i}>
                    <span className="mr-2">✅</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <button
                  className="bg-green-600 text-white rounded px-4 py-2 block w-full hover:bg-green-700 transition duration-300"
                  onClick={() => setShowPayment({ open: true, plan: plan.name })}
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Content */}
      <div className="text-center mt-8">
        <p className="text-gray-700 text-sm">Plan Validity: MoneyBack & Relax (45 Days), Freedom & Basic (90 days). T&C apply.</p>
        <p onClick={openTermsModal} className="text-blue-500 text-sm mt-2 underline cursor-pointer">Terms and Conditions</p>
        <p className="text-green-700 text-sm mt-2">Click here for Owner Plans</p>
        <p className="text-gray-700 text-sm mt-2">For assistance call us at: +91-89-055-522-22</p>
      </div>

      <TermsModal isOpen={isTermsOpen} onClose={closeTermsModal} />

      {showPayment.open && (
        <SubscriptionPayment
          planName={showPayment.plan}
          onClose={() => setShowPayment({ open: false, plan: "" })}
        />
      )}

      {/* Roadmap */}
      <AssistedPlansRoadmap />
    </div>
  );
};

export default PlansPage;
