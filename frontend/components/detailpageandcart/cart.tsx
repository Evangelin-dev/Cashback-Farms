import React, { useState } from "react";
import Card from "../Card";

const REQUEST_TYPES = [
  { value: "order", label: "Order Placement" },
  { value: "general", label: "General Request" },
];

const ConfirmationPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center animate-popup-bounce">
      <svg className="w-16 h-16 text-green-500 mb-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
      </svg>
      <div className="text-xl font-bold text-green-700 mb-2 text-center">Request Submitted!</div>
      <div className="text-gray-600 text-center mb-6">We received your request.<br />Our team will call you soon.</div>
      <button
        className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
        onClick={onClose}
      >
        Close
      </button>
    </div>
    <style>{`
      .animate-popup-bounce {
        animation: popupBounce 0.5s cubic-bezier(.4,2,.6,1) both;
      }
      @keyframes popupBounce {
        0% { transform: scale(0.7); opacity: 0; }
        60% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    `}</style>
  </div>
);

const LoginPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center animate-popup-bounce">
      <svg className="w-16 h-16 text-green-500 mb-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
      </svg>
      <div className="text-xl font-bold text-green-700 mb-2 text-center">Please Login / Sign Up</div>
      <div className="text-gray-600 text-center mb-6">Login to submit a request.</div>
      <button
        className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
        onClick={onClose}
      >
        Close
      </button>
    </div>
    <style>{`
      .animate-popup-bounce {
        animation: popupBounce 0.5s cubic-bezier(.4,2,.6,1) both;
      }
      @keyframes popupBounce {
        0% { transform: scale(0.7); opacity: 0; }
        60% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
    `}</style>
  </div>
);

function isLoggedIn() {
  // Replace with your actual auth logic
  return !!localStorage.getItem("userToken");
}

// Cart for logged-in users (shows confirmation popup)
const Cart: React.FC = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [requestType, setRequestType] = useState(REQUEST_TYPES[0].value);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);


 const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };
  const selectedLabel = REQUEST_TYPES.find(opt => opt.value === requestType)?.label;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center py-10 px-2">
      <Card bodyClassName="p-8 shadow-2xl rounded-2xl border border-green-100 max-w-lg w-full">
        <div className="flex flex-col items-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mb-2 animate-bounce-slow">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2.5} />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-green-700 mb-1 text-center">Request a Call</h1>
          <p className="text-gray-600 text-center mb-2 text-sm">
            Enter your details and our team will call you back.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Full Name"
            />
          </div>
          <div>
            <input
              className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              required
              placeholder="Mobile Number"
              type="tel"
              pattern="[6-9]\d{9}"
              maxLength={10}
            />
          </div>
          <div className="relative">
            <button
              type="button"
              className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow flex justify-between items-center bg-white"
              onClick={() => setDropdownOpen(open => !open)}
              tabIndex={0}
            >
              <span>{selectedLabel}</span>
              <svg className={`w-4 h-4 ml-2 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <ul className="absolute left-0 right-0 mt-1 bg-white border border-green-100 rounded-lg shadow-lg z-10 animate-dropdown-fade">
                {REQUEST_TYPES.map(opt => (
                  <li
                    key={opt.value}
                    className={`px-4 py-2 cursor-pointer hover:bg-green-50 ${requestType === opt.value ? "bg-green-100 font-semibold text-green-700" : ""}`}
                    onClick={() => {
                      setRequestType(opt.value);
                      setDropdownOpen(false);
                    }}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
            <style>{`
              .animate-dropdown-fade {
                animation: dropdownFade 0.18s;
              }
              @keyframes dropdownFade {
                from { opacity: 0; transform: translateY(-8px);}
                to { opacity: 1; transform: translateY(0);}
              }
            `}</style>
          </div>
          <div>
            <textarea
              className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={2}
              placeholder="Message (optional)"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-lg transition text-base"
            disabled={!name || !mobile}
          >
            Request Call Booking
          </button>
        </form>
      </Card>
      {/* Popup */}
      
      {/* {showPopup === "login" && <LoginPopup onClose={() => setShowPopup(null)} />} */}
      {showPopup && <ConfirmationPopup onClose={() => setShowPopup(false)} />}
      <style>{`
        .animate-bounce-slow {
          animation: bounce-slow 1.5s infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-10px);}
        }
      `}</style>
    </div>
  );
};

// DCart for not-logged-in users (always shows login popup)
const DCart: React.FC = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [requestType, setRequestType] = useState(REQUEST_TYPES[0].value);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedLabel = REQUEST_TYPES.find(opt => opt.value === requestType)?.label;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center py-10 px-2">
      <Card bodyClassName="p-8 shadow-2xl rounded-2xl border border-green-100 max-w-lg w-full">
        <div className="flex flex-col items-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mb-2 animate-bounce-slow">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2.5} />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-green-700 mb-1 text-center">Request a Call</h1>
          <p className="text-gray-600 text-center mb-2 text-sm">
            Enter your details and our team will call you back.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Full Name"
            />
          </div>
          <div>
            <input
              className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              required
              placeholder="Mobile Number"
              type="tel"
              pattern="[6-9]\d{9}"
              maxLength={10}
            />
          </div>
          <div className="relative">
            <button
              type="button"
              className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow flex justify-between items-center bg-white"
              onClick={() => setDropdownOpen(open => !open)}
              tabIndex={0}
            >
              <span>{selectedLabel}</span>
              <svg className={`w-4 h-4 ml-2 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <ul className="absolute left-0 right-0 mt-1 bg-white border border-green-100 rounded-lg shadow-lg z-10 animate-dropdown-fade">
                {REQUEST_TYPES.map(opt => (
                  <li
                    key={opt.value}
                    className={`px-4 py-2 cursor-pointer hover:bg-green-50 ${requestType === opt.value ? "bg-green-100 font-semibold text-green-700" : ""}`}
                    onClick={() => {
                      setRequestType(opt.value);
                      setDropdownOpen(false);
                    }}
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
            <style>{`
              .animate-dropdown-fade {
                animation: dropdownFade 0.18s;
              }
              @keyframes dropdownFade {
                from { opacity: 0; transform: translateY(-8px);}
                to { opacity: 1; transform: translateY(0);}
              }
            `}</style>
          </div>
          <div>
            <textarea
              className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={2}
              placeholder="Message (optional)"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-lg transition text-base"
            disabled={!name || !mobile}
          >
            Request Call Booking
          </button>
        </form>
      </Card>
      {/* Popup */}
      {showPopup && <LoginPopup onClose={() => setShowPopup(false)} />}
      <style>{`
        .animate-bounce-slow {
          animation: bounce-slow 1.5s infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-10px);}
        }
      `}</style>
    </div>
  );
};

export { Cart, DCart };
export default Cart;