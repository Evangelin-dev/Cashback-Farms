import React, { useState } from 'react';
import MyProperty from '../myproperty/MyProperty';

interface DashboardProps {
  name: string;
  email: string;
  mobile: string;
  emailVerified: boolean;
  mobileVerified: boolean;
  onEditProfile?: (user: {
    name: string;
    email: string;
    mobile: string;
    emailVerified: boolean;
    mobileVerified: boolean;
  }) => void;
}

const subNavItems = [
  { key: 'profile', label: 'Basic Profile' },
  { key: 'payment', label: 'Payment History' },
  { key: 'property', label: 'My Property' },
  { key: 'interested', label: 'Interested in Your Properties' },
  { key: 'owners', label: 'Owners You Contacted' },
  { key: 'bookmysqft', label: 'Book My Sqft' }, 
];

const Dashboard: React.FC<DashboardProps> = ({
  name,
  email,
  mobile,
  emailVerified,
  mobileVerified,
  onEditProfile,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);
  const [editMobile, setEditMobile] = useState(mobile);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('profile');

  // Verification states for edited email/mobile
  const [editEmailVerified, setEditEmailVerified] = useState(emailVerified);
  const [editMobileVerified, setEditMobileVerified] = useState(mobileVerified);
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [emailOtpError, setEmailOtpError] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtpInput, setMobileOtpInput] = useState('');
  const [mobileOtpError, setMobileOtpError] = useState('');

  // Validation helpers
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateName = (name: string) =>
    /^[A-Za-z\s]+$/.test(name);
  const validateMobile = (mobile: string) =>
    /^[6-9]\d{9}$/.test(mobile);

  // Gravatar fallback if no uploaded image
  const getGravatarUrl = (email: string) => {
    if (editImagePreview) return editImagePreview;
    const hash = email
      ? require('crypto')
          .createHash('md5')
          .update(email.trim().toLowerCase())
          .digest('hex')
      : '';
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImage(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  // OTP helpers
  const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Email OTP send/verify for edit
  const handleSendEmailOtp = () => {
    setEmailOtpError('');
    if (!validateEmail(editEmail)) {
      setEmailOtpError('Enter a valid email.');
      return;
    }
    const otp = generateOtp();
    setEmailOtp(otp);
    setEmailOtpSent(true);
    setEmailOtpError(`OTP sent to ${editEmail} (demo: ${otp})`);
  };
  const handleVerifyEmailOtp = () => {
    setEmailOtpError('');
    if (emailOtpInput !== emailOtp) {
      setEmailOtpError('Invalid OTP.');
      return;
    }
    setEditEmailVerified(true);
    setEmailOtpError('Email verified!');
  };

  // Mobile OTP send/verify for edit
  const handleSendMobileOtp = () => {
    setMobileOtpError('');
    if (!validateMobile(editMobile)) {
      setMobileOtpError('Enter a valid 10-digit mobile number.');
      return;
    }
    const otp = generateOtp();
    setMobileOtp(otp);
    setMobileOtpSent(true);
    setMobileOtpError(`OTP sent to ${editMobile} (demo: ${otp})`);
  };
  const handleVerifyMobileOtp = () => {
    setMobileOtpError('');
    if (mobileOtpInput !== mobileOtp) {
      setMobileOtpError('Invalid OTP.');
      return;
    }
    setEditMobileVerified(true);
    setMobileOtpError('Mobile number verified!');
  };

  // Save handler
  const handleSave = () => {
    setError('');
    if (!validateName(editName.trim())) {
      setError('Name should only contain alphabets and spaces.');
      return;
    }
    if (!validateEmail(editEmail)) {
      setError('Invalid email address.');
      return;
    }
    if (!validateMobile(editMobile)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    if (!editEmailVerified) {
      setError('Please verify your email.');
      return;
    }
    if (!editMobileVerified) {
      setError('Please verify your mobile number.');
      return;
    }
    if (onEditProfile) {
      onEditProfile({
        name: editName,
        email: editEmail,
        mobile: editMobile,
        emailVerified: editEmailVerified,
        mobileVerified: editMobileVerified,
      });
    }
    setEditMode(false);
  };

  // Reset edit state on cancel
  const handleCancel = () => {
    setEditMode(false);
    setEditName(name);
    setEditEmail(email);
    setEditMobile(mobile);
    setEditImage(null);
    setEditImagePreview('');
    setEditEmailVerified(emailVerified);
    setEditMobileVerified(mobileVerified);
    setEmailOtp('');
    setEmailOtpSent(false);
    setEmailOtpInput('');
    setEmailOtpError('');
    setMobileOtp('');
    setMobileOtpSent(false);
    setMobileOtpInput('');
    setMobileOtpError('');
    setError('');
  };

  // If email/mobile changed, require re-verification
  React.useEffect(() => {
    setEditEmailVerified(editEmail === email ? emailVerified : false);
    setEditMobileVerified(editMobile === mobile ? mobileVerified : false);
    // Reset OTP states if value changes
    setEmailOtp('');
    setEmailOtpSent(false);
    setEmailOtpInput('');
    setEmailOtpError('');
    setMobileOtp('');
    setMobileOtpSent(false);
    setMobileOtpInput('');
    setMobileOtpError('');
    // eslint-disable-next-line
  }, [editEmail, editMobile]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 flex flex-col md:flex-row">
      {/* Subnav bar */}
      <div className="w-full md:w-64 mb-6 md:mb-0 md:mr-8">
        <div className="bg-white rounded-lg shadow border border-green-100 flex md:flex-col flex-row overflow-x-auto">
          {subNavItems.map(item => (
            <button
              key={item.key}
              className={`flex-1 px-4 py-3 text-left text-sm font-medium border-b md:border-b-0 md:border-l-0 md:border-r-0 md:border-t-0 border-green-100
                ${activeSection === item.key ? 'bg-green-100 text-green-700 font-bold' : 'text-gray-700 hover:bg-green-50'}
                ${activeSection === item.key ? 'border-l-4 border-green-600' : ''}
              `}
              style={{ outline: 'none' }}
              onClick={() => setActiveSection(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1">
        {activeSection === 'profile' && (
          <>
            {/* Profile card code (editMode, image, etc.) */}
            <div className="bg-white rounded-lg shadow p-6 border border-green-100 flex flex-col md:flex-row md:items-start">
              {/* Responsive: image first on mobile, right on desktop */}
              <div className="flex-shrink-0 flex flex-col items-center md:order-2 md:ml-8 md:mt-0 order-1 mb-6 md:mb-0 w-full md:w-auto">
                <img
                  src={editMode && editImagePreview ? editImagePreview : getGravatarUrl(email)}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-green-200 shadow object-cover"
                />
                {editMode && (
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-3"
                    onChange={handleImageChange}
                  />
                )}
              </div>
              <div className="flex-1 md:order-1 order-2 w-full">
                {editMode ? (
                  <>
                    <div className="mb-4">
                      <span className="font-semibold text-green-600">Name:</span>
                      <input
                        className="ml-2 border rounded px-2 py-1"
                        value={editName}
                        onChange={e => setEditName(e.target.value.replace(/[^A-Za-z\s]/g, ''))}
                      />
                    </div>
                    <div className="mb-4 flex flex-col">
                      <div>
                        <span className="font-semibold text-green-600">Email:</span>
                        <input
                          className="ml-2 border rounded px-2 py-1"
                          value={editEmail}
                          onChange={e => setEditEmail(e.target.value)}
                        />
                        <button
                          type="button"
                          className={`ml-2 px-2 py-1 rounded text-xs ${editEmailVerified ? 'bg-green-600 text-white' : 'bg-green-500 text-white'}`}
                          disabled={editEmailVerified}
                          onClick={handleSendEmailOtp}
                        >
                          {editEmailVerified ? 'Verified' : 'Send OTP'}
                        </button>
                      </div>
                      {!editEmailVerified && emailOtpSent && (
                        <div className="flex items-center mt-2">
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            className="border px-2 py-1 rounded text-xs"
                            value={emailOtpInput}
                            onChange={e => setEmailOtpInput(e.target.value)}
                          />
                          <button
                            type="button"
                            className="ml-2 px-2 py-1 rounded text-xs bg-green-600 text-white"
                            onClick={handleVerifyEmailOtp}
                          >
                            Verify
                          </button>
                        </div>
                      )}
                      {emailOtpError && <div className={`text-xs ${editEmailVerified ? 'text-green-600' : 'text-red-500'}`}>{emailOtpError}</div>}
                    </div>
                    <div className="mb-4 flex flex-col">
                      <div>
                        <span className="font-semibold text-green-600">Mobile:</span>
                        <input
                          className="ml-2 border rounded px-2 py-1"
                          value={editMobile}
                          maxLength={10}
                          onChange={e => setEditMobile(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                        <button
                          type="button"
                          className={`ml-2 px-2 py-1 rounded text-xs ${editMobileVerified ? 'bg-green-600 text-white' : 'bg-green-500 text-white'}`}
                          disabled={editMobileVerified}
                          onClick={handleSendMobileOtp}
                        >
                          {editMobileVerified ? 'Verified' : 'Send OTP'}
                        </button>
                      </div>
                      {!editMobileVerified && mobileOtpSent && (
                        <div className="flex items-center mt-2">
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            className="border px-2 py-1 rounded text-xs"
                            value={mobileOtpInput}
                            onChange={e => setMobileOtpInput(e.target.value)}
                          />
                          <button
                            type="button"
                            className="ml-2 px-2 py-1 rounded text-xs bg-green-600 text-white"
                            onClick={handleVerifyMobileOtp}
                          >
                            Verify
                          </button>
                        </div>
                      )}
                      {mobileOtpError && <div className={`text-xs ${editMobileVerified ? 'text-green-600' : 'text-red-500'}`}>{mobileOtpError}</div>}
                    </div>
                    {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                    <div className="flex flex-col md:flex-row md:space-x-2 mt-4">
                      <button
                        className="mb-2 md:mb-0 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={handleSave}
                      >
                        Save & Continue
                      </button>
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <span className="font-semibold text-green-600">Name:</span>
                      <span className="ml-2">{name}</span>
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold text-green-600">Email:</span>
                      <span className="ml-2">{email}</span>
                      <span className={`ml-2 text-xs font-semibold ${emailVerified ? 'text-green-600' : 'text-red-500'}`}>
                        {emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="font-semibold text-green-600">Mobile:</span>
                      <span className="ml-2">{mobile}</span>
                      <span className={`ml-2 text-xs font-semibold ${mobileVerified ? 'text-green-600' : 'text-red-500'}`}>
                        {mobileVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    <button
                      className="mt-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
        {activeSection === 'payment' && (
          <div className="bg-white rounded-lg shadow p-6 border border-green-100">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Your Payment</h2>
            <div className="text-gray-500">Payment details and history will appear here.</div>
          </div>
        )}
        {activeSection === 'property' && (
          <MyProperty />
        )}
        {activeSection === 'interested' && (
          <div className="bg-white rounded-lg shadow p-6 border border-green-100">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Interested in Your Properties</h2>
            <div className="text-gray-500">People interested in your properties will appear here.</div>
          </div>
        )}
        {activeSection === 'owners' && (
          <div className="bg-white rounded-lg shadow p-6 border border-green-100">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Owners You Contacted</h2>
            <div className="text-gray-500">Owners you have contacted will appear here.</div>
          </div>
        )}
        {activeSection === 'bookmysqft' && (
          <div className="bg-white rounded-lg shadow p-6 border border-green-100">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Book My Sqft</h2>
            <div className="text-gray-500">Book My Sqft section content goes here.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;