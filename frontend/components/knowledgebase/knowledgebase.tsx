import apiClient from '@/src/utils/api/apiClient'; // Make sure this path is correct
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
			<div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 relative overflow-hidden">
				{/* Animated background elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="floating-circles">
						<div className="circle circle-1"></div>
						<div className="circle circle-2"></div>
						<div className="circle circle-3"></div>
						<div className="circle circle-4"></div>
						<div className="circle circle-5"></div>
					</div>
					<div className="floating-shapes">
						<div className="shape shape-1"></div>
						<div className="shape shape-2"></div>
						<div className="shape shape-3"></div>
					</div>
				</div>
				<div className="relative z-10 flex justify-center items-center min-h-screen">
					<div className="text-center animate-pulse">
						<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-2xl mb-6 animate-bounce-gentle">
							<svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
							</svg>
						</div>
						<p className="text-2xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
							Loading FAQs...
						</p>
					</div>
				</div>
				<style>{animationStyles}</style>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen w-full bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 relative overflow-hidden">
				{/* Animated background elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="floating-circles">
						<div className="circle circle-1 bg-red-100"></div>
						<div className="circle circle-2 bg-pink-100"></div>
						<div className="circle circle-3 bg-rose-100"></div>
						<div className="circle circle-4 bg-red-100"></div>
						<div className="circle circle-5 bg-pink-100"></div>
					</div>
				</div>
				<div className="relative z-10 flex justify-center items-center min-h-screen px-4">
					<div className="text-center bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-red-200/50 p-10 max-w-md animate-fade-in-up">
						<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-rose-500 text-white shadow-2xl mb-6">
							<svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<p className="text-xl font-semibold text-red-600 mb-2">Oops! Something went wrong</p>
						<p className="text-red-500">{error}</p>
					</div>
				</div>
				<style>{animationStyles}</style>
			</div>
		);
	}

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 relative overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="floating-circles">
					<div className="circle circle-1"></div>
					<div className="circle circle-2"></div>
					<div className="circle circle-3"></div>
					<div className="circle circle-4"></div>
					<div className="circle circle-5"></div>
				</div>
				<div className="floating-shapes">
					<div className="shape shape-1"></div>
					<div className="shape shape-2"></div>
					<div className="shape shape-3"></div>
				</div>
			</div>

			<div className="relative z-10 min-h-screen py-6 px-3 sm:py-8 sm:px-4">
				<div className="w-full max-w-xl md:max-w-3xl mx-auto">
					
					{/* Header Section */}
					<header className="text-center mb-6 md:mb-8 animate-slide-up">
						<div className="inline-flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-2xl mb-5 md:mb-6 animate-bounce-gentle">
							<svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
							</svg>
						</div>
						<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 animate-fade-in-delayed tracking-tight">
							Knowledge Base
						</h1>
						<div className="w-20 md:w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full animate-expand mb-6"></div>
						<p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-300">
							Find answers to common questions and learn more about our platform.
						</p>
					</header>

					<main className="space-y-4 md:space-y-6">
						{/* --- Conditional Rendering for FAQs list or Empty State --- */}
						{faqs.length > 0 ? (
							faqs.map((faq, idx) => (
								<div
									key={faq.id} // Use the unique ID from the API for the key
									className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-green-200/50 transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 animate-fade-in-up group"
									style={{ animationDelay: `${idx * 0.1 + 0.4}s` }}
								>
									<button
										className="w-full flex justify-between items-center px-4 py-3 md:px-6 md:py-4 focus:outline-none text-left group-hover:bg-green-50/50 rounded-3xl transition-all duration-300"
										onClick={() => handleToggle(idx)}
									>
										<span className="text-base md:text-lg lg:text-xl font-bold text-green-800 pr-3 md:pr-4">
											{faq.question}
										</span>
										<span
											className={`transform transition-all duration-500 flex-shrink-0 ${
												openIndex === idx ? 'rotate-180 scale-110' : 'group-hover:scale-110'
											}`}
										>
											<div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white shadow-lg">
												<svg
													className="w-4 h-4 md:w-5 md:h-5"
													fill="none"
													stroke="currentColor"
													strokeWidth={3}
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M19 9l-7 7-7-7"
													/>
												</svg>
											</div>
										</span>
									</button>
									<div
										className={`overflow-hidden transition-all duration-700 ease-in-out px-8 ${
											openIndex === idx
												? 'max-h-96 py-2 opacity-100' // Increased max-height for longer answers
												: 'max-h-0 py-0 opacity-0'
										}`}
										style={{
											transitionProperty: 'max-height, opacity, padding',
										}}
									>
										<div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-3 md:p-4 border border-green-200 mb-6">
											<p className="text-green-900 text-sm md:text-base leading-relaxed">{faq.answer}</p>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 p-8 text-center animate-fade-in-up delay-400">
								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 text-white shadow-2xl mb-6 animate-bounce-gentle">
									<svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0012 15c-2.239 0-4.291.82-5.87 2.172M8 3.667A12.014 12.014 0 0112 3c1.99 0 3.88.485 5.612 1.348m-2.439 15.565a5.987 5.987 0 01-6.346 0M12 21a9.97 9.97 0 01-6.83-2.668" />
									</svg>
								</div>
								<p className="text-2xl font-bold text-gray-600 mb-3">
									No FAQs Available Yet
								</p>
								<p className="text-gray-500 text-lg">
									No frequently asked questions have been added yet. Please check back later.
								</p>
							</div>
						)}
					</main>

					{/* Footer Section */}
					<footer className="mt-12 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-3xl shadow-2xl p-6 md:p-8 animate-fade-in-up delay-1000">
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-2xl mb-6 animate-bounce-gentle">
								🚀
							</div>
							<h2 className="text-2xl md:text-3xl font-bold mb-3">Still Have Questions?</h2>
							<p className="text-green-100 text-base mb-6 max-w-2xl mx-auto leading-relaxed">
								Our support team is here to help you with any additional questions or concerns.
							</p>
							
							<div className="flex justify-center">
								<button
									type="button"
									onClick={() => navigate('/help-support')}
									className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-2xl px-8 py-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 group text-white font-semibold text-lg border border-white/20 hover:border-white/40"
								>
									<div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
										🎯
									</div>
									<div className="text-left">
										<div className="text-green-100 text-sm">Need more help?</div>
										<div className="text-white font-bold">Visit Help & Support</div>
									</div>
									<svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
									</svg>
								</button>
							</div>
						</div>
					</footer>

				</div>
			</div>

			<style>{`
				/* Animation Keyframes */
				@keyframes slideUp {
					from { opacity: 0; transform: translateY(50px); }
					to { opacity: 1; transform: translateY(0); }
				}
				
				@keyframes fadeInDelayed {
					0% { opacity: 0; transform: translateY(20px); }
					50% { opacity: 0; transform: translateY(20px); }
					100% { opacity: 1; transform: translateY(0); }
				}
				
				@keyframes bounceGentle {
					0%, 100% { transform: translateY(0); }
					50% { transform: translateY(-10px); }
				}
				
				@keyframes expand {
					from { width: 0; }
					to { width: 8rem; }
				}
				
				@keyframes fadeInUp {
					from { opacity: 0; transform: translateY(30px); }
					to { opacity: 1; transform: translateY(0); }
				}
				
				@keyframes float {
					0%, 100% { transform: translateY(0px) rotate(0deg); }
					33% { transform: translateY(-20px) rotate(120deg); }
					66% { transform: translateY(-10px) rotate(240deg); }
				}
				
				@keyframes floatReverse {
					0%, 100% { transform: translateY(0px) rotate(0deg); }
					50% { transform: translateY(-15px) rotate(-180deg); }
				}
				
				@keyframes pulse {
					0%, 100% { opacity: 0.4; }
					50% { opacity: 0.8; }
				}

				/* Animation Classes */
				.animate-slide-up { animation: slideUp 0.8s ease-out; }
				.animate-fade-in-delayed { animation: fadeInDelayed 1.2s ease-out; }
				.animate-bounce-gentle { animation: bounceGentle 2s ease-in-out infinite; }
				.animate-expand { animation: expand 1s ease-out 0.5s both; }
				.animate-fade-in-up { animation: fadeInUp 0.6s ease-out both; }
				
				/* Delay classes */
				.delay-300 { animation-delay: 0.3s; }
				.delay-400 { animation-delay: 0.4s; }
				.delay-500 { animation-delay: 0.5s; }
				.delay-600 { animation-delay: 0.6s; }
				.delay-700 { animation-delay: 0.7s; }
				.delay-800 { animation-delay: 0.8s; }
				.delay-900 { animation-delay: 0.9s; }
				.delay-1000 { animation-delay: 1.0s; }

				/* Custom utilities */
				.shadow-3xl { 
					box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
				}

				/* Floating Background Elements */
				.floating-circles {
					position: absolute;
					width: 100%;
					height: 100%;
					overflow: hidden;
				}
				
				.circle {
					position: absolute;
					border-radius: 50%;
					background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
					animation: float 6s ease-in-out infinite;
				}
				
				.circle-1 {
					width: 100px;
					height: 100px;
					top: 10%;
					left: 10%;
					animation-delay: 0s;
				}
				
				.circle-2 {
					width: 150px;
					height: 150px;
					top: 20%;
					right: 15%;
					animation-delay: -2s;
				}
				
				.circle-3 {
					width: 80px;
					height: 80px;
					bottom: 30%;
					left: 20%;
					animation: floatReverse 8s ease-in-out infinite;
					animation-delay: -1s;
				}
				
				.circle-4 {
					width: 120px;
					height: 120px;
					bottom: 20%;
					right: 10%;
					animation-delay: -3s;
				}
				
				.circle-5 {
					width: 60px;
					height: 60px;
					top: 50%;
					left: 5%;
					animation: floatReverse 10s ease-in-out infinite;
					animation-delay: -4s;
				}
				
				.floating-shapes {
					position: absolute;
					width: 100%;
					height: 100%;
					overflow: hidden;
				}
				
				.shape {
					position: absolute;
					background: linear-gradient(45deg, rgba(34, 197, 94, 0.05), rgba(20, 184, 166, 0.05));
					animation: pulse 4s ease-in-out infinite;
				}
				
				.shape-1 {
					width: 200px;
					height: 200px;
					top: 15%;
					right: 5%;
					transform: rotate(45deg);
					border-radius: 20px;
				}
				
				.shape-2 {
					width: 150px;
					height: 150px;
					bottom: 15%;
					left: 8%;
					transform: rotate(-30deg);
					border-radius: 30px;
					animation-delay: -2s;
				}
				
				.shape-3 {
					width: 100px;
					height: 100px;
					top: 40%;
					right: 20%;
					transform: rotate(60deg);
					border-radius: 15px;
					animation-delay: -1s;
				}
			`}</style>
		</div>
	);
};

const animationStyles = `
	/* Animation Keyframes */
	@keyframes slideUp {
		from { opacity: 0; transform: translateY(50px); }
		to { opacity: 1; transform: translateY(0); }
	}
	
	@keyframes fadeInDelayed {
		0% { opacity: 0; transform: translateY(20px); }
		50% { opacity: 0; transform: translateY(20px); }
		100% { opacity: 1; transform: translateY(0); }
	}
	
	@keyframes bounceGentle {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}
	
	@keyframes expand {
		from { width: 0; }
		to { width: 8rem; }
	}
	
	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(30px); }
		to { opacity: 1; transform: translateY(0); }
	}
	
	@keyframes float {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		33% { transform: translateY(-20px) rotate(120deg); }
		66% { transform: translateY(-10px) rotate(240deg); }
	}
	
	@keyframes floatReverse {
		0%, 100% { transform: translateY(0px) rotate(0deg); }
		50% { transform: translateY(-15px) rotate(-180deg); }
	}
	
	@keyframes pulse {
		0%, 100% { opacity: 0.4; }
		50% { opacity: 0.8; }
	}

	/* Animation Classes */
	.animate-slide-up { animation: slideUp 0.8s ease-out; }
	.animate-fade-in-delayed { animation: fadeInDelayed 1.2s ease-out; }
	.animate-bounce-gentle { animation: bounceGentle 2s ease-in-out infinite; }
	.animate-expand { animation: expand 1s ease-out 0.5s both; }
	.animate-fade-in-up { animation: fadeInUp 0.6s ease-out both; }
	
	/* Delay classes */
	.delay-300 { animation-delay: 0.3s; }
	.delay-400 { animation-delay: 0.4s; }
	.delay-500 { animation-delay: 0.5s; }
	.delay-600 { animation-delay: 0.6s; }
	.delay-700 { animation-delay: 0.7s; }
	.delay-800 { animation-delay: 0.8s; }
	.delay-900 { animation-delay: 0.9s; }
	.delay-1000 { animation-delay: 1.0s; }

	/* Custom utilities */
	.shadow-3xl { 
		box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
	}

	/* Floating Background Elements */
	.floating-circles {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	
	.circle {
		position: absolute;
		border-radius: 50%;
		background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
		animation: float 6s ease-in-out infinite;
	}
	
	.circle-1 {
		width: 100px;
		height: 100px;
		top: 10%;
		left: 10%;
		animation-delay: 0s;
	}
	
	.circle-2 {
		width: 150px;
		height: 150px;
		top: 20%;
		right: 15%;
		animation-delay: -2s;
	}
	
	.circle-3 {
		width: 80px;
		height: 80px;
		bottom: 30%;
		left: 20%;
		animation: floatReverse 8s ease-in-out infinite;
		animation-delay: -1s;
	}
	
	.circle-4 {
		width: 120px;
		height: 120px;
		bottom: 20%;
		right: 10%;
		animation-delay: -3s;
	}
	
	.circle-5 {
		width: 60px;
		height: 60px;
		top: 50%;
		left: 5%;
		animation: floatReverse 10s ease-in-out infinite;
		animation-delay: -4s;
	}
	
	.floating-shapes {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	
	.shape {
		position: absolute;
		background: linear-gradient(45deg, rgba(34, 197, 94, 0.05), rgba(20, 184, 166, 0.05));
		animation: pulse 4s ease-in-out infinite;
	}
	
	.shape-1 {
		width: 200px;
		height: 200px;
		top: 15%;
		right: 5%;
		transform: rotate(45deg);
		border-radius: 20px;
	}
	
	.shape-2 {
		width: 150px;
		height: 150px;
		bottom: 15%;
		left: 8%;
		transform: rotate(-30deg);
		border-radius: 30px;
		animation-delay: -2s;
	}
	
	.shape-3 {
		width: 100px;
		height: 100px;
		top: 40%;
		right: 20%;
		transform: rotate(60deg);
		border-radius: 15px;
		animation-delay: -1s;
	}
`;

export default KnowledgeBase;