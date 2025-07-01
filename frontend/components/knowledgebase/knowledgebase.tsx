import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/src/utils/api/apiClient'; // Make sure this path is correct

// Define a type for the FAQ data from your API
type Faq = {
	id: number; // APIs usually return an ID, which is great for the 'key' prop
	question: string;
	answer: string;
};

const KnowledgeBase: React.FC = () => {
	const [faqs, setFaqs] = useState<Faq[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const navigate = useNavigate();

	// Fetch FAQs from the API when the component mounts
	useEffect(() => {
		const fetchFaqs = async () => {
			setIsLoading(true);
			setError(null);
			try {
				// As requested, no authorization token is sent for this public endpoint.
				const response = await apiClient.get<Faq[]>('/api/faqs/');
				setFaqs(response || []);
			} catch (err) {
				setError('Could not load frequently asked questions. Please try again later.');
				console.error('Failed to fetch FAQs:', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchFaqs();
	}, []); // Empty dependency array ensures this runs only once on mount

	const handleToggle = (idx: number) => {
		setOpenIndex(openIndex === idx ? null : idx);
	};

	// --- Conditional Rendering for Loading and Error States ---
	if (isLoading) {
		return (
			<div className="min-h-screen w-full flex justify-center items-center">
				<p className="text-xl text-gray-500">Loading FAQs...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen w-full flex justify-center items-center">
				<p className="text-xl text-red-500 bg-red-50 p-6 rounded-lg">{error}</p>
			</div>
		);
	}

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
					{/* --- Conditional Rendering for FAQs list or Empty State --- */}
					{faqs.length > 0 ? (
						faqs.map((faq, idx) => (
							<div
								key={faq.id} // Use the unique ID from the API for the key
								className="bg-green-50 rounded-xl shadow group transition-all duration-300"
							>
								<button
									className="w-full flex justify-between items-center px-6 py-4 focus:outline-none text-left"
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
											className="w-6 h-6 text-green-600 flex-shrink-0"
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
											? 'max-h-60 py-2 opacity-100' // Increased max-height for longer answers
											: 'max-h-0 py-0 opacity-0'
									}`}
									style={{
										transitionProperty: 'max-height, opacity, padding',
									}}
								>
									<p className="text-green-900 text-base pb-4">{faq.answer}</p>
								</div>
							</div>
						))
					) : (
						<div className="text-center py-10 px-6 bg-gray-50 rounded-xl">
							<p className="text-gray-600 font-medium">
								No frequently asked questions have been added yet.
							</p>
							<p className="text-gray-500 text-sm mt-1">Please check back later.</p>
						</div>
					)}
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
							Help & Support
						</button>{' '}
						page.
					</p>
				</div>
			</div>
		</div>
	);
};

export default KnowledgeBase;