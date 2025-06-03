import React from 'react';

interface MyProfileProps {
  name: string;
  mobile: string;
  role: string;
  avatarUrl?: string;
}

const MyProfile: React.FC<MyProfileProps> = ({
  name,
  mobile,
  role,
  avatarUrl,
}) => {
  return (
    <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 border border-green-100">
      <div className="relative">
        <img
          className="w-20 h-20 rounded-full border-4 border-green-200 object-cover shadow"
          src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`}
          alt="Profile"
        />
        <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
      </div>
      <h2 className="mt-3 text-xl font-bold text-green-700">{name}</h2>
      <div className="text-gray-500 text-sm mt-1">{mobile}</div>
      <div className="mt-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold uppercase tracking-wide">
        {role}
      </div>
      <button className="mt-5 w-full py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
        Edit Profile
      </button>
    </div>
  );
};

export default MyProfile;
