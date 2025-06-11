import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const faqs = [
	{
		question: 'How do I book a property?',
		answer:
			"Browse available properties, select your preferred plot, and click 'Book Now'. Follow the on-screen instructions to complete your booking.",
	},
	{
		question: 'How can I download my booking receipt?',
		answer: "Go to 'My Bookings & Properties', find your booking, and click 'Download Receipt'.",
	},
	{
		question: 'How do I edit my profile?',
		answer: "Navigate to 'My Profile' from the sidebar or header, then click 'Edit Profile' to update your details.",
	},
	{
		question: 'How do I contact support?',
		answer:
			"Visit the 'Help & Support' page for contact options including email, phone, and live chat.",
	},
];

const KnowledgeBase: React.FC = () => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const navigate = useNavigate();

	const handleToggle = (idx: number) => {
		setOpenIndex(openIndex === idx ? null : idx);
	};

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-white flex flex-col items-center py-10 px-4">
			<div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-green-100 p-8">
				<div className="flex flex-col items-center mb-8">
					<img
						src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
						alt="Knowledge Base"
						className="w-20 h-20 mb-3 animate-bounce"
					/>
					<h1 className="text-3xl font-extrabold text-green-700 mb-2 text-center tracking-tight drop-shadow">
						Knowledge Base
					</h1>
					<p className="text-gray-600 text-center">
						Find answers to common questions and learn more about our platform.
					</p>
				</div>
				<div className="space-y-4">
					{faqs.map((faq, idx) => (
						<div
							key={idx}
							className="bg-green-50 rounded-xl shadow group transition-all duration-300"
						>
							<button
								className="w-full flex justify-between items-center px-6 py-4 focus:outline-none"
								onClick={() => handleToggle(idx)}
							>
								<span className="text-lg font-semibold text-green-800">
									{faq.question}
								</span>
								<span
									className={`transform transition-transform duration-300 ${
										openIndex === idx ? 'rotate-180' : ''
									}`}
								>
									<svg
										className="w-6 h-6 text-green-600"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</span>
							</button>
							<div
								className={`overflow-hidden transition-all duration-500 ease-in-out px-6 ${
									openIndex === idx
										? 'max-h-40 py-2 opacity-100'
										: 'max-h-0 py-0 opacity-0'
								}`}
								style={{
									transitionProperty: 'max-height, opacity, padding',
								}}
							>
								<p className="text-green-900 text-base">{faq.answer}</p>
							</div>
						</div>
					))}
				</div>
				<div className="mt-12 flex flex-col items-center">
					<img
						src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
						alt="Explore"
						className="w-14 h-14 mb-2 animate-pulse"
					/>
					<p className="text-green-700 font-semibold text-lg text-center">
						Still have questions? Visit our{' '}
						<button
							type="button"
							onClick={() => navigate('/help-support')}
							className="underline hover:text-green-900 bg-transparent border-none p-0 m-0 cursor-pointer font-semibold"
							style={{ display: 'inline', background: 'none' }}
						>
							Help &amp; Support
						</button>{' '}
						page.
					</p>
				</div>
			</div>
		</div>
	);
};

export default KnowledgeBase;
