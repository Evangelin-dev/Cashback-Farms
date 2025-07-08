import React, { useState } from 'react';
import apiClient from '@/src/utils/api/apiClient'; // Adjust this import path as needed

const HelpAndSupport: React.FC = () => {
  // State for form inputs and submission status
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Handles the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      setFeedbackMessage('Please fill out all fields.');
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage('');

    try {
      // 1. Manually retrieve the token from localStorage
      const accessToken = localStorage.getItem('access_token');

      // 2. Check if the user is logged in (i.e., if the token exists)
      if (!accessToken) {
        setFeedbackMessage('You must be logged in to send a message.');
        setIsSubmitting(false);
        return;
      }

      // 3. Manually add the Authorization header to the API call
      await apiClient.post(
        '/support/inquiry/',
        {
          subject,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setFeedbackMessage('Your message has been sent successfully!');
      // Clear form on success
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Failed to submit support inquiry:', error);
      setFeedbackMessage('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-green-100 p-8">
        <h1 className="text-3xl font-extrabold text-green-700 mb-4 text-center tracking-tight drop-shadow">
          Help & Support
        </h1>
        <p className="text-gray-600 text-center mb-8">
          We're here to help! Find answers to your questions or contact our support team.
        </p>
        
        {/* FAQ and Contact Info Section */}
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

        {/* Contact Form Section */}
        <div className="bg-green-100 rounded-xl p-6 flex flex-col items-center shadow-inner">
          <h2 className="text-lg font-bold text-green-700 mb-4">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="px-4 py-2 rounded border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <textarea
              placeholder="How can we help you?"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="px-4 py-2 rounded border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-green-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {feedbackMessage && (
              <p className={`mt-2 text-sm text-center ${feedbackMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                {feedbackMessage}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;