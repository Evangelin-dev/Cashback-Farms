import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const PAYMENT_OPTIONS = [
  { value: "token", label: "Token Amount", description: "To reserve the unit", amount: "₹5,000 for 7 days validity" },
  { value: "advance", label: "Advance Payment", description: "20% of total value (₹5,000 adjusted)", amount: "20% - ₹5,000 gst applicable" },
  { value: "registration", label: "On Registration", description: "Payable during registration", amount: "50%" },
  { value: "misc", label: "Miscellaneous Expenses", description: "Government & documentation charges", amount: "30%" },
  { value: "rental", label: "Rental Processing Fee", description: "For rental setup & onboarding", amount: "10%" },
];

const BookMySqftPayment: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentOption, setPaymentOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState("");
  const [checkFile, setCheckFile] = useState<File | null>(null);
  const [checkPreview, setCheckPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'full' | 'standard' | null>(null);

  // For creative upload UI
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [discount, setDiscount] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [amount, setAmount] = useState<number>(100000); // Example base amount, replace with actual value if needed

  // Example: Validate coupon and set discount percent
  const handleDiscountChange = (val: string) => {
    setDiscount(val);
    // Example: If coupon is "GHFSRI1006", give 10% discount
    if (val.trim().toUpperCase() === "GHFSRI1006") {
      setDiscountPercent(10);
    } else {
      setDiscountPercent(0);
    }
  };

  // Calculate discounted amount for final payment
  const getFinalAmount = () => {
    if (paymentOption === "final" && discountPercent > 0) {
      return Math.round(amount - (amount * discountPercent) / 100);
    }
    return amount;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    setTimeout(() => setShowCheck(true), 400);
    setTimeout(() => {
      setSubmitted(true);
      navigate("/Landing");
    }, 1200);
  };

  const handleClose = () => {
    if (typeof onClose === "function") onClose();
  };

  // Add missing handlers
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCheckFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setCheckPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setCheckPreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 animate-fade-in-fast py-8 px-2">
      {/* Header */}
      <div className="w-full flex flex-col items-center pt-10 pb-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg animate-bounce-slow mb-2">
          {step === 3 && showCheck ? (
            <svg className="w-12 h-12 text-white transition-all duration-500 scale-110" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
          ) : (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
            </svg>
          )}
        </div>
        <h2 className="text-2xl font-bold text-green-700 mb-1 animate-fade-in-fast">SqFt Payment</h2>
        <p className="text-gray-500 text-sm text-center animate-fade-in-fast">
          Complete your SqFt booking payment in a few easy steps.
        </p>
      </div>
      {/* CTA Buttons and Plan Details Side by Side */}
      <div className="w-full flex flex-col md:flex-row items-start gap-6 px-8 mt-4 mb-4">
        {/* CTA Buttons */}
        <div className="flex-1 flex flex-col items-center gap-3">
          <button
            className={`w-full py-3 rounded-lg font-bold text-white text-base shadow-lg transition bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 ${selectedPlan === 'full' ? 'ring-4 ring-green-200' : ''}`}
            onClick={() => setSelectedPlan('full')}
          >
            Book Now with Full Payment – Save 20%
          </button>
          <button
            className={`w-full py-3 rounded-lg font-bold text-green-700 text-base shadow-lg transition bg-gradient-to-r from-yellow-100 to-yellow-300 hover:from-yellow-200 hover:to-yellow-400 border border-yellow-400 ${selectedPlan === 'standard' ? 'ring-4 ring-yellow-200' : ''}`}
            onClick={() => setSelectedPlan('standard')}
          >
            Continue with Standard Plan
          </button>
          <button
            className="w-full py-3 rounded-lg font-bold text-blue-700 text-base shadow-lg transition bg-gradient-to-r from-blue-100 to-blue-300 hover:from-blue-200 hover:to-blue-400 border border-blue-400"
            onClick={() => window.open('/payment-breakdown.pdf', '_blank')}
            type="button"
          >
            Download Payment Breakdown PDF
          </button>
        </div>
        {/* Plan Details on the right */}
        <div className="flex-1 min-w-[340px]">
          {selectedPlan === 'full' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-2 animate-fade-in-fast">
              <div className="text-lg font-bold text-green-700 mb-2">Option A: Full Payment Offer – Save 20%</div>
              <ul className="text-green-800 text-base list-disc pl-5 space-y-1">
                <li>✅ Pay 100% upfront and get a <b>20% discount</b> on the total value.</li>
                <li>📌 No token or split payments required.</li>
                <li>📩 Instant confirmation + priority processing + rental onboarding.</li>
              </ul>
            </div>
          )}
          {selectedPlan === 'standard' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-2 animate-fade-in-fast">
              <div className="text-lg font-bold text-yellow-700 mb-2">Option B: Standard Payment Plan</div>
              <table className="w-full text-sm text-left border border-yellow-200 rounded-lg overflow-hidden">
                <thead className="bg-yellow-100">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Stage</th>
                    <th className="px-3 py-2 font-semibold">Description</th>
                    <th className="px-3 py-2 font-semibold">Amount / %</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-yellow-100">
                    <td className="px-3 py-2">Token Amount</td>
                    <td className="px-3 py-2">To reserve the unit</td>
                    <td className="px-3 py-2">₹5,000 for 7 days validity</td>
                  </tr>
                  <tr className="border-b border-yellow-100">
                    <td className="px-3 py-2">Advance Payment</td>
                    <td className="px-3 py-2">20% of total value (₹5,000 adjusted)</td>
                    <td className="px-3 py-2">20% - ₹5,000 gst applicable</td>
                  </tr>
                  <tr className="border-b border-yellow-100">
                    <td className="px-3 py-2">On Registration</td>
                    <td className="px-3 py-2">Payable during registration</td>
                    <td className="px-3 py-2">50%</td>
                  </tr>
                  <tr className="border-b border-yellow-100">
                    <td className="px-3 py-2">Miscellaneous Expenses</td>
                    <td className="px-3 py-2">Government & documentation charges</td>
                    <td className="px-3 py-2">30%</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">Rental Processing Fee</td>
                    <td className="px-3 py-2">For rental setup & onboarding</td>
                    <td className="px-3 py-2">10%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Only show payment steps if a plan is selected */}
      {selectedPlan && (
        <>
          {/* Stepper */}
          <div className="flex items-center justify-center w-full mb-6 px-8">
            <div className={`flex-1 flex flex-col items-center ${step >= 1 ? "text-green-600" : "text-neutral-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? "border-green-600 bg-green-100" : "border-neutral-300 bg-white"}`}>1</div>
              <span className="text-xs mt-1">Payment Option</span>
            </div>
            <div className={`flex-1 h-1 ${step > 1 ? "bg-green-600" : "bg-neutral-200"} mx-2 rounded-full`} />
            <div className={`flex-1 flex flex-col items-center ${step >= 2 ? "text-green-600" : "text-neutral-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? "border-green-600 bg-green-100" : "border-neutral-300 bg-white"}`}>2</div>
              <span className="text-xs mt-1">Upload Details</span>
            </div>
            <div className={`flex-1 h-1 ${step > 2 ? "bg-green-600" : "bg-neutral-200"} mx-2 rounded-full`} />
            <div className={`flex-1 flex flex-col items-center ${step === 3 ? "text-green-600" : "text-neutral-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step === 3 ? "border-green-600 bg-green-100" : "border-neutral-300 bg-white"}`}>{showCheck ? (
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
              ) : 3}</div>
              <span className="text-xs mt-1">Done</span>
            </div>
          </div>
          {/* Step 1: Payment Option */}
          {step === 1 && (
            <form className="w-full flex flex-col items-center px-8 animate-fade-in-fast" onSubmit={e => { e.preventDefault(); setStep(2); }}>
              {selectedPlan === 'full' ? (
                <div className="w-full mb-4 text-green-700 font-semibold text-lg text-center">
                  Pay full payment to get <span className="font-bold">20% off</span> instantly!
                </div>
              ) : (
                <>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 w-full text-left">Select Payment Option</label>
                  <div className="relative w-full mb-4">
                    <button
                      type="button"
                      className={`border rounded-lg px-4 py-3 w-full text-base focus:border-green-500 transition shadow flex justify-between items-center bg-white ${!paymentOption ? "text-gray-400" : "text-gray-800"}`}
                      onClick={() => setShowDropdown(open => !open)}
                      tabIndex={0}
                    >
                      <span>{paymentOption ? PAYMENT_OPTIONS.find(opt => opt.value === paymentOption)?.label : "Choose Payment Option"}</span>
                      <svg className={`w-4 h-4 ml-2 transition-transform ${showDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showDropdown && (
                      <ul className="absolute left-0 right-0 mt-1 bg-white border border-green-100 rounded-lg shadow-lg z-10 animate-dropdown-fade">
                        {PAYMENT_OPTIONS.map(opt => (
                          <li
                            key={opt.value}
                            className={`px-4 py-2 cursor-pointer hover:bg-green-50 ${paymentOption === opt.value ? "bg-green-100 font-semibold text-green-700" : ""}`}
                            onClick={() => {
                              setPaymentOption(opt.value);
                              setShowDropdown(false);
                            }}
                          >
                            <div className="font-semibold">{opt.label}</div>
                            <div className="text-xs text-gray-500">{opt.description}</div>
                            <div className="text-xs text-green-700 font-bold">{opt.amount}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                    <style>{`
                      .animate-dropdown-fade {
                        animation: dropdownFade 0.18s;
                      }
                      @keyframes dropdownFade {
                        from { opacity: 0; transform: translateY(-8px);}
                        to { opacity: 1; transform: translateY(0);}
                      }
                    `}</style>
                  </div>
                </>
              )}
              {/* Show discount field if final payment is selected */}
              {paymentOption === "final" && (
                <div className="w-full mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Enter discount coupon</label>
                  <input
                    type="text"
                    value={discount}
                    onChange={e => handleDiscountChange(e.target.value)}
                    className="border rounded-lg px-4 py-2 w-full text-base focus:border-green-500 transition shadow"
                    placeholder="Enter discount coupon (e.g. GHFSRI1006)"
                  />
                  {discount && (
                    <div className="mt-1 text-xs">
                      {discountPercent > 0 ? (
                        <span className="text-green-600 font-semibold">Coupon applied: {discountPercent}% off</span>
                      ) : (
                        <span className="text-red-500">Invalid coupon</span>
                      )}
                    </div>
                  )}
                </div>
              )}
              {/* Show calculated amount */}
              {paymentOption === "final" && (
                <div className="w-full mb-4 text-green-700 font-semibold">
                  Payable Amount after Discount: ₹{getFinalAmount().toLocaleString()}
                </div>
              )}
              <button
                type="submit"
                className={`w-full py-2 rounded-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-lg transition text-base mt-2 animate-fade-in-fast ${(selectedPlan === 'full' || paymentOption) ? "" : "opacity-60 cursor-not-allowed"}`}
                disabled={selectedPlan !== 'full' && !paymentOption}
              >
                Continue
              </button>
            </form>
          )}
          {/* Step 2: Upload Check & Transaction */}
          {step === 2 && (
            <form className="w-full flex flex-col items-center px-8 animate-fade-in-fast" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 w-full text-left">
                Upload Bank Transaction Checkleaf
              </label>
              <div className="w-full flex flex-col items-center mb-4">
                {/* Creative upload UI */}
                <div
                  className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 w-full cursor-pointer transition-all duration-200 ${checkFile ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50 hover:border-green-400"}`}
                  onClick={handleUploadClick}
                  style={{ minHeight: 120 }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    required
                  />
                  {!checkFile && (
                    <div className="flex flex-col items-center">
                      <svg className="w-10 h-10 text-green-400 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-4 4m4-4l4 4" />
                        <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth={2} />
                      </svg>
                      <span className="text-green-700 font-semibold">Click to upload</span>
                      <span className="text-xs text-gray-400 mt-1">Image or PDF (Checkleaf/Receipt)</span>
                    </div>
                  )}
                  {checkPreview && (
                    <div className="flex flex-col items-center">
                      <img src={checkPreview} alt="Check Preview" className="max-h-32 rounded shadow border mb-2" />
                      <span className="text-xs text-green-700 font-semibold">{checkFile?.name}</span>
                      <button
                        type="button"
                        className="mt-2 text-xs text-red-500 underline"
                        onClick={e => {
                          e.stopPropagation();
                          setCheckFile(null);
                          setCheckPreview(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 w-full text-left">
                Transaction Number
              </label>
              <input
                type="text"
                className="border rounded-lg px-4 py-2 w-full text-base focus:border-green-500 transition shadow mb-4"
                placeholder="Enter Transaction Number"
                value={transactionNumber}
                onChange={e => setTransactionNumber(e.target.value)}
                required
              />
              <button
                type="submit"
                className={`w-full py-2 rounded-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-lg transition text-base mt-2 animate-fade-in-fast ${(!checkFile || !transactionNumber) ? "opacity-60 cursor-not-allowed" : ""}`}
                disabled={!checkFile || !transactionNumber}
              >
                Submit Payment Details
              </button>
            </form>
          )}
          {/* Step 3: Success */}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center flex-1 w-full px-8 py-12 animate-fade-in-fast">
              {showCheck && (
                <>
                  <div className="text-green-700 font-bold text-2xl mb-2 animate-fade-in-fast">Payment Submitted!</div>
                  <div className="text-gray-600 text-center mb-4 animate-fade-in-fast">
                    Your payment details have been received.<br />
                    Our team will verify and contact you soon.
                  </div>
                  <button
                    className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition mt-2"
                    onClick={handleClose}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
      <style>{`
        .animate-fade-in-fast {
          animation: fadeInFast 0.5s;
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

export default BookMySqftPayment;
