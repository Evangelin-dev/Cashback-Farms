import GreenFlowBackground from '@/components/Background/GreenFlowBackground';
import { DEFAULT_COUNTRY_OPTIONS } from "@/components/countryCode";
import apiClient from "@/src/utils/api/apiClient";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- Interfaces for better type safety ---
interface IForm {
  first_name: string;
  company_name: string;
  phone_number: string;
  company_number: string;
  email: string;
  user_type: 'real_estate_agent' | 'b2b_vendor' | '';
}

const initialForm: IForm = {
  first_name: "",
  company_name: "",
  phone_number: "",
  company_number: "",
  email: "",
  user_type: "",
};

const RegistrationPage: React.FC = () => {
  const [form, setForm] = useState<IForm>(initialForm);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [phoneCountryCode, setPhoneCountryCode] = useState("+91");
  const [focusedField, setFocusedField] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = {
        ...form,
        mobile_number: `${phoneCountryCode}${form.phone_number}`,
    };

    try {
      await apiClient.post("agents/register/", payload);
      setShowOtpForm(true);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Registration failed. Please check your details.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        email: form.email,
        otp_code: otp,
      };
      
      await apiClient.post("auth/verify-otp/", payload);

      alert("Verification successful! You will be redirected.");
      setTimeout(() => {
        navigate("/");
      }, 800);

    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Invalid OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GreenFlowBackground>
      <div className="w-full max-w-xl rounded-3xl shadow-xl bg-white/80 backdrop-blur-lg border border-green-200/40 p-8 relative overflow-hidden transition-all duration-300">
        
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-gradient-to-br from-green-200/60 via-green-100/40 to-white/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-tr from-green-300/50 via-green-100/30 to-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-100/20 to-green-200/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          {!showOtpForm ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-green-700 to-green-800 drop-shadow-sm">
                  Create Your Account
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full"></div>
                <p className="text-green-800/80 text-base font-medium">
                  Join our network of professionals and unlock new opportunities.
                </p>
              </div>

              <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="group">
                    <label className="block text-green-800 font-bold mb-3 text-sm uppercase tracking-wide">
                      Full Name <span className="text-green-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="first_name" 
                        value={form.first_name} 
                        onChange={handleChange}
                        onFocus={() => setFocusedField('first_name')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full px-4 py-3 rounded-xl border-2 bg-white/90 backdrop-blur-sm font-medium text-gray-700 placeholder:text-gray-400 transition-all duration-300 shadow-sm hover:shadow-md ${
                          focusedField === 'first_name' || form.first_name 
                            ? 'border-green-400 ring-4 ring-green-100 scale-105' 
                            : 'border-green-200/60 hover:border-green-300'
                        }`}
                        placeholder="Enter your full name"
                        required 
                      />
                      {(focusedField === 'first_name' || form.first_name) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                      )}
                    </div>
                  </div>

                  {/* Company Name */}
                  <div className="group">
                    <label className="block text-green-800 font-bold mb-3 text-sm uppercase tracking-wide">
                      Company Name <span className="text-green-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="company_name" 
                        value={form.company_name} 
                        onChange={handleChange}
                        onFocus={() => setFocusedField('company_name')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full px-4 py-3 rounded-xl border-2 bg-white/90 backdrop-blur-sm font-medium text-gray-700 placeholder:text-gray-400 transition-all duration-300 shadow-sm hover:shadow-md ${
                          focusedField === 'company_name' || form.company_name 
                            ? 'border-green-400 ring-4 ring-green-100 scale-105' 
                            : 'border-green-200/60 hover:border-green-300'
                        }`}
                        placeholder="Enter company name"
                        required 
                      />
                      {(focusedField === 'company_name' || form.company_name) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                      )}
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="group">
                    <label className="block text-green-800 font-bold mb-3 text-sm uppercase tracking-wide">
                      Phone Number <span className="text-green-500">*</span>
                    </label>
                    <div className="flex rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="relative">
                        <select 
                          value={phoneCountryCode} 
                          onChange={(e) => setPhoneCountryCode(e.target.value)}
                          onFocus={() => setFocusedField('phone_code')}
                          onBlur={() => setFocusedField('')}
                          className={`px-3 py-3 border-2 border-r-0 bg-white/95 backdrop-blur-sm font-bold text-gray-700 focus:outline-none transition-all duration-300 min-w-[80px] ${
                            focusedField === 'phone_code' 
                              ? 'border-green-400 ring-4 ring-green-100' 
                              : 'border-green-200/60 hover:border-green-300'
                          }`}
                          style={{borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem'}}
                        >
                          {DEFAULT_COUNTRY_OPTIONS.map(c => (
                            <option key={`phone-${c.code}`} value={c.code} className="font-semibold">
                              {c.label}
                            </option>
                          ))}
                        </select>
                        {focusedField === 'phone_code' && (
                          <div className="absolute -top-1 -left-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="relative flex-1">
                        <input 
                          type="tel" 
                          name="phone_number" 
                          value={form.phone_number} 
                          onChange={handleChange}
                          onFocus={() => setFocusedField('phone_number')}
                          onBlur={() => setFocusedField('')}
                          className={`w-full px-4 py-3 border-2 border-l-0 bg-white/95 backdrop-blur-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none transition-all duration-300 ${
                              focusedField === 'phone_number' || form.phone_number 
                                ? 'border-green-400 ring-4 ring-green-100' 
                                : 'border-green-200/60 hover:border-green-300'
                            }`}
                            style={{borderTopRightRadius: '1rem', borderBottomRightRadius: '1rem'}}
                          placeholder="Enter phone number"
                          required 
                        />
                        {(focusedField === 'phone_number' || form.phone_number) && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Type */}
                  <div className="group">
                    <label className="block text-green-800 font-bold mb-3 text-sm uppercase tracking-wide">
                      User Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
            <select 
                        name="user_type" 
                        value={form.user_type} 
                        onChange={handleChange}
                        onFocus={() => setFocusedField('user_type')}
                        onBlur={() => setFocusedField('')}
                        required 
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white/95 backdrop-blur-sm font-medium text-gray-700 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md appearance-none cursor-pointer ${
                          focusedField === 'user_type' || form.user_type 
                            ? 'border-green-400 ring-4 ring-green-100 scale-105' 
                            : 'border-green-200/60 hover:border-green-300'
                        }`}
                      >
                        <option value="" disabled className="text-gray-400">Select User Type</option>
                        <option value="real_estate_agent" className="font-semibold text-gray-700">🏠 Real Estate Agent</option>
                        <option value="b2b_vendor" className="font-semibold text-gray-700">💼 B2B Vendor</option>
                      </select>
                      {/* Custom Dropdown Arrow */}
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className={`w-6 h-6 transition-all duration-300 ${focusedField === 'user_type' ? 'text-green-500 rotate-180' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      {(focusedField === 'user_type' || form.user_type) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                    <div className="group md:col-span-2">
                    <label className="block text-green-800 font-bold mb-3 text-sm uppercase tracking-wide">
                      Email Address <span className="text-green-500">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="email" 
                        name="email" 
                        value={form.email} 
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full px-4 py-3 rounded-xl border-2 bg-white/90 backdrop-blur-sm font-medium text-gray-700 placeholder:text-gray-400 transition-all duration-300 shadow-sm hover:shadow-md ${
                          focusedField === 'email' || form.email 
                            ? 'border-green-400 ring-4 ring-green-100 scale-105' 
                            : 'border-green-200/60 hover:border-green-300'
                        }`}
                        placeholder="Enter your email address"
                        required 
                      />
                      {(focusedField === 'email' || form.email) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-pulse">
                    <p className="text-red-700 font-semibold flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="group relative w-full py-3 rounded-2xl bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-black text-lg shadow-lg hover:shadow-green-300/40 transform hover:scale-102 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Registration...
                      </>
                    ) : (
                      <>
                        Create Account
                        <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8 text-center">
              {/* OTP Header */}
              <div className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center shadow-xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                  <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-green-700 to-green-800">
                  Verify Your Email
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full"></div>
                <p className="text-green-800/80 text-lg font-medium max-w-md mx-auto">
                  We've sent a verification code to{' '}
                  <span className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg">
                    {form.email}
                  </span>
                </p>
              </div>

              <form onSubmit={handleOtpVerifySubmit} className="space-y-8">
                <div className="group">
                  <label className="block text-green-800 font-bold mb-4 text-sm uppercase tracking-wide">
                    Enter Verification Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="otp"
                      value={otp}
                      onChange={(e) => {
                        setError(null);
                        setOtp(e.target.value);
                      }}
                      onFocus={() => setFocusedField('otp')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-6 py-4 text-center text-2xl font-black tracking-[0.4em] rounded-xl border-2 bg-white/95 backdrop-blur-sm text-green-700 placeholder:text-green-300 transition-all duration-300 shadow-lg hover:shadow-green-200/40 ${
                        focusedField === 'otp' || otp 
                          ? 'border-green-400 ring-4 ring-green-100 scale-105' 
                          : 'border-green-200/60 hover:border-green-300'
                      }`}
                      placeholder="••••••"
                      required
                      maxLength={6}
                    />
                    {(focusedField === 'otp' || otp) && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full animate-ping"></div>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg animate-pulse">
                    <p className="text-red-700 font-semibold flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </p>
                  </div>
                )}

                {/* Verify Button */}
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="group relative w-full py-5 rounded-2xl bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-black text-xl shadow-2xl hover:shadow-green-300/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Verify Account
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </GreenFlowBackground>
  );
};

export default RegistrationPage;