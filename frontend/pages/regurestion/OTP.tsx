import React, { useState } from "react";

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (idx: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    // Auto-focus next input
    if (value && idx < 3) {
      const next = document.getElementById(`otp-${idx + 1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Handle OTP verification here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 py-12 px-4">
      <div className="w-full max-w-md rounded-3xl shadow-2xl bg-white/70 backdrop-blur-lg border border-green-200 p-10 relative overflow-hidden">
        {/* Glassy gradient background effect */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-16 -left-16 w-72 h-72 bg-gradient-to-br from-green-200 via-green-100 to-white opacity-40 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-gradient-to-tr from-green-300 via-green-100 to-white opacity-30 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mb-2 drop-shadow-lg">
            OTP Verification
          </h1>
          <p className="text-green-900 text-center mb-8 font-medium">
            Enter the 4-digit OTP sent to your registered email/phone.
          </p>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center gap-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  className="w-14 h-14 text-2xl text-center rounded-xl border border-green-200 bg-white/70 focus:ring-2 focus:ring-green-300 focus:outline-none shadow font-bold"
                  required
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-bold text-lg shadow-lg hover:from-green-500 hover:to-green-700 transition"
            >
              Verify OTP
            </button>
            {submitted && (
              <div className="mt-4 text-center text-green-700 font-semibold animate-fade-in">
                OTP Verified! Registration complete.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
