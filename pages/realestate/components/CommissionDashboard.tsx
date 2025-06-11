import { Card } from "antd";
import React from "react";

// Creative stat cards data
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

const CommissionDashboard: React.FC = () => (
  <div className="w-full">
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight drop-shadow flex items-center gap-2">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Commission Dashboard
      </h1>
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
  </div>
);

export default CommissionDashboard;
