import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const PROFESSIONALS = [
  { type: 'Architect', icon: '🏛️', desc: 'Expert in building design and planning.' },
  { type: 'Interior Designer', icon: '🛋️', desc: 'Specialist in interior spaces and decor.' },
  { type: 'Civil Engineer', icon: '🏗️', desc: 'Structural and construction expert.' },
  { type: 'Landscape Designer', icon: '🌳', desc: 'Garden and outdoor space designer.' },
  { type: 'Vastu Consultant', icon: '🧭', desc: 'Vastu and energy flow advisor.' },
];

const BookConsultation: React.FC = () => {
  const location = useLocation();
  // Expecting professional type to be passed as state: navigate('/bookconsultation', { state: { professional: 'Architect' } })
  const professionalType = location.state?.professional as string | undefined;
  const professional = PROFESSIONALS.find(p => p.type === professionalType);

  const [tab, setTab] = useState<'consultation' | 'callback'>('consultation');
  // If professional is provided, preselect and lock it, else allow selection
  const [selected, setSelected] = useState<string | null>(professional ? professional.type : null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the booking/callback data to your backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-green-100 p-8">
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-2 rounded-l-lg font-bold transition ${
              tab === 'consultation'
                ? 'bg-green-600 text-white shadow'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
            onClick={() => setTab('consultation')}
          >
            Book Consultation
          </button>
          <button
            className={`px-6 py-2 rounded-r-lg font-bold transition ${
              tab === 'callback'
                ? 'bg-green-600 text-white shadow'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
            onClick={() => setTab('callback')}
          >
            Request Callback
          </button>
        </div>
        {tab === 'consultation' && (
          <>
            <h1 className="text-2xl font-extrabold text-green-700 mb-2 text-center tracking-tight drop-shadow">
              Book a Professional Consultation
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Connect with top professionals for your project: Architect, Interior Designer, Civil Engineer, and more.
            </p>
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-green-700 mb-3 text-center">Professional</h2>
              {professional ? (
                <div className="flex flex-col items-center p-4 rounded-xl border-2 border-green-600 bg-green-50 shadow-sm w-full">
                  <span className="text-3xl mb-2">{professional.icon}</span>
                  <span className="font-bold text-green-700">{professional.type}</span>
                  <span className="text-xs text-gray-500 mt-1 text-center">{professional.desc}</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-items-center">
                  {PROFESSIONALS.map((pro) => (
                    <button
                      key={pro.type}
                      type="button"
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition shadow-sm w-full
                        ${selected === pro.type
                          ? 'border-green-600 bg-green-50 scale-105'
                          : 'border-green-100 bg-white hover:border-green-400'}
                      `}
                      onClick={() => setSelected(pro.type)}
                    >
                      <span className="text-3xl mb-2">{pro.icon}</span>
                      <span className="font-bold text-green-700">{pro.type}</span>
                      <span className="text-xs text-gray-500 mt-1 text-center">{pro.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  className="flex-1 border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Your Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  className="flex-1 border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  placeholder="Contact Number"
                  value={contact}
                  onChange={e => setContact(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="date"
                  className="flex-1 border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
                <input
                  type="time"
                  className="flex-1 border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!selected && !professional || !name || !contact || !date || !time}
                className={`w-full py-3 rounded-lg font-bold text-white transition
                  ${(!selected && !professional) || !name || !contact || !date || !time
                    ? 'bg-green-200 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 shadow-lg'}
                `}
              >
                Book Consultation
              </button>
            </form>
            {submitted && (
              <div className="mt-6 text-center">
                <div className="inline-block px-6 py-3 bg-green-100 rounded-xl shadow text-green-700 font-semibold">
                  Please Login/Sign up to continue
                </div>
              </div>
            )}
          </>
        )}
        {tab === 'callback' && (
          <>
            <h1 className="text-2xl font-extrabold text-green-700 mb-2 text-center tracking-tight drop-shadow">
              Request a Callback
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Leave your details and our team will call you back to discuss your requirements.
            </p>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                type="tel"
                className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Contact Number"
                value={contact}
                onChange={e => setContact(e.target.value)}
                required
              />
              <textarea
                className="w-full border border-green-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
                placeholder="Tell us about your requirement (optional)"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
              />
              <button
                type="submit"
                disabled={!name || !contact}
                className={`w-full py-3 rounded-lg font-bold text-white transition
                  ${!name || !contact
                    ? 'bg-green-200 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 shadow-lg'}
                `}
              >
                Request Callback
              </button>
            </form>
            {submitted && (
              <div className="mt-6 text-center">
                <div className="inline-block px-6 py-3 bg-green-100 rounded-xl shadow text-green-700 font-semibold">
                  Please Login/Sign up to continue
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookConsultation;
