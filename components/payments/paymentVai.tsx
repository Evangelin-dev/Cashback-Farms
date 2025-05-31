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
				className="flex flex-row gap-4 justify-center items-center flex-nowrap overflow-x-auto"
				style={{ marginBottom: 20, paddingBottom: 20 }}
			>
				{cardOptions.map((card, idx) => (
					<div
						key={card.title}
						className="relative bg-white rounded-xl shadow-lg flex flex-col items-center justify-center text-center cursor-pointer group transition-transform duration-300 hover:-translate-y-2 hover:scale-105 animate-fadein flex-shrink-0"
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
						<div className="text-2xl mb-1 transition-transform duration-300 group-hover:scale-125">
							{card.icon}
						</div>
						<h2 className="text-sm font-semibold text-green-700 mb-1">
							{card.title}
						</h2>
						<p className="text-gray-500 text-xs">{card.desc}</p>
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
			<style>{`
        @media (max-width: 640px) {
          .flex-row.flex-nowrap {
            gap: 0.5rem !important;
          }
          .flex-row.flex-nowrap > div {
            width: 130px !important;
            height: 130px !important;
            min-width: 130px !important;
            min-height: 130px !important;
            max-width: 140px !important;
            max-height: 140px !important;
          }
          .flex-row.flex-nowrap > div h2 {
            font-size: 0.85rem !important;
          }
          .flex-row.flex-nowrap > div p {
            font-size: 0.7rem !important;
          }
          .flex-row.flex-nowrap > div div {
            font-size: 1.2rem !important;
          }
        }
        @keyframes fadein {
          0% { opacity: 0; transform: translateY(30px) scale(0.95);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-fadein {
          animation: fadein 0.7s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
		</div>
	);
};

export default PaymentVai;
