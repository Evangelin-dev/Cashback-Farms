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
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-green-100 p-8 flex flex-col items-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3820/3820331.png"
          alt="Refer and Earn"
          className="w-24 h-24 mb-4 drop-shadow"
        />
        <h1 className="text-3xl font-extrabold text-green-700 mb-2 text-center tracking-tight drop-shadow">
          Refer & Earn
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Invite your friends to Cashback Farm and earn exciting rewards for every successful referral!
        </p>
        <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center w-full mb-6 shadow-inner">
          <span className="text-green-700 font-semibold text-lg mb-2">Your Referral Code</span>
          <div className="flex items-center gap-2">
            <span className="bg-white border border-green-200 px-6 py-2 rounded-lg text-xl font-bold tracking-widest text-green-700 shadow">
              {referralCode}
            </span>
            <button
              onClick={handleCopy}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row gap-6 mb-8">
          <div
            className="flex-1 bg-white border border-green-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => setShowSharePopup(true)}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/929/929426.png"
              alt="Share"
              className="w-10 h-10 mb-2"
            />
            <span className="font-semibold text-green-700 mb-1">Share your code</span>
            <span className="text-gray-500 text-sm text-center">Send your referral code to friends via WhatsApp, Email, or SMS.</span>
          </div>
          <div className="flex-1 bg-white border border-green-100 rounded-xl p-4 flex flex-col items-center shadow hover:shadow-lg transition">
            <img
              src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
              alt="Earn"
              className="w-10 h-10 mb-2"
            />
            <span className="font-semibold text-green-700 mb-1">Earn Rewards</span>
            <span className="text-gray-500 text-sm text-center">Get cashback or bonus when your friend makes their first booking.</span>
          </div>
        </div>
        <div className="bg-green-100 rounded-xl p-6 w-full text-center shadow-inner">
          <h2 className="text-lg font-bold text-green-700 mb-2">How it works?</h2>
          <ol className="list-decimal list-inside text-gray-700 text-left mx-auto max-w-md space-y-1">
            <li>Share your referral code with friends.</li>
            <li>Your friend signs up and enters your code.</li>
            <li>They make their first booking.</li>
            <li>You both receive rewards!</li>
          </ol>
        </div>
      </div>
      {/* Share Popup */}
      {showSharePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-8 relative animate-fadeIn flex flex-col items-center border-2 border-green-200">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShowSharePopup(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <img
              src="https://cdn-icons-png.flaticon.com/512/929/929426.png"
              alt="Share"
              className="w-14 h-14 mb-3"
            />
            <h2 className="text-lg font-bold text-green-700 mb-2">Share your referral code</h2>
            <div className="flex flex-col gap-3 w-full mt-2">
              <button
                className="w-full flex items-center gap-2 py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                onClick={() => handleShare('whatsapp')}
              >
                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="WhatsApp" className="w-5 h-5" />
                Share on WhatsApp
              </button>
              <button
                className="w-full flex items-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                onClick={() => handleShare('facebook')}
              >
                <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="w-5 h-5" />
                Share on Facebook
              </button>
              <button
                className="w-full flex items-center gap-2 py-2 px-4 bg-gray-100 text-green-700 rounded-lg font-semibold hover:bg-green-100 transition border border-green-200"
                onClick={() => handleShare('copy')}
              >
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
