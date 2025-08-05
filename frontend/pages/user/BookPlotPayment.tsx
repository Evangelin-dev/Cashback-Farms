import React, { useRef, useState } from "react";
import { FaCheck, FaWallet } from "react-icons/fa"; // Using a different icon for clarity

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

  const handleClose = () => {
    if (typeof onClose === "function") onClose();
  };
  
  const handleStep1Submit = (e: React.FormEvent) => {
      e.preventDefault();
      if (paymentOption) setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkFile && transactionNumber) {
        setStep(3);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 animate-fade-in-fast">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col relative animate-slide-up overflow-hidden max-h-[90vh]">
        
        {/* --- 1. FIXED HEADER AREA --- */}
        <div className="flex-shrink-0">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-600 text-3xl z-30"
              onClick={handleClose}
              aria-label="Close"
              type="button"
            >
              ×
            </button>
            <div className="w-full flex flex-col items-center pt-8 pb-4 text-center">
              {/* [FIXED] Icon now changes based on step */}
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mb-2">
                <FaWallet className={`w-8 h-8 text-white absolute transition-opacity duration-300 ${step === 3 ? 'opacity-0' : 'opacity-100'}`} />
                <FaCheck className={`w-8 h-8 text-white absolute transition-opacity duration-300 ${step === 3 ? 'opacity-100' : 'opacity-0'}`} />
              </div>
              <h2 className="text-2xl font-bold text-green-700">
                {step === 3 ? "Payment Submitted!" : "Plot Payment"}
              </h2>
               <p className="text-gray-500 text-sm px-4">
                {step === 3 ? "Your details have been received. We will contact you soon." : "Complete your plot booking in a few easy steps."}
               </p>
            </div>
            {step !== 3 && (
                <div className="flex items-start justify-center w-full mb-4 px-8">
                    <div className={`flex-1 flex flex-col items-center text-xs text-center ${step >= 1 ? "text-green-600" : "text-neutral-400"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 mb-1 ${step >= 1 ? "border-green-600 bg-green-100" : "border-neutral-300 bg-white"}`}>1</div>
                        Payment Option
                    </div>
                    <div className={`flex-1 h-0.5 mt-4 ${step > 1 ? "bg-green-600" : "bg-neutral-200"} mx-2 rounded-full`} />
                    <div className={`flex-1 flex flex-col items-center text-xs text-center ${step >= 2 ? "text-green-600" : "text-neutral-400"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 mb-1 ${step >= 2 ? "border-green-600 bg-green-100" : "border-neutral-300 bg-white"}`}>2</div>
                        Upload Details
                    </div>
                    <div className={`flex-1 h-0.5 mt-4 ${step > 2 ? "bg-green-600" : "bg-neutral-200"} mx-2 rounded-full`} />
                    <div className={`flex-1 flex flex-col items-center text-xs text-center ${step === 3 ? "text-green-600" : "text-neutral-400"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 mb-1 ${step === 3 ? "border-green-600 bg-green-100" : "border-neutral-300 bg-white"}`}>
                            {step === 3 ? <FaCheck/> : 3}
                        </div>
                        Done
                    </div>
                </div>
            )}
        </div>

        {/* --- 2. SCROLLABLE CONTENT AREA --- */}
        <div className="flex-1 w-full overflow-y-auto px-8 py-6">
          {step === 1 && (
            <form id="step1-form" className="w-full flex flex-col items-center animate-fade-in-fast" onSubmit={handleStep1Submit}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 w-full text-left">Select Payment Option</label>
              <div className="relative w-full">
                <button type="button" className={`border rounded-lg px-4 py-3 w-full text-base transition shadow flex justify-between items-center bg-white ${!paymentOption ? "text-gray-400" : "text-gray-800"}`} onClick={() => setShowDropdown(open => !open)}>
                  <span>{paymentOption ? PAYMENT_OPTIONS.find(opt => opt.value === paymentOption)?.label : "Choose an option"}</span>
                  <svg className={`w-4 h-4 ml-2 transition-transform ${showDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {/* [FIXED] Added z-20 to ensure dropdown is on top of the footer */}
                {showDropdown && (
                  <ul className="absolute left-0 right-0 mt-1 bg-white border border-green-100 rounded-lg shadow-lg z-20">
                    {PAYMENT_OPTIONS.map(opt => (
                      <li key={opt.value} className={`px-4 py-2 cursor-pointer hover:bg-green-50 ${paymentOption === opt.value ? "bg-green-100 font-semibold text-green-700" : ""}`} onClick={() => { setPaymentOption(opt.value); setShowDropdown(false); }}>
                        {opt.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </form>
          )}

          {step === 2 && (
            <form id="step2-form" className="w-full flex flex-col items-center animate-fade-in-fast" onSubmit={handleStep2Submit}>
              <label className="block text-sm font-semibold text-gray-700 mb-2 w-full text-left">Upload Bank Transaction Checkleaf</label>
              <div
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 w-full cursor-pointer transition-all duration-200 mb-4 ${checkFile ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-50 hover:border-green-400"}`}
                onClick={handleUploadClick} style={{ minHeight: 120 }}>
                <input ref={fileInputRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} required />
                {!checkFile && (
                  <div className="flex flex-col items-center text-center">
                    <svg className="w-10 h-10 text-green-400 mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-4 4m4-4l4 4" /><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth={2} /></svg>
                    <span className="text-green-700 font-semibold">Click to upload</span>
                    <span className="text-xs text-gray-400 mt-1">Image or PDF (Checkleaf/Receipt)</span>
                  </div>
                )}
                {checkPreview && (
                  <div className="flex flex-col items-center text-center">
                    <img src={checkPreview} alt="Check Preview" className="max-h-32 rounded shadow border mb-2" />
                    <span className="text-xs text-green-700 font-semibold break-all">{checkFile?.name}</span>
                    <button type="button" className="mt-2 text-xs text-red-500 underline" onClick={e => { e.stopPropagation(); setCheckFile(null); setCheckPreview(null); }}>
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 w-full text-left">Transaction Number</label>
              <input type="text" className="border rounded-lg px-4 py-2 w-full text-base focus:border-green-500 transition shadow" placeholder="Enter Transaction Number" value={transactionNumber} onChange={e => setTransactionNumber(e.target.value)} required />
            </form>
          )}

          {/* [FIXED] Removed the placeholder div that was causing the white space */}
        </div>

        {/* --- 3. FIXED FOOTER AREA --- */}
        <div className="w-full px-8 py-4 border-t border-gray-100 flex-shrink-0">
            {step === 1 && (
                <button
                    form="step1-form"
                    type="submit"
                    className={`w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-lg transition text-base ${!paymentOption ? "opacity-60 cursor-not-allowed" : ""}`}
                    disabled={!paymentOption}>
                    Continue
                </button>
            )}
            {step === 2 && (
                 <button
                    form="step2-form"
                    type="submit"
                    className={`w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-lg transition text-base ${(!checkFile || !transactionNumber) ? "opacity-60 cursor-not-allowed" : ""}`}
                    disabled={!checkFile || !transactionNumber}>
                    Submit Payment Details
                </button>
            )}
            {step === 3 && (
                <button
                    className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                    onClick={handleClose}>
                    Done
                </button>
            )}
        </div>
      </div>
      <style>{`
        .animate-fade-in-fast { animation: fadeInFast 0.5s; }
        @keyframes fadeInFast { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(.4,2,.6,1) both; }
        @keyframes slideUp { from { transform: translateY(80px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default BookPlotPayment;