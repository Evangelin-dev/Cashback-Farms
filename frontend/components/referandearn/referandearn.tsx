import React, { useState } from 'react';

const referralCode = "CBF12345";

const ReferAndEarn: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'copy') => {
    const shareUrl = `${window.location.origin}/signup?ref=${referralCode}`;
    const message = `Join Cashback Farm and earn rewards! Use my referral code: ${referralCode} ${shareUrl}`;
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`, '_blank');
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-white flex flex-col items-center py-4 px-2">
      <div className="w-full max-w-3xl flex flex-col md:flex-row gap-4">
        {/* Refer & Earn Card */}
        <div className="flex-1 bg-white rounded-xl shadow-xl border border-green-100 p-4 flex flex-col items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3820/3820331.png"
            alt="Refer and Earn"
            className="w-14 h-14 mb-2 drop-shadow"
          />
          <h1 className="text-xl font-extrabold text-green-700 mb-1 text-center tracking-tight drop-shadow">
            Refer & Earn
          </h1>
          <p className="text-gray-600 text-center mb-3 text-sm">
            Invite your friends to Cashback Farm and earn exciting rewards for every successful referral!
          </p>
          <div className="bg-green-50 rounded-lg p-3 flex flex-col items-center w-full mb-3 shadow-inner">
            <span className="text-green-700 font-semibold text-base mb-1">Your Referral Code</span>
            <div className="flex items-center gap-1">
              <span className="bg-white border border-green-200 px-3 py-1 rounded text-base font-bold tracking-widest text-green-700 shadow">
                {referralCode}
              </span>
              <button
                onClick={handleCopy}
                className="bg-green-600 text-white px-2 py-1 rounded font-semibold hover:bg-green-700 transition text-sm"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-3 mb-4">
            <div
              className="flex-1 bg-white border border-green-100 rounded-lg p-2 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => setShowSharePopup(true)}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/929/929426.png"
                alt="Share"
                className="w-7 h-7 mb-1"
              />
              <span className="font-semibold text-green-700 mb-0.5 text-sm">Share your code</span>
              <span className="text-gray-500 text-xs text-center">Send your referral code to friends via WhatsApp, Email, or SMS.</span>
            </div>
            <div className="flex-1 bg-white border border-green-100 rounded-lg p-2 flex flex-col items-center shadow hover:shadow-lg transition">
              <img
                src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                alt="Earn"
                className="w-7 h-7 mb-1"
              />
              <span className="font-semibold text-green-700 mb-0.5 text-sm">Earn Rewards</span>
              <span className="text-gray-500 text-xs text-center">Get cashback or bonus when your friend makes their first booking.</span>
            </div>
          </div>
          <div className="bg-green-100 rounded-lg p-3 w-full text-center shadow-inner">
            <h2 className="text-base font-bold text-green-700 mb-1">How it works?</h2>
            <ol className="list-decimal list-inside text-gray-700 text-left mx-auto max-w-xs space-y-0.5 text-sm">
              <li>Share your referral code with friends.</li>
              <li>Your friend signs up and enters your code.</li>
              <li>They make their first booking.</li>
              <li>You both receive rewards!</li>
            </ol>
          </div>
        </div>
        {/* Referral & Commission System Info Card */}
        <div className="flex-1 bg-white rounded-xl shadow-xl border border-green-100 p-4 flex flex-col items-start justify-start min-w-[220px] max-w-xs">
          <h2 className="text-lg font-bold text-green-700 mb-2">Referral & Commission System</h2>
          <ul className="text-gray-700 text-sm space-y-1">
            <li>• Users get a unique referral code.</li>
            <li>• Multi-layer Referral Structure (Max 3 levels):</li>
            <ul className="ml-4 list-disc space-y-0.5">
              <li>
                <span className="font-semibold text-green-700">Level 1 (Direct Referral):</span> Gets <span className="font-bold text-green-700">1.5%</span> commission
              </li>
              <li>
                <span className="font-semibold text-green-700">Level 2 (Referred by Level 1):</span> Gets <span className="font-bold text-green-700">0.25%</span> commission
              </li>
              <li>
                <span className="font-semibold text-green-700">Level 3 (Referred by Level 2):</span> Gets <span className="font-bold text-green-700">0.25%</span> commission
              </li>
              <li>
                <span className="font-semibold text-gray-500">No commission beyond level 3.</span>
              </li>
            </ul>
          </ul>
          {/* Creative Referral Table */}
          <div className="mt-4 w-full">
            <h3 className="text-base font-bold text-primary-light mb-1">Your Referral Network</h3>
            <div className="overflow-x-auto rounded shadow border border-green-100 bg-green-50">
              <table className="min-w-full text-xs text-left">
                <thead>
                  <tr className="bg-green-100 text-green-800">
                    <th className="px-2 py-1 font-semibold">Name</th>
                    <th className="px-2 py-1 font-semibold">Level</th>
                    <th className="px-2 py-1 font-semibold">Referral Code</th>
                    <th className="px-2 py-1 font-semibold">Commission</th>
                    <th className="px-2 py-1 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Example mock data, replace with real data if available */}
                  <tr className="hover:bg-green-100 transition">
                    <td className="px-2 py-1 font-medium text-gray-800">Amit Kumar</td>
                    <td className="px-2 py-1">Level 1</td>
                    <td className="px-2 py-1">CBF56789</td>
                    <td className="px-2 py-1 text-green-700 font-semibold">1.5%</td>
                    <td className="px-2 py-1">
                      <span className="inline-block px-1 py-0.5 rounded bg-green-200 text-green-800 text-[10px] font-semibold">Active</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-green-100 transition">
                    <td className="px-2 py-1 font-medium text-gray-800">Priya Sharma</td>
                    <td className="px-2 py-1">Level 2</td>
                    <td className="px-2 py-1">CBF98765</td>
                    <td className="px-2 py-1 text-green-700 font-semibold">0.25%</td>
                    <td className="px-2 py-1">
                      <span className="inline-block px-1 py-0.5 rounded bg-yellow-200 text-yellow-800 text-[10px] font-semibold">Pending</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-green-100 transition">
                    <td className="px-2 py-1 font-medium text-gray-800">Rahul Verma</td>
                    <td className="px-2 py-1">Level 3</td>
                    <td className="px-2 py-1">CBF11223</td>
                    <td className="px-2 py-1 text-green-700 font-semibold">0.25%</td>
                    <td className="px-2 py-1">
                      <span className="inline-block px-1 py-0.5 rounded bg-red-200 text-red-800 text-[10px] font-semibold">Inactive</span>
                    </td>
                  </tr>
                  {/* ...add more rows as needed */}
                </tbody>
              </table>
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              <span className="inline-block mr-1"><span className="w-2 h-2 inline-block rounded-full bg-green-200 mr-0.5"></span>Active</span>
              <span className="inline-block mr-1"><span className="w-2 h-2 inline-block rounded-full bg-yellow-200 mr-0.5"></span>Pending</span>
              <span className="inline-block"><span className="w-2 h-2 inline-block rounded-full bg-red-200 mr-0.5"></span>Inactive</span>
            </div>
          </div>
        </div>
      </div>
      {/* Share Popup */}
      {showSharePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl max-w-xs w-full p-4 relative animate-fadeIn flex flex-col items-center border-2 border-green-200">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
              onClick={() => setShowSharePopup(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src="https://cdn-icons-png.flaticon.com/512/929/929426.png"
              alt="Share"
              className="w-8 h-8 mb-2"
            />
            <h2 className="text-base font-bold text-green-700 mb-1">Share your referral code</h2>
            <div className="flex flex-col gap-2 w-full mt-1">
              <button
                className="w-full flex items-center gap-2 py-1 px-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition text-sm"
                onClick={() => handleShare('whatsapp')}
              >
                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" className="w-4 h-4" />
                Share on WhatsApp
              </button>
              <button
                className="w-full flex items-center gap-2 py-1 px-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition text-sm"
                onClick={() => handleShare('facebook')}
              >
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="w-4 h-4" />
                Share on Facebook
              </button>
              <button
                className="w-full flex items-center gap-2 py-1 px-2 bg-gray-100 text-green-700 rounded hover:bg-green-100 transition border border-green-200 text-sm"
                onClick={() => handleShare('copy')}
              >
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferAndEarn;
