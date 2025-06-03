import React, { useRef, useState } from 'react';

/**
 * HomeProfile component displays the user's profile information
 * including their avatar, name, mobile number, role, email, and join date.
 */
const HomeProfile: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    mobile: '+91 9876543210',
    role: 'Admin',
    email: 'john.doe@email.com',
    joined: '2023-01-15',
  });
  const [pendingProfile, setPendingProfile] = useState(profile);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpField, setOtpField] = useState<'mobile' | 'email' | null>(null);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [profilePic, setProfilePic] = useState<string>(
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name)}`
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingProfile({ ...pendingProfile, [e.target.name]: e.target.value });
    if (e.target.name === 'mobile' || e.target.name === 'email') {
      setOtpField(e.target.name as 'mobile' | 'email');
      setOtpSent(false);
      setOtp('');
      setOtpInput('');
      setOtpError('');
      setOtpSuccess('');
    }
  };

  const handleSendOtp = (field: 'mobile' | 'email') => {
    setOtpError('');
    setOtpSuccess('');
    // For demo, generate a random OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);
    setOtpSent(true);
    setOtpField(field);
    setOtpSuccess(
      `OTP sent to ${field === 'mobile' ? pendingProfile.mobile : pendingProfile.email} (demo: ${generatedOtp})`
    );
  };

  const handleVerifyOtp = () => {
    if (otpInput === otp) {
      setOtpError('');
      setOtpSuccess('OTP verified!');
      setProfile({ ...profile, [otpField!]: pendingProfile[otpField!] });
      setOtpSent(false);
      setOtp('');
      setOtpInput('');
      setOtpField(null);
    } else {
      setOtpError('Invalid OTP.');
      setOtpSuccess('');
    }
  };

  const handleSave = () => {
    setEditMode(false);
    setProfile(pendingProfile);
    // Save logic here (API call, etc.)
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setProfilePic(ev.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 to-white flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl flex flex-row items-stretch border border-green-100 overflow-hidden mt-8">
        {/* Left: Profile Info */}
        <div className="flex-1 flex flex-col justify-center p-10">
          {editMode ? (
            <>
              <input
                className="text-2xl font-bold text-green-700 border-b border-green-200 focus:outline-none mb-2"
                name="name"
                value={pendingProfile.name}
                onChange={handleChange}
              />
              <div className="flex items-center mb-2">
                <input
                  className="text-gray-500 text-sm border-b border-green-100 focus:outline-none flex-1"
                  name="mobile"
                  value={pendingProfile.mobile}
                  onChange={handleChange}
                />
                {pendingProfile.mobile !== profile.mobile && !otpSent && (
                  <button
                    className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-xs"
                    type="button"
                    onClick={() => handleSendOtp('mobile')}
                  >
                    Send OTP
                  </button>
                )}
              </div>
              {otpField === 'mobile' && otpSent && (
                <div className="mb-2">
                  <input
                    className="w-full px-2 py-1 border rounded text-sm"
                    placeholder="Enter OTP"
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value)}
                  />
                  <button
                    className="mt-2 w-full py-1 bg-green-600 text-white rounded"
                    type="button"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </button>
                  {otpError && <div className="text-red-500 text-xs mt-1">{otpError}</div>}
                  {otpSuccess && <div className="text-green-600 text-xs mt-1">{otpSuccess}</div>}
                </div>
              )}
              <div className="flex items-center mb-2">
                <input
                  className="text-gray-500 text-sm border-b border-green-100 focus:outline-none flex-1"
                  name="email"
                  value={pendingProfile.email}
                  onChange={handleChange}
                />
                {pendingProfile.email !== profile.email && !otpSent && (
                  <button
                    className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-xs"
                    type="button"
                    onClick={() => handleSendOtp('email')}
                  >
                    Send OTP
                  </button>
                )}
              </div>
              {otpField === 'email' && otpSent && (
                <div className="mb-2">
                  <input
                    className="w-full px-2 py-1 border rounded text-sm"
                    placeholder="Enter OTP"
                    value={otpInput}
                    onChange={e => setOtpInput(e.target.value)}
                  />
                  <button
                    className="mt-2 w-full py-1 bg-green-600 text-white rounded"
                    type="button"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </button>
                  {otpError && <div className="text-red-500 text-xs mt-1">{otpError}</div>}
                  {otpSuccess && <div className="text-green-600 text-xs mt-1">{otpSuccess}</div>}
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-green-700 mb-2">{profile.name}</h2>
              <div className="text-gray-500 text-sm mb-1">{profile.mobile}</div>
              <div className="text-gray-500 text-sm mb-1">{profile.email}</div>
            </>
          )}
          <div className="mt-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold uppercase tracking-wide w-max mb-4">
            {profile.role}
          </div>
          <div className="w-full mb-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Joined:</span>
              <span className="text-gray-800">{profile.joined}</span>
            </div>
          </div>
          {editMode ? (
            <div className="flex gap-3 mt-4 w-full">
              <button
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                onClick={handleSave}
                disabled={
                  (pendingProfile.mobile !== profile.mobile && (otpField === 'mobile' || otpSent)) ||
                  (pendingProfile.email !== profile.email && (otpField === 'email' || otpSent))
                }
              >
                Save
              </button>
              <button
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                onClick={() => {
                  setEditMode(false);
                  setPendingProfile(profile);
                  setOtpSent(false);
                  setOtp('');
                  setOtpInput('');
                  setOtpField(null);
                  setOtpError('');
                  setOtpSuccess('');
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="mt-4 w-full py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              onClick={() => {
                setEditMode(true);
                setPendingProfile(profile);
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
        {/* Right: Profile Picture */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white px-8 py-10 w-80">
          <div className="relative group">
            <img
              className="w-40 h-40 rounded-full border-4 border-green-200 object-cover shadow"
              src={profilePic}
              alt="Profile"
            />
            {editMode && (
              <>
                <button
                  className="absolute bottom-2 right-2 bg-green-600 text-white rounded-full p-2 shadow-lg hover:bg-green-700 transition"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                  title="Change Profile Picture"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7l-1.5 1.5M4 20h16" />
                  </svg>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </>
            )}
          </div>
          <div className="mt-4 text-gray-400 text-xs text-center">
            {editMode ? "Click the pencil to change your profile picture" : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeProfile;
