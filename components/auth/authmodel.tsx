import React, { useEffect, useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: {
    mobile: string;
    mobileVerified: boolean;
  }) => void;
  onEditProfile?: (user: {
    mobile: string;
    mobileVerified: boolean;
  }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showForgot, setShowForgot] = useState(false);

  // Mobile login/signup state
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [mobileVerified, setMobileVerified] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Country code state and options from API
  const [countryCode, setCountryCode] = useState('+91');
  const [countryOptions, setCountryOptions] = useState<{ code: string; label: string }[]>([
    { code: '+91', label: '🇮🇳 +91' }
  ]);

  useEffect(() => {
    // Example API: https://restcountries.com/v3.1/all
    // We'll fetch country calling codes and flags
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        const options = data
          .map((c: any) => {
            const code = c.idd?.root && c.idd?.suffixes?.[0]
              ? `${c.idd.root}${c.idd.suffixes[0]}`
              : null;
            if (!code) return null;
            // Use emoji flag if available, else country code
            const flag = c.flag || '';
            return {
              code,
              label: `${flag} ${code}`
            };
          })
          .filter(Boolean)
          // Remove duplicates and sort by code
          .filter((v: any, i: number, arr: any[]) => arr.findIndex(x => x.code === v.code) === i)
          .sort((a: any, b: any) => a.code.localeCompare(b.code));
        setCountryOptions(options.length ? options : [{ code: '+91', label: '🇮🇳 +91' }]);
      })
      .catch(() => {
        setCountryOptions([{ code: '+91', label: '🇮🇳 +91' }]);
      });
  }, []);

  // Helper: mobile validation (10 digits, Indian format)
  const validateMobile = (mobile: string) =>
    /^[6-9]\d{9}$/.test(mobile);

  // Helper: OTP generation
  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateMobile(mobile)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    const newOtp = generateOtp();
    setOtp(newOtp);
    setOtpSent(true);
    setSuccess(`OTP sent to ${countryCode} ${mobile} (demo: ${newOtp})`);
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (otpInput !== otp) {
      setError('Invalid OTP.');
      return;
    }
    setMobileVerified(true);
    setSuccess('Mobile number verified!');
    if (onAuthSuccess) {
      onAuthSuccess({
        mobile,
        mobileVerified: true,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl min-h-[500px] flex flex-col md:flex-row">
        {/* Image and bullet points */}
        <div className="flex flex-col items-center justify-center bg-green-50 p-8 md:w-1/3 w-full border-b md:border-b-0 md:border-r border-green-200">
          <img
            src="https://www.gravatar.com/avatar/?d=mp&s=80"
            alt="Auth"
            className="w-16 h-16 rounded-full mb-2"
          />
          <ul className="mt-2 space-y-1 text-left w-full">
            <li className="flex items-center text-green-700 text-xs">
              <svg className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Secure authentication
            </li>
            <li className="flex items-center text-green-700 text-xs">
              <svg className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              OTP verification for mobile
            </li>
            <li className="flex items-center text-green-700 text-xs">
              <svg className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Edit profile anytime
            </li>
          </ul>
        </div>
        {/* Form section */}
        <div className="flex-1 p-8 flex flex-col justify-center items-center relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 w-full">
            <h2 className="text-lg font-bold text-green-600 mx-auto">
              {activeTab === 'login' ? 'Login' : 'Sign Up'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-600 text-xl absolute right-8 md:static">
              ×
            </button>
          </div>
          {/* Tabs */}
          <div className="w-full flex mb-4 border-b border-gray-200 justify-center">
            <button
              onClick={() => setActiveTab('login')}
              className={`w-1/2 py-2 text-sm font-medium ${
                activeTab === 'login'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`w-1/2 py-2 text-sm font-medium ${
                activeTab === 'signup'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              Sign Up
            </button>
          </div>
          {/* Mobile login/signup form */}
          <div className="w-full flex flex-col items-center flex-1">
            {!otpSent ? (
              <form className="space-y-4 w-full flex flex-col items-center" onSubmit={handleSendOtp}>
                <div className="w-full flex items-center mb-2">
                  <select
                    className="border rounded-l px-2 py-2 text-sm bg-gray-50"
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                  >
                    {countryOptions.map(opt => (
                      <option key={opt.code} value={opt.code}>{opt.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    className="flex-1 px-3 py-2 border-t border-b border-r rounded-r text-sm text-center"
                    value={mobile}
                    maxLength={10}
                    onChange={e => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                </div>
                {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
                {success && <div className="text-green-600 text-xs mb-2">{success}</div>}
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm">
                  Send OTP
                </button>
              </form>
            ) : (
              <form className="space-y-4 w-full flex flex-col items-center" onSubmit={handleVerifyOtp}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full px-3 py-2 border rounded mb-2 text-sm text-center"
                  value={otpInput}
                  onChange={e => setOtpInput(e.target.value)}
                />
                {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
                {success && <div className="text-green-600 text-xs mb-2">{success}</div>}
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 text-sm">
                  Verify OTP
                </button>
              </form>
            )}
          </div>
          {/* Terms and Conditions at the bottom */}
          <div className="absolute left-0 right-0 bottom-6 text-xs text-center text-gray-500 w-full">
            by continuing, you agree to our{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 underline hover:text-green-700 font-semibold"
            >
              Terms and Conditions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
