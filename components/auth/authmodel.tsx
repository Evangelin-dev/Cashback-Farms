import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showForgot, setShowForgot] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [signupError, setSignupError] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  // Helper: email validation
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Simulate OTP generation
  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!validateEmail(loginEmail)) {
      setLoginError('Invalid email address.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Password is required.');
      return;
    }
    // Simulate login success/failure
    // ...replace with real logic...
    setLoginError(''); // Clear error on success
    onClose();
  };

  // Handle signup
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    if (!signupName.trim()) {
      setSignupError('Name is required.');
      return;
    }
    if (!validateEmail(signupEmail)) {
      setSignupError('Invalid email address.');
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError('Passwords do not match.');
      return;
    }
    // Simulate signup success/failure
    // ...replace with real logic...
    setSignupError('');
    onClose();
  };

  // Handle forgot password (send OTP)
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    if (!validateEmail(forgotEmail)) {
      setForgotError('Enter a valid email.');
      return;
    }
    // Simulate sending OTP
    const newOtp = generateOtp();
    setOtp(newOtp);
    setOtpSent(true);
    setForgotSuccess(`OTP sent to ${forgotEmail} (demo: ${newOtp})`);
  };

  // Handle OTP verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    if (enteredOtp !== otp) {
      setForgotError('Invalid OTP.');
      return;
    }
    setForgotSuccess('OTP verified! You can now reset your password.');
    // ...show reset password fields if needed...
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-600">
            {showForgot
              ? 'Forgot Password'
              : activeTab === 'login'
              ? 'Login'
              : 'Sign Up'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 text-xl">
            ×
          </button>
        </div>

        {/* Tabs */}
        {!showForgot && (
          <div className="flex mb-4 border-b border-gray-200">
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
        )}

        {/* Forms */}
        {!showForgot && activeTab === 'login' && (
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
            />
            {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Login
            </button>
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => {
                  setShowForgot(true);
                  setForgotEmail('');
                  setOtpSent(false);
                  setForgotError('');
                  setForgotSuccess('');
                  setEnteredOtp('');
                }}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        )}

        {!showForgot && activeTab === 'signup' && (
          <form className="space-y-4" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-3 py-2 border rounded"
              value={signupName}
              onChange={e => setSignupName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 border rounded"
              value={signupEmail}
              onChange={e => setSignupEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded"
              value={signupPassword}
              onChange={e => setSignupPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border rounded"
              value={signupConfirm}
              onChange={e => setSignupConfirm(e.target.value)}
            />
            {signupError && <div className="text-red-500 text-sm">{signupError}</div>}
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Sign Up
            </button>
          </form>
        )}

        {/* Forgot Password Flow */}
        {showForgot && (
          <div>
            {!otpSent ? (
              <form className="space-y-4" onSubmit={handleSendOtp}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border rounded"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                />
                {forgotError && <div className="text-red-500 text-sm">{forgotError}</div>}
                {forgotSuccess && <div className="text-green-600 text-sm">{forgotSuccess}</div>}
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                  Send OTP
                </button>
                <button
                  type="button"
                  className="w-full text-gray-600 mt-2"
                  onClick={() => setShowForgot(false)}
                >
                  Back to Login
                </button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleVerifyOtp}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full px-3 py-2 border rounded"
                  value={enteredOtp}
                  onChange={e => setEnteredOtp(e.target.value)}
                />
                {forgotError && <div className="text-red-500 text-sm">{forgotError}</div>}
                {forgotSuccess && <div className="text-green-600 text-sm">{forgotSuccess}</div>}
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                  Verify OTP
                </button>
                <button
                  type="button"
                  className="w-full text-gray-600 mt-2"
                  onClick={() => setShowForgot(false)}
                >
                  Back to Login
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
