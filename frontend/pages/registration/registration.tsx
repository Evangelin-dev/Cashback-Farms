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
  const [showOtpForm, setShowOtpForm] = useState(false); // <-- State to control which form is visible
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setError(null); // Clear error on new input
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- Step 1: Handle the initial registration submission to get an OTP ---
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // This API call should trigger the backend to send an OTP
      await apiClient.post("agents/register/", form);

      // On success, switch to the OTP form
      setShowOtpForm(true);
console.log(form,'form')
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Registration failed. Please check your details.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 2: Handle the OTP verification ---
  const handleOtpVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // The verification API needs the email and the entered OTP
      const payload = {
        email: form.email,
        otp_code: otp,
      };
      
      // IMPORTANT: Replace 'agents/verify-otp/' with your actual verification endpoint
      await apiClient.post("auth/verify-otp/", payload);

      // On successful verification, show success and navigate
      alert("Verification successful! You will be redirected.");
      setTimeout(() => {
        navigate("/"); // Navigate to home or login page
      }, 800);

    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Invalid OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  // --- The Main Render Logic ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100 py-12 px-4">
      <div className="w-full max-w-xl rounded-3xl shadow-2xl bg-white/70 backdrop-blur-lg border border-green-200 p-10 relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute -top-16 -left-16 w-72 h-72 bg-gradient-to-br from-green-200 via-green-100 to-white opacity-40 rounded-full blur-2xl" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-gradient-to-tr from-green-300 via-green-100 to-white opacity-30 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10">
          {/* --- Conditional Rendering: Show OTP form or Registration form --- */}
          {!showOtpForm ? (
            // --- REGISTRATION FORM ---
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mb-2 drop-shadow-lg">
                Create Your Account
              </h1>
              <p className="text-green-900 text-center mb-8 font-medium">
                Join our network of professionals.
              </p>
              <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-green-700 font-semibold mb-1">First Name</label>
                    <input type="text" name="first_name" value={form.first_name} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-green-200 bg-white/70 focus:ring-2 focus:ring-green-300 focus:outline-none shadow" required />
                  </div>
                  <div>
                    <label className="block text-green-700 font-semibold mb-1">Company Name</label>
                    <input type="text" name="company_name" value={form.company_name} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-green-200 bg-white/70 focus:ring-2 focus:ring-green-300 focus:outline-none shadow" required />
                  </div>
                  <div>
                    <label className="block text-green-700 font-semibold mb-1">Phone Number</label>
                    <input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-green-200 bg-white/70 focus:ring-2 focus:ring-green-300 focus:outline-none shadow" required />
                  </div>
                  <div>
                    <label className="block text-green-700 font-semibold mb-1">Company Number</label>
                    <input type="text" name="company_number" value={form.company_number} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-green-200 bg-white/70 focus:ring-2 focus:ring-green-300 focus:outline-none shadow" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-green-700 font-semibold mb-1">User Type <span className="text-red-500">*</span></label>
                      <select name="user_type" value={form.user_type} onChange={handleChange} required className="w-full px-4 py-2 rounded-xl border border-green-200 bg-white/70 focus:ring-2 focus:ring-green-300 focus:outline-none shadow">
                      <option value="" disabled>Select User Type</option>
                      <option value="real_estate_agent">Real Estate Agent</option>
                      <option value="b2b_vendor">B2B Vendor</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-green-700 font-semibold mb-1">Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border border-green-200 bg-white/70 focus:ring-2 focus:ring-green-300 focus:outline-none shadow" required />
                  </div>
                </div>
                {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full py-3 mt-2 rounded-2xl bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-bold text-lg shadow-lg hover:from-green-500 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? 'Sending...' : 'Register'}
                </button>
              </form>
            </div>
          ) : (
            // --- OTP VERIFICATION FORM ---
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mb-2 drop-shadow-lg">
                Verify Your Email
              </h1>
              <p className="text-green-900 text-center mb-8 font-medium">
                An OTP has been sent to <span className="font-bold">{form.email}</span>. Please check your inbox.
              </p>
              <form onSubmit={handleOtpVerifySubmit} className="space-y-6">
                <div>
                  <label className="block text-green-700 font-semibold mb-1">Enter OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => {
                      setError(null);
                      setOtp(e.target.value);
                    }}
                    className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] rounded-xl border border-green-200 bg-white/70 focus:ring-2 focus:ring-green-300 focus:outline-none shadow"
                    required
                    maxLength={6}
                  />
                </div>
                {error && <p className="text-red-500 text-center font-semibold">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full py-3 mt-2 rounded-2xl bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-bold text-lg shadow-lg hover:from-green-500 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage; // Note: Renamed from RegurestionPage for correctness