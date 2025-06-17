import React, { useRef, useState } from "react";

const PAYMENT_OPTIONS = [
  { value: "advance", label: "20% Booking Advance" },
  { value: "installment", label: "50% 2nd Installment" },
  { value: "final", label: "Final Booking Amount" },
];

const BookPlotPayment: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentOption, setPaymentOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [transactionNumber, setTransactionNumber] = useState("");
  const [checkFile, setCheckFile] = useState<File | null>(null);
  const [checkPreview, setCheckPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  // For creative upload UI
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    setTimeout(() => setShowCheck(true), 400);
    setTimeout(() => setSubmitted(true), 1200);
  };

  // Fix close: always call onClose if provided
  const handleClose = () => {
    if (typeof onClose === "function") onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in-fast">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg min-h-[480px] flex flex-col items-center relative animate-slide-up overflow-hidden">
        {/* Close Button */}
        <button
          className="absolute top-4 right-6 text-gray-400 hover:text-red-600 text-3xl z-10"
          onClick={handleClose}
          aria-label="Close"
          type="button"
        >
          ×
        </button>
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
          <h2 className="text-2xl font-bold text-green-700 mb-1 animate-fade-in-fast">Plot Payment</h2>
          <p className="text-gray-500 text-sm text-center animate-fade-in-fast">
            Complete your plot booking payment in a few easy steps.
          </p>
        </div>
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
                      {opt.label}
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
            <button
              type="submit"
              className={`w-full py-2 rounded-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-lg transition text-base mt-2 animate-fade-in-fast ${!paymentOption ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={!paymentOption}
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
      </div>
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

export default BookPlotPayment;
