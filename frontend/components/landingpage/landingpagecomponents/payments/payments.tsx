import React from 'react';
import { useNavigate } from 'react-router-dom';

const paymentOptions = [
  {
    icon: "https://img.icons8.com/ios-filled/50/4ade80/receive-cash.png",
    title: "Rent Payment",
    desc: "Pay your rent securely and on time.",
    bg: "from-green-100 to-green-50"
  },
  {
    icon: "https://img.icons8.com/ios-filled/50/4ade80/light-on.png",
    title: "Utility Bill Payment",
    desc: "Settle your electricity, water, and other utility bills.",
    bg: "from-yellow-100 to-yellow-50"
  },
  {
    icon: "https://img.icons8.com/ios-filled/50/4ade80/maintenance.png",
    title: "Maintenance Payment",
    desc: "Pay for plot or property maintenance easily.",
    bg: "from-blue-100 to-blue-50"
  },
  {
    icon: "https://img.icons8.com/ios-filled/50/4ade80/receipt-dollar.png",
    title: "Fees",
    desc: "Manage and pay all your property-related fees.",
    bg: "from-pink-100 to-pink-50"
  }
];

const Payments: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Payments</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        Manage and track all your property-related payments in one place.
      </p>
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center text-center">
        {paymentOptions.map((opt, idx) => (
          <div
            key={opt.title}
            className={`
              relative group bg-gradient-to-br ${opt.bg}
              rounded-2xl shadow-lg p-8 flex flex-col items-center
              transition-transform duration-300 hover:-translate-y-3 hover:scale-105 cursor-pointer
              overflow-hidden
              animate-fadein
              text-center
              w-64 min-h-[300px] max-w-[270px] h-[300px]
            `}
            style={{ animationDelay: `${idx * 0.1}s` } as React.CSSProperties}
            onClick={() => navigate('/paymentvai')}
          >
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-green-200 opacity-30 rounded-full blur-2xl z-0"></div>
            <img
              src={opt.icon}
              alt={opt.title}
              className="w-16 h-16 mb-4 z-10 transition-transform duration-300 group-hover:scale-110"
              style={{ filter: "drop-shadow(0 2px 8px #4ade80aa)" }}
            />
            <h2 className="text-xl font-semibold text-green-700 mb-2 z-10 text-center">{opt.title}</h2>
            <p className="text-gray-600 text-center z-10">{opt.desc}</p>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes fadein {
          0% { opacity: 0; transform: translateY(40px) scale(0.95);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-fadein {
          animation: fadein 0.7s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </div>
  );
};

export default Payments;
