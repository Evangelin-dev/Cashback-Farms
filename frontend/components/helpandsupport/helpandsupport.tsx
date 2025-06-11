import React from 'react';

const HelpAndSupport: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-green-100 p-8">
        <h1 className="text-3xl font-extrabold text-green-700 mb-4 text-center tracking-tight drop-shadow">
          Help & Support
        </h1>
        <p className="text-gray-600 text-center mb-8">
          We're here to help! Find answers to your questions or contact our support team.
        </p>
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png"
              alt="FAQ"
              className="w-14 h-14 mb-3"
            />
            <h2 className="text-lg font-bold text-green-700 mb-2">Frequently Asked Questions</h2>
            <ul className="text-gray-600 text-sm list-disc list-inside">
              <li>How do I book a property?</li>
              <li>How can I download my receipt?</li>
              <li>How do I edit my profile?</li>
              <li>How do I contact support?</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center shadow hover:shadow-lg transition">
            <img
              src="https://cdn-icons-png.flaticon.com/512/597/597177.png"
              alt="Contact"
              className="w-14 h-14 mb-3"
            />
            <h2 className="text-lg font-bold text-green-700 mb-2">Contact Support</h2>
            <div className="text-gray-600 text-sm mb-2">Email: <span className="font-medium text-green-700">support@cashbackfarm.com</span></div>
            <div className="text-gray-600 text-sm mb-2">Phone: <span className="font-medium text-green-700">+91 98765 43210</span></div>
            <div className="text-gray-600 text-sm">Live Chat: <span className="font-medium text-green-700">Available 9am - 6pm</span></div>
          </div>
        </div>
        <div className="bg-green-100 rounded-xl p-6 flex flex-col items-center shadow-inner">
          <h2 className="text-lg font-bold text-green-700 mb-2">Send Us a Message</h2>
          <form className="w-full max-w-md flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="px-4 py-2 rounded border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="px-4 py-2 rounded border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <textarea
              placeholder="How can we help you?"
              rows={4}
              className="px-4 py-2 rounded border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;
