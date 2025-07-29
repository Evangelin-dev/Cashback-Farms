import { DEFAULT_COUNTRY_OPTIONS } from "@/components/countryCode";
import apiClient from '@/src/utils/api/apiClient';
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
  const [redirectLoading, setRedirectLoading] = useState(false);
  const navigate = useNavigate();

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    town: "",
    city: "",
    state: "",
    country: ""
  });

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

  const handleSignupDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!input) {
      setLoading(false);
      setError('Enter your phone number or email.');
      return;
    }

    const isMobileInput = isMobile(input);
    const isEmailInput = isEmail(input);

    if (!isMobileInput && !isEmailInput) {
      setLoading(false);
      setError('Enter a valid phone number or email.');
      return;
    }

    let payload;
    let successIdentifier;
    if (isMobileInput) {
        successIdentifier = `${countryCode}${input}`;
        payload = { mobile_number: successIdentifier };
    } else { // isEmailInput
        successIdentifier = input;
        payload = { email: successIdentifier };
    }

    try {
      const res = await apiClient.post('/auth/request-otp/', payload);
      setOtpSent(true);
      setSuccess(
        isMobileInput
          ? `OTP sent to ${successIdentifier}`
          : `Login link sent to ${successIdentifier}`
      );
      setOtp(res?.data?.otp)
    }  catch (err: any) {
      const errorDetail = err.response?.data?.detail;
      if (errorDetail && errorDetail.includes('No CustomUser matches the given query')) {
        setError('User with this email or phone number does not exist.');
      } else {
        setError(
          err.response?.data?.message || 'Failed to send OTP. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };


  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const isMobileInput = isMobile(input);

    let payload;
    if (isMobileInput) {
        payload = {
            mobile_number: `${countryCode}${input}`,
            otp_code: otpInput
        };
    } else { // isEmailInput
        payload = {
            email: input,
            otp_code: otpInput
        };
    }

    try {
      const login = await apiClient.post(
        '/auth/verify-otp/',
        payload,
        { headers: { Authorization: '' } }
      );
      setMobileVerified(true);
      setSuccess('Verified!');
      if (onAuthSuccess) {
        onAuthSuccess({
          mobile: input,
          mobileVerified: true,
        });
      }

      const { access, refresh, user } = login; // Corrected: access data property
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('currentUser', JSON.stringify(user));

      setTimeout(() => {
        setRedirectLoading(true);
        setTimeout(() => {
          setRedirectLoading(false);
          onClose();

           if (user.user_type === 'real_estate_agent') {
            window.location.href = '/realestate/dashboard';
          } else if (user.user_type === 'client') {
            window.location.href = '/user-dashboard';
          }else if(user.user_type === 'b2b_vendor') {
            window.location.href = '/b2b/products';
          }
          else {
            window.location.href = '/';
          }
        }, 800);
      }, 900);
    } catch (err: any) {
       const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Invalid OTP. Please try again.';
       setError(errorMessage);
    } finally {
      setLoading(false);
    }
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
  
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const payload = {
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        gender: signupData.gender,
        date_of_birth: signupData.dob,
        email: signupData.email,
        mobile_number:  `${countryCode}${signupData.phone}`,
        town: signupData.town,
        city: signupData.city,
        state: signupData.state,
        country: signupData.country,
        password: import.meta.env.VITE_PASSWORD,
        confirm_password: import.meta.env.VITE_PASSWORD,
        user_type: 'client'
    };

    try {
        await apiClient.post('/client/register/', payload);
        setInput(signupData.email);
        setOtpSent(true);
        setSuccess('Registration successful! Please check your email for an OTP to continue.');
    } catch (err: any) {
        const responseError = err.response?.data;
        if (typeof responseError === 'object' && responseError !== null) {
            const firstErrorKey = Object.keys(responseError)[0];
            const firstErrorMessage = responseError[firstErrorKey];
            setError(Array.isArray(firstErrorMessage) ? `${firstErrorKey}: ${firstErrorMessage[0]}` : 'Registration failed. Please check your details.');
        } else {
            setError(responseError || 'An unknown error occurred.');
        }
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fade-in-fast">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl min-h-[520px] flex flex-col md:flex-row overflow-hidden animate-slide-up">
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-white p-8 md:w-1/2 w-full border-b md:border-b-0 md:border-r border-green-200 relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mb-4 animate-bounce-slow">
            <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Auth" className="w-20 h-20 object-cover rounded-full" />
          </div>
          <ul className="mt-2 space-y-2 text-left w-full">
            <li className="flex items-center text-green-700 text-sm font-semibold animate-fade-in-fast"><svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Secure plot booking & account access</li>
            <li className="flex items-center text-green-700 text-sm font-semibold animate-fade-in-fast"><svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Your trusted plot booking partner</li>
            <li className="flex items-center text-green-700 text-sm font-semibold animate-fade-in-fast"><svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Track your plot bookings & documents</li>
          </ul>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center"><span className="text-xs text-green-400 font-semibold animate-pulse">Cashback Farms</span></div>
        </div>
        <div className="flex-1 p-8 flex flex-col justify-center items-center relative bg-white">
          <div className="flex justify-between items-center mb-4 w-full">
            <h2 className="text-2xl font-extrabold text-green-600 mx-auto tracking-tight animate-fade-in-fast">{activeTab === 'login' ? 'Login' : 'Sign Up'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-red-600 text-2xl absolute right-8 md:static transition-all duration-200" aria-label="Close">×</button>
          </div>
          <div className="w-full flex mb-4 border-b border-gray-200 justify-center">
            <button onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); setOtpSent(false); }} className={`w-1/2 py-2 text-base font-semibold transition-all duration-200 ${activeTab === 'login' ? 'text-green-600 border-b-2 border-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600'}`}>Login</button>
            <button onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); setOtpSent(false); }} className={`w-1/2 py-2 text-base font-semibold transition-all duration-200 ${activeTab === 'signup' ? 'text-green-600 border-b-2 border-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600'}`}>Sign Up</button>
          </div>
          
          <div className="w-full flex flex-col items-center flex-1">
            {!otpSent ? (
              activeTab === 'login' ? (
                <form className="space-y-4 w-full flex flex-col items-center animate-fade-in-fast" onSubmit={handleSendOtp}>
                  <div className="w-full flex items-center mb-2">
                    {!isEmail(input) && (<select className="border rounded-l px-2 py-2 text-sm bg-gray-50" value={countryCode} onChange={e => setCountryCode(e.target.value)} disabled={isEmail(input)}>{countryOptions.map(opt => (<option key={opt.code} value={opt.code}>{opt.label}</option>))}</select>)}
                    <input type="text" placeholder="Phone number or Email" className={`flex-1 px-3 py-2 border-t border-b ${isEmail(input) ? 'rounded' : 'border-r rounded-r'} text-base text-center focus:ring-2 focus:ring-green-200 transition-all duration-200`} value={input} onChange={e => setInput(e.target.value.replace(/[^a-zA-Z0-9@._+-]/g, ''))} autoFocus/>
                  </div>
                  {error && <div className="text-red-500 text-xs mb-2 animate-shake">{error}</div>}
                  {success && <div className="text-green-600 text-xs mb-2 animate-fade-in-fast">{success}</div>}
                  <button type="submit" className={`w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-800 shadow transition-all duration-200 text-base flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`} disabled={loading}>{loading && <span className="loader mr-2"></span>}{isEmail(input) ? 'Send Login Link' : 'Send OTP'}</button>
                  <div className="w-full flex items-center my-2"><div className="flex-grow border-t border-gray-200"></div><span className="mx-2 text-xs text-gray-400">or</span><div className="flex-grow border-t border-gray-200"></div></div>
                  <button type="button" className={`w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2 text-base font-semibold text-gray-700 hover:bg-gray-50 shadow transition-all duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`} onClick={handleGoogleLogin} disabled={loading}><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />Continue with Google</button>
                </form>
              ) : (
                <form className="space-y-2 w-full flex flex-col items-center animate-fade-in-fast overflow-y-auto md:max-h-[400px] max-h-[300px] pr-2" onSubmit={handleSignupSubmit}>
                    <div className="w-full grid grid-cols-2 gap-2"><input type="text" name="firstName" placeholder="First Name" value={signupData.firstName} onChange={handleSignupDataChange} className="w-full px-3 py-2 border rounded-lg text-sm" required /><input type="text" name="lastName" placeholder="Last Name" value={signupData.lastName} onChange={handleSignupDataChange} className="w-full px-3 py-2 border rounded-lg text-sm" required /></div>
                    <div className="w-full grid grid-cols-2 gap-2"><select name="gender" value={signupData.gender} onChange={handleSignupDataChange} className="w-full px-3 py-2 border rounded-lg text-sm" required><option value="">Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select><input type="text" name="dob" placeholder="Date of Birth" onFocus={(e) => e.target.type='date'} onBlur={(e) => e.target.type='text'} value={signupData.dob} onChange={handleSignupDataChange} className="w-full px-3 py-2 border rounded-lg text-sm" required /></div>
                    <input type="email" name="email" placeholder="Email Address" value={signupData.email} onChange={handleSignupDataChange} className="w-full px-3 py-2 border rounded-lg text-sm" required />
                    <div className="w-full flex items-center"><select className="border rounded-l px-2 py-2 text-sm bg-gray-50" value={countryCode} onChange={e => setCountryCode(e.target.value)}>{countryOptions.map(opt => (<option key={opt.code} value={opt.code}>{opt.label}</option>))}</select><input type="tel" name="phone" placeholder="Phone Number" value={signupData.phone} onChange={handleSignupDataChange} className="flex-1 w-full px-3 py-2 border-t border-b border-r rounded-r-lg text-sm" required /></div>
                    <div className="w-full grid grid-cols-2 gap-2"><input type="text" name="town" placeholder="Town/Village" value={signupData.town} onChange={handleSignupDataChange} className="w-full px-3 py-2 border rounded-lg text-sm" required /><input type="text" name="city" placeholder="City" value={signupData.city} onChange={handleSignupDataChange} className="w-full px-3 py-2 border rounded-lg text-sm" required /></div>
                    <div className="w-full grid grid-cols-2 gap-2"><input type="text" name="state" placeholder="State" value={signupData.state} onChange={handleSignupDataChange} className="w-full px-3 py-2 border rounded-lg text-sm" required /><input type="text" name="country" placeholder="Country" value={signupData.country} onChange={handleSignupDataChange} className="w-full px-3 py-2 border rounded-lg text-sm" required /></div>
                    {/* Password fields removed as per requirements */}
                    {error && <div className="text-red-500 text-xs pt-1 animate-shake">{error}</div>}
                    {success && <div className="text-green-600 text-xs pt-1 animate-fade-in-fast">{success}</div>}
                    <button type="submit" className={`w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-800 shadow transition-all duration-200 text-base flex items-center justify-center gap-2 mt-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`} disabled={loading}>{loading && <span className="loader mr-2"></span>}Create Account</button>
                </form>
              )
            ) : (
              <form className="space-y-4 w-full flex flex-col items-center animate-fade-in-fast" onSubmit={handleVerifyOtp}>
                <p className='text-sm text-gray-600 text-center'>An OTP has been sent to <br/><span className='font-semibold text-green-700'>{isMobile(input) ? `${countryCode}${input}` : input}</span>.</p>
                <input type="text" placeholder="Enter OTP" className="w-full px-3 py-2 border rounded-lg mb-2 text-base text-center focus:ring-2 focus:ring-green-200 transition-all duration-200" value={otpInput} onChange={e => setOtpInput(e.target.value)} autoFocus/>
                {error && <div className="text-red-500 text-xs mb-2 animate-shake">{error}</div>}
                {success && <div className="text-green-600 text-xs mb-2 animate-fade-in-fast">{success}</div>}
                <button type="submit" className={`w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-800 shadow transition-all duration-200 text-base flex items-center justify-center gap-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`} disabled={loading}>{loading && <span className="loader mr-2"></span>}Verify & Proceed</button>
                <button type="button" onClick={() => { setOtpSent(false); setError(''); setSuccess(''); }} className="mt-4 text-xs text-gray-500 hover:text-green-600 hover:underline font-semibold">Go Back</button>
              </form>
            )}
          </div>
          
          <div className="absolute left-0 right-0 bottom-4 text-xs text-center text-gray-500 w-full animate-fade-in-fast">by continuing, you agree to our{' '}<button type="button" className="text-green-600 underline hover:text-green-700 font-semibold" onClick={() => setShowTerms(true)} style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}>Terms and Conditions</button></div>
        </div>
      </div>
      {showTerms && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"><div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 relative animate-fade-in-fast"><button className="absolute top-2 right-4 text-gray-400 hover:text-red-600 text-2xl" onClick={() => setShowTerms(false)} aria-label="Close">×</button><iframe src="/Terms_&_Conditions" title="Terms and Conditions" className="w-full h-[60vh] rounded" style={{ border: "none" }} /></div></div>)}
      <style>{`.animate-fade-in-fast { animation: fadeInFast 0.5s; } @keyframes fadeInFast { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} } .animate-slide-up { animation: slideUp 0.5s cubic-bezier(.4,2,.6,1) both; } @keyframes slideUp { from { transform: translateY(80px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } } .animate-bounce-slow { animation: bounce-slow 1.5s infinite; } @keyframes bounce-slow { 0%, 100% { transform: translateY(0);} 50% { transform: translateY(-10px);} } .animate-shake { animation: shake 0.4s; } @keyframes shake { 0% { transform: translateX(0);} 20% { transform: translateX(-6px);} 40% { transform: translateX(6px);} 60% { transform: translateX(-4px);} 80% { transform: translateX(4px);} 100% { transform: translateX(0);} } .loader { border: 2px solid #e5e7eb; border-top: 2px solid #22c55e; border-radius: 50%; width: 18px; height: 18px; animation: spin 0.7s linear infinite; display: inline-block; } @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
    </div>
  );
};

export default AuthModal;