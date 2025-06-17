import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const isEmail = (input: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

const isMobile = (input: string) =>
  /^[6-9]\d{9}$/.test(input);

const DEFAULT_COUNTRY_OPTIONS = [
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+81', label: '🇯🇵 +81' },
  { code: '+971', label: '🇦🇪 +971' },
  { code: '+49', label: '🇩🇪 +49' },
  { code: '+33', label: '🇫🇷 +33' },
  { code: '+7', label: '🇷🇺 +7' },
  { code: '+86', label: '🇨🇳 +86' },
  { code: '+880', label: '🇧🇩 +880' },
  { code: '+92', label: '🇵🇰 +92' },
  { code: '+94', label: '🇱🇰 +94' },
  { code: '+966', label: '🇸🇦 +966' },
  { code: '+973', label: '🇧🇭 +973' },
  { code: '+974', label: '🇶🇦 +974' },
  { code: '+65', label: '🇸🇬 +65' },
  { code: '+60', label: '🇲🇾 +60' },
  { code: '+62', label: '🇮🇩 +62' },
  { code: '+63', label: '🇵🇭 +63' },
  { code: '+852', label: '🇭🇰 +852' },
  { code: '+82', label: '🇰🇷 +82' },
  { code: '+34', label: '🇪🇸 +34' },
  { code: '+39', label: '🇮🇹 +39' },
  { code: '+351', label: '🇵🇹 +351' },
  { code: '+55', label: '🇧🇷 +55' },
  { code: '+27', label: '🇿🇦 +27' },
  { code: '+234', label: '🇳🇬 +234' },
  { code: '+20', label: '🇪🇬 +20' },
  { code: '+254', label: '🇰🇪 +254' },
];

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [input, setInput] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [mobileVerified, setMobileVerified] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [countryOptions, setCountryOptions] = useState<{ code: string; label: string }[]>(DEFAULT_COUNTRY_OPTIONS);
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(res => res.json())
      .then(data => {
        const options = data
          .map((c: any) => {
            const code = c.idd?.root && c.idd?.suffixes?.[0]
              ? `${c.idd.root}${c.idd.suffixes[0]}`
              : null;
            if (!code) return null;
            const flag = c.flag || '';
            return {
              code,
              label: `${flag} ${code}`
            };
          })
          .filter(Boolean)
          .filter((v: any, i: number, arr: any[]) => arr.findIndex(x => x.code === v.code) === i)
          .sort((a: any, b: any) => a.code.localeCompare(b.code));
        // Merge with default options, avoid duplicates
        const merged = [
          ...DEFAULT_COUNTRY_OPTIONS,
          ...options.filter((opt: any) => !DEFAULT_COUNTRY_OPTIONS.some(def => def.code === opt.code))
        ];
        setCountryOptions(merged);
      })
      .catch(() => {
        setCountryOptions(DEFAULT_COUNTRY_OPTIONS);
      });
  }, []);

  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!input) {
        setError('Enter your phone number or email.');
        return;
      }
      if (isMobile(input)) {
        const newOtp = generateOtp();
        setOtp(newOtp);
        setOtpSent(true);
        setSuccess(`OTP sent to ${countryCode} ${input} (demo: ${newOtp})`);
      } else if (isEmail(input)) {
        setOtpSent(true);
        setSuccess(`Login link sent to ${input} (demo: use "123456" as OTP)`);
        setOtp('123456');
      } else {
        setError('Enter a valid phone number or email.');
      }
    }, 900);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otpInput !== otp) {
        setError('Invalid OTP.');
        return;
      }
      setMobileVerified(true);
      setSuccess('Verified!');
      if (onAuthSuccess) {
        onAuthSuccess({
          mobile: input,
          mobileVerified: true,
        });
      }
      setTimeout(() => {
        onClose();
        navigate('/Landing');
      }, 800);
    }, 900);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setSuccess('');
    setTimeout(() => {
      setLoading(false);
      setSuccess('Logged in with Google!');
      setTimeout(() => {
        if (onAuthSuccess) {
          onAuthSuccess({
            mobile: 'googleuser@gmail.com',
            mobileVerified: true,
          });
        }
        onClose();
        navigate('/realestate');
      }, 900);
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in-fast">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl min-h-[520px] flex flex-col md:flex-row overflow-hidden animate-slide-up">
        {/* Left: Illustration & Features */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-white p-8 md:w-1/2 w-full border-b md:border-b-0 md:border-r border-green-200 relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mb-4 animate-bounce-slow">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Auth"
              className="w-20 h-20 object-cover rounded-full"
            />
          </div>
          <ul className="mt-2 space-y-2 text-left w-full">
            <li className="flex items-center text-green-700 text-sm font-semibold animate-fade-in-fast">
              <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Secure plot booking & account access
            </li>
            <li className="flex items-center text-green-700 text-sm font-semibold animate-fade-in-fast">
              <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
               Your trusted plot booking partner
            </li>        
            <li className="flex items-center text-green-700 text-sm font-semibold animate-fade-in-fast">
              <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Track your plot bookings & documents
            </li>
          </ul>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <span className="text-xs text-green-400 font-semibold animate-pulse">Cashback Farms</span>
          </div>
        </div>
        {/* Right: Form */}
        <div className="flex-1 p-8 flex flex-col justify-center items-center relative bg-white">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 w-full">
            <h2 className="text-2xl font-extrabold text-green-600 mx-auto tracking-tight animate-fade-in-fast">
              {activeTab === 'login' ? 'Login' : 'Sign Up'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-600 text-2xl absolute right-8 md:static transition-all duration-200"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          {/* Tabs */}
          <div className="w-full flex mb-4 border-b border-gray-200 justify-center">
            <button
              onClick={() => setActiveTab('login')}
              className={`w-1/2 py-2 text-base font-semibold transition-all duration-200 ${
                activeTab === 'login'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`w-1/2 py-2 text-base font-semibold transition-all duration-200 ${
                activeTab === 'signup'
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              Sign Up
            </button>
          </div>
          {/* Unified login/signup form */}
          <div className="w-full flex flex-col items-center flex-1">
            {!otpSent ? (
              <form className="space-y-4 w-full flex flex-col items-center animate-fade-in-fast" onSubmit={handleSendOtp}>
                <div className="w-full flex items-center mb-2">
                  {!isEmail(input) && (
                    <select
                      className="border rounded-l px-2 py-2 text-sm bg-gray-50"
                      value={countryCode}
                      onChange={e => setCountryCode(e.target.value)}
                      disabled={isEmail(input)}
                    >
                      {countryOptions.map(opt => (
                        <option key={opt.code} value={opt.code}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                  <input
                    type="text"
                    placeholder="Phone number or Email"
                    className={`flex-1 px-3 py-2 border-t border-b ${isEmail(input) ? 'rounded' : 'border-r rounded-r'} text-base text-center focus:ring-2 focus:ring-green-200 transition-all duration-200`}
                    value={input}
                    onChange={e => setInput(e.target.value.replace(/[^a-zA-Z0-9@._+-]/g, ''))}
                    autoFocus
                  />
                </div>
                {error && <div className="text-red-500 text-xs mb-2 animate-shake">{error}</div>}
                {success && <div className="text-green-600 text-xs mb-2 animate-fade-in-fast">{success}</div>}
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-800 shadow transition-all duration-200 text-base flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading && <span className="loader mr-2"></span>}
                  {isEmail(input) ? 'Send Login Link' : 'Send OTP'}
                </button>
                <div className="w-full flex items-center my-2">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="mx-2 text-xs text-gray-400">or</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
                <button
                  type="button"
                  className={`w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2 text-base font-semibold text-gray-700 hover:bg-gray-50 shadow transition-all duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </button>
              </form>
            ) : (
              <form className="space-y-4 w-full flex flex-col items-center animate-fade-in-fast" onSubmit={handleVerifyOtp}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full px-3 py-2 border rounded-lg mb-2 text-base text-center focus:ring-2 focus:ring-green-200 transition-all duration-200"
                  value={otpInput}
                  onChange={e => setOtpInput(e.target.value)}
                  autoFocus
                />
                {error && <div className="text-red-500 text-xs mb-2 animate-shake">{error}</div>}
                {success && <div className="text-green-600 text-xs mb-2 animate-fade-in-fast">{success}</div>}
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-800 shadow transition-all duration-200 text-base flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading && <span className="loader mr-2"></span>}
                  Verify
                </button>
              </form>
            )}
          </div>
          {/* Terms and Conditions at the bottom */}
          <div className="absolute left-0 right-0 bottom-4 text-xs text-center text-gray-500 w-full animate-fade-in-fast">
            by continuing, you agree to our{' '}
            <button
              type="button"
              className="text-green-600 underline hover:text-green-700 font-semibold"
              onClick={() => setShowTerms(true)}
              style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
            >
              Terms and Conditions
            </button>
          </div>
        </div>
      </div>
      {/* Terms Popup */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative animate-fade-in-fast">
            <button
              className="absolute top-2 right-4 text-gray-400 hover:text-red-600 text-2xl"
              onClick={() => setShowTerms(false)}
              aria-label="Close"
            >×</button>
            <iframe
              src="/terms"
              title="Terms and Conditions"
              className="w-full h-[60vh] rounded"
              style={{ border: "none" }}
            />
          </div>
        </div>
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
        .animate-shake {
          animation: shake 0.4s;
        }
        @keyframes shake {
          0% { transform: translateX(0);}
          20% { transform: translateX(-6px);}
          40% { transform: translateX(6px);}
          60% { transform: translateX(-4px);}
          80% { transform: translateX(4px);}
          100% { transform: translateX(0);}
        }
        .loader {
          border: 2px solid #e5e7eb;
          border-top: 2px solid #22c55e;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
      `}</style>
    </div>
  );
};

export default AuthModal;