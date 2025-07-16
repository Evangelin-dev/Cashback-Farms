import React, { useState } from "react";
import Card from "../Card";
import apiClient from "@/src/utils/api/apiClient";
import { message } from "antd";

// --- IMPORTANT: You need to install this library ---
// Run: npm install react-phone-number-input
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import the default styling

// --- Popups (Unchanged) ---
const ConfirmationPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center animate-popup-bounce">
      <svg className="w-16 h-16 text-green-500 mb-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg>
      <div className="text-xl font-bold text-green-700 mb-2 text-center">Request Submitted!</div>
      <div className="text-gray-600 text-center mb-6">We received your request.<br />Our team will call you soon.</div>
      <button className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition" onClick={onClose}>Close</button>
    </div>
    <style>{`.animate-popup-bounce { animation: popupBounce 0.5s cubic-bezier(.4,2,.6,1) both; } @keyframes popupBounce { 0% { transform: scale(0.7); opacity: 0; } 60% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }`}</style>
  </div>
);

const LoginPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center animate-popup-bounce">
      <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <div className="text-xl font-bold text-gray-800 mb-2 text-center">Please Login</div>
      <div className="text-gray-600 text-center mb-6">You need to be logged in to submit a request.</div>
      <button className="w-full py-2 rounded-lg bg-gray-800 text-white font-semibold hover:bg-black transition" onClick={onClose}>Close</button>
    </div>
    <style>{`.animate-popup-bounce { animation: popupBounce 0.5s cubic-bezier(.4,2,.6,1) both; } @keyframes popupBounce { 0% { transform: scale(0.7); opacity: 0; } 60% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }`}</style>
  </div>
);

// --- Cart for logged-in users ---
const Cart: React.FC = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState<string | undefined>(""); // The library works with string | undefined
  const [email, setEmail] = useState("");  
  const [city, setCity] = useState("");    
  const [messageText, setMessageText] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const payload = { 
        name, 
        phone: mobile, // The 'mobile' state now includes the country code
        email, 
        city, 
        message: messageText
    };

    try {
        await apiClient.post('/call-request/', payload);
        message.success("Request submitted successfully!");
        setShowPopup(true);
        setName("");
        setMobile("");
        setEmail("");
        setCity("");
        setMessageText("");
    } catch (error) {
        console.error("Failed to submit request:", error);
        message.error("There was an error submitting your request. Please try again.");
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center py-10 px-2">
      <Card bodyClassName="p-8 shadow-2xl rounded-2xl border border-green-100 max-w-lg w-full">
        <div className="flex flex-col items-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mb-2 animate-bounce-slow">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          </div>
          <h1 className="text-xl font-bold text-green-700 mb-1 text-center">Request a Call</h1>
          <p className="text-gray-600 text-center mb-2 text-sm">Enter your details and our team will call you back.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div><input className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow" value={name} onChange={e => setName(e.target.value)} required placeholder="Full Name"/></div>
          <div><input className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email Address" type="email"/></div>
          <div>
            <PhoneInput
              placeholder="Enter phone number"
              value={mobile}
              onChange={setMobile}
              defaultCountry="IN" // Set a default country
              className="phone-input-container" // Custom class for styling
            />
          </div>
          <div><input className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow" value={city} onChange={e => setCity(e.target.value)} required placeholder="City"/></div>
          <div><textarea className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow" value={messageText} onChange={e => setMessageText(e.target.value)} rows={2} placeholder="Message (optional)"/></div>
          <button type="submit" className="w-full py-2 rounded-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-lg transition text-base" disabled={!name || !mobile || submitting}>
            {submitting ? 'Submitting...' : 'Request Call Booking'}
          </button>
        </form>
      </Card>
      {showPopup && <ConfirmationPopup onClose={() => setShowPopup(false)} />}
      <style>{`
        .animate-bounce-slow { animation: bounce-slow 1.5s infinite; } 
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
        /* Custom styles for the phone input library */
        .phone-input-container .PhoneInputInput {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          width: 100%;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .phone-input-container .PhoneInputInput:focus {
          border-color: #22c55e;
          outline: none;
          box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
        }
      `}</style>
    </div>
  );
};

// --- DCart for not-logged-in users ---
const DCart: React.FC = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState<string | undefined>("");
  const [email, setEmail] = useState(""); 
  const [city, setCity] = useState("");     
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center py-10 px-2">
      <Card bodyClassName="p-8 shadow-2xl rounded-2xl border border-green-100 max-w-lg w-full">
        <div className="flex flex-col items-center mb-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mb-2 animate-bounce-slow">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          </div>
          <h1 className="text-xl font-bold text-green-700 mb-1 text-center">Request a Call</h1>
          <p className="text-gray-600 text-center mb-2 text-sm">Enter your details and our team will call you back.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div><input className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow" value={name} onChange={e => setName(e.target.value)} required placeholder="Full Name"/></div>
          <div><input className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email Address" type="email"/></div>
          <div>
            <PhoneInput
              placeholder="Enter phone number"
              value={mobile}
              onChange={setMobile}
              defaultCountry="IN"
              className="phone-input-container"
            />
          </div>
          <div><input className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow" value={city} onChange={e => setCity(e.target.value)} required placeholder="City"/></div>
          <div><textarea className="border rounded-lg px-3 py-2 w-full text-base focus:border-green-500 transition shadow" value={message} onChange={e => setMessage(e.target.value)} rows={2} placeholder="Message (optional)"/></div>
          <button type="submit" className="w-full py-2 rounded-lg font-bold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 shadow-lg transition text-base" disabled={!name || !mobile}>Request Call Booking</button>
        </form>
      </Card>
      {showPopup && <LoginPopup onClose={() => setShowPopup(false)} />}
      <style>{`
        .animate-bounce-slow { animation: bounce-slow 1.5s infinite; } 
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
        .phone-input-container .PhoneInputInput {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          width: 100%;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .phone-input-container .PhoneInputInput:focus {
          border-color: #22c55e;
          outline: none;
          box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
        }
      `}</style>
    </div>
  );
};

export { Cart, DCart };
export default Cart;