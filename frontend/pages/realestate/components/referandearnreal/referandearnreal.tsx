import { Card } from "antd";
import React, { useState } from 'react';


const referralCode = "CBF12345";

// CommissionDashboard stats data
const stats = [
  {
    label: "Total Commission Earned",
    value: 120000,
    prefix: "₹",
    color: "from-green-400 to-green-600",
    icon: (
      <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Pending Commission",
    value: 25000,
    prefix: "₹",
    color: "from-yellow-400 to-yellow-600",
    icon: (
      <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Plots Sold",
    value: 8,
    color: "from-blue-400 to-blue-600",
    icon: (
      <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" />
      </svg>
    ),
  },
  {
    label: "Active Leads",
    value: 5,
    color: "from-purple-400 to-purple-600",
    icon: (
      <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth={2.2} />
        <circle cx="17" cy="7" r="4" stroke="currentColor" strokeWidth={2.2} />
      </svg>
    ),
  },
];

const ReferAndEarnReal: React.FC = () => {
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
      {/* Refer & Earn Section */}
      <section className="w-full max-w-5xl mb-12">
        <h2 className="text-2xl font-bold text-green-700 mb-6 border-b-2 border-green-100 pb-2">Refer & Earn</h2>
        <div className="flex flex-col md:flex-row gap-4">
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
              Invite your friends to Cashback Farm and earn rewards for every successful referral!
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
      </section>

      {/* Commission Dashboard Section */}
      <section className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-green-700 mb-6 border-b-2 border-green-100 pb-2">Commission Dashboard</h2>
        <div className="mb-8">
          <p className="text-neutral-500 text-sm">Track your earnings, leads, and progress towards your commission goals.</p>
        </div>
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`rounded-2xl shadow-xl p-6 flex flex-col items-center bg-gradient-to-br ${stat.color} border border-neutral-100 animate-fadein-up`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="mb-2">{stat.icon}</div>
              <div className="text-xs text-white/80 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.prefix || ""}
                {stat.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        {/* Commission Target Progress */}
        <Card
          style={{
            marginBottom: 24,
            borderRadius: 16,
            boxShadow: "0 4px 24px 0 rgba(34,197,94,0.08)",
            background: "linear-gradient(90deg, #bbf7d0 0%, #fff 60%, #a7f3d0 100%)",
          }}
          bodyStyle={{ background: "transparent", padding: 32 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-700 mb-2 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Commission Target Progress
              </h3>
              <div className="text-sm text-gray-700 mb-4">
                You have achieved <span className="font-bold text-green-700">60%</span> of your annual commission target.
              </div>
              <div className="w-full bg-green-100 rounded-full h-5 relative overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-5 rounded-full transition-all"
                  style={{ width: "60%" }}
                ></div>
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-green-900 font-bold text-xs">
                  60% Complete
                </span>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-200 via-white to-green-100 flex items-center justify-center shadow-lg relative">
                <svg className="w-28 h-28 absolute top-2 left-2" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#bbf7d0"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="10"
                    strokeDasharray="282.74"
                    strokeDashoffset={282.74 * (1 - 0.6)}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s" }}
                  />
                </svg>
                <span className="text-3xl font-bold text-green-700 z-10">60%</span>
              </div>
              <div className="mt-4 text-sm text-green-700 font-semibold">Target: ₹2,00,000</div>
            </div>
          </div>
        </Card>
        {/* Recent Activity */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-primary mb-4">Recent Commission Activity</h3>
          <div className="bg-white rounded-xl shadow p-6 border border-green-100">
            <ul className="divide-y divide-green-50">
              <li className="py-3 flex items-center justify-between">
                <span className="font-medium text-green-700">Received commission for Plot #A101</span>
                <span className="text-xs text-gray-500">₹15,000 • 2 days ago</span>
              </li>
              <li className="py-3 flex items-center justify-between">
                <span className="font-medium text-yellow-700">Pending commission for Plot #B202</span>
                <span className="text-xs text-gray-500">₹5,000 • 5 days ago</span>
              </li>
              <li className="py-3 flex items-center justify-between">
                <span className="font-medium text-blue-700">New lead assigned: Plot #C303</span>
                <span className="text-xs text-gray-500">Lead • 1 day ago</span>
              </li>
            </ul>
          </div>
        </div>
        <style>{`
          .animate-fadein-up { animation: fadein-up 0.7s cubic-bezier(.68,-0.55,.27,1.55); }
          @keyframes fadein-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </section>

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

export default ReferAndEarnReal;
