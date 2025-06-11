import React, { useRef, useState } from 'react';

const cardOptions = [
	{
		title: 'To Contact',
		desc: 'Send payment directly to a contact.',
		icon: '📱',
	},
	{
		title: 'To UPI',
		desc: 'Pay instantly using UPI.',
		icon: '💸',
	},
	{
		title: 'To Bank Account',
		desc: 'Transfer to any bank account.',
		icon: '🏦',
	},
];

const carouselImages = [
	'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
	'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
	'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
];

const PaymentVai: React.FC = () => {
	const [slide, setSlide] = useState(0);
	const carouselRef = useRef<HTMLDivElement>(null);
	const dragState = useRef<{ startX: number; currentX: number; dragging: boolean }>({
		startX: 0,
		currentX: 0,
		dragging: false,
	});

	// Drag handlers for carousel
	const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
		dragState.current.dragging = true;
		dragState.current.startX =
			'e' in e && 'touches' in e
				? (e as React.TouchEvent).touches[0].clientX
				: (e as React.MouseEvent).clientX;
	};

	const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
		if (!dragState.current.dragging) return;
		const clientX =
			'e' in e && 'touches' in e
				? (e as React.TouchEvent).touches[0].clientX
				: (e as React.MouseEvent).clientX;
		dragState.current.currentX = clientX;
	};

	const handleDragEnd = () => {
		if (!dragState.current.dragging) return;
		const delta = dragState.current.currentX - dragState.current.startX;
		if (Math.abs(delta) > 40) {
			if (delta < 0 && slide < carouselImages.length - 1) {
				setSlide(slide + 1);
			} else if (delta > 0 && slide > 0) {
				setSlide(slide - 1);
			}
		}
		dragState.current.dragging = false;
		dragState.current.startX = 0;
		dragState.current.currentX = 0;
	};

	return (
		<div className="max-w-3xl mx-auto py-12 px-4">
			<h1 className="text-xl md:text-2xl font-bold text-green-700 mb-2 text-center">
				Payment via Credit Card
			</h1>
			<p className="text-base text-gray-700 mb-8 text-center">
				<span role="img" aria-label="star">
					🌟
				</span>{' '}
				Start new payment for Rent, Maintenance, Education fee
			</p>
			{/* Cards */}
			<div
				className="flex flex-row flex-nowrap overflow-x-auto gap-4 sm:gap-4 payment-cards-row justify-center"
				style={{ marginBottom: 32, paddingBottom: 32, WebkitOverflowScrolling: 'touch', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}
			>
				{cardOptions.map((card, idx) => (
					<div
						key={card.title}
						className="relative bg-white rounded-xl shadow-lg flex flex-col items-center justify-center text-center cursor-pointer group transition-transform duration-300 hover:-translate-y-2 hover:scale-105 animate-fadein flex-shrink-0 payment-card"
						style={{
							animationDelay: `${idx * 0.1}s`,
							width: '170px',
							height: '170px',
							minWidth: '170px',
							minHeight: '170px',
							maxWidth: '170px',
							maxHeight: '170px',
						} as React.CSSProperties}
					>
						<div className="text-2xl mb-1 transition-transform duration-300 group-hover:scale-125 payment-card-icon">
							{card.icon}
						</div>
						<h2 className="text-sm font-semibold text-green-700 mb-1 payment-card-title">
							{card.title}
						</h2>
						<p className="text-gray-500 text-xs payment-card-desc">{card.desc}</p>
						<span className="absolute inset-0 rounded-xl border-2 border-green-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
					</div>
				))}
			</div>
			{/* Carousel */}
			<div className="relative w-full max-w-lg mx-auto mt-8">
				<div
					className="overflow-hidden rounded-xl shadow-lg"
					ref={carouselRef}
					onMouseDown={e => handleDragStart(e)}
					onMouseMove={e => {
						handleDragMove(e);
						e.preventDefault();
					}}
					onMouseUp={handleDragEnd}
					onMouseLeave={handleDragEnd}
					onTouchStart={e => handleDragStart(e)}
					onTouchMove={e => handleDragMove(e)}
					onTouchEnd={handleDragEnd}
					style={{ cursor: 'grab', userSelect: 'none' }}
				>
					<div
						className="flex transition-transform duration-700"
						style={{ transform: `translateX(-${slide * 100}%)` }}
					>
						{carouselImages.map((img, idx) => (
							<img
								key={img}
								src={img}
								alt={`slide-${idx + 1}`}
								className="w-full h-56 object-cover flex-shrink-0"
								style={{ minWidth: '100%' }}
								draggable={false}
							/>
						))}
					</div>
				</div>
				{/* Carousel controls */}
				<div className="flex justify-center gap-2 mt-4">
					{carouselImages.map((_, idx) => (
						<button
							key={idx}
							className={`w-3 h-3 rounded-full border-2 border-green-400 ${
								slide === idx ? 'bg-green-500' : 'bg-white'
							} transition-colors`}
							onClick={() => setSlide(idx)}
							aria-label={`Go to slide ${idx + 1}`}
							style={{ outline: 'none' }}
						/>
					))}
				</div>
			</div>
			
			{/* New Section: Pay utility bills */}
			<div className="mt-12">
				<h2 className="text-xl md:text-2xl font-bold text-green-700 mb-6 text-center">
					Pay utility bills
				</h2>
				<div className="w-full flex justify-center">
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center items-center">
						{/* Icon Card 1 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/receive-cash.png" alt="HouseRent" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">HouseRent</span>
						</div>
						{/* Icon Card 2 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/school.png" alt="School Fee" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">School Fee</span>
						</div>
						{/* Icon Card 3 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/maintenance.png" alt="Society Maintenance" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">Society Maintenance</span>
						</div>
						{/* Icon Card 4 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/classroom.png" alt="Tuition Fee" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">Tuition Fee</span>
						</div>
						{/* Icon Card 5 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/shop.png" alt="Office/ShopRent" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">Office/ShopRent</span>
						</div>
						{/* Icon Card 6 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								{/* Use a generic token/award/medal icon if token icon is missing */}
								<img src="https://img.icons8.com/ios-filled/50/4ade80/medal2--v2.png" alt="PropertyToken" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">PropertyToken</span>
						</div>
						{/* Icon Card 7 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/deposit.png" alt="Property Deposit" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">Property Deposit</span>
						</div>
						{/* Icon Card 8 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/bill.png" alt="UtilityBills" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">UtilityBills</span>
						</div>
					</div>
				</div>
			</div>

			{/* New Section: Pay utility bills 2 */}
			<div className="mt-12">
				<h2 className="text-xl md:text-2xl font-bold text-green-700 mb-6 text-center">
					Pay utility bills
				</h2>
				<div className="w-full flex justify-center">
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center items-center">
						{/* Icon Card 1 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/fast-forward.png" alt="Fastag" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">Fastag</span>
						</div>
						{/* Icon Card 2 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/water.png" alt="Water Bill" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">Water Bill</span>
						</div>
						{/* Icon Card 3 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/iphone-x.png" alt="Mobile Prepaid" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">Mobile Prepaid</span>
						</div>
						{/* Icon Card 4 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/bank-cards.png" alt="Credit Card" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">Credit Card</span>
						</div>
						{/* Icon Card 5 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/electricity.png" alt="Electricity Bill" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">Electricity Bill</span>
						</div>
						{/* Icon Card 6 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/wifi.png" alt="Broadband Postpaid" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">Broadband Postpaid</span>
						</div>
						{/* Icon Card 7 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/tv.png" alt="DTH" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">DTH</span>
						</div>
						{/* Icon Card 8 */}
						<div className="flex flex-col items-center">
							<div className="bg-green-100 rounded-full p-4 mb-2 flex items-center justify-center">
								<img src="https://img.icons8.com/ios-filled/50/4ade80/school.png" alt="Education Fee" className="w-8 h-8" />
							</div>
							<span className="text-xs text-gray-700 text-center mt-1">Education Fee</span>
						</div>
					</div>
				</div>
			</div>
			<style>{`
        @media (max-width: 640px) {
          .payment-cards-row {
            gap: 0.3rem !important;
            padding-bottom: 0.3rem !important;
          }
          .payment-card {
            width: 6rem !important;
            min-width: 6rem !important;
            max-width: 6rem !important;
            height: 6rem !important;
            min-height: 6rem !important;
            max-height: 6rem !important;
            padding: 0.2rem !important;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .payment-card-icon {
            font-size: 1.1rem !important;
          }
          .payment-card-title {
            font-size: 0.62rem !important;
            margin-bottom: 0.2rem !important;
            line-height: 1.1 !important;
          }
          .payment-card-desc {
            font-size: 0.48rem !important;
            line-height: 1.1 !important;
          }
        }
      `}</style>
		</div>
	);
};

export default PaymentVai;
