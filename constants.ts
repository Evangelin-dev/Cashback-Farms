import React from 'react';
import { Plot, PlotType, MaterialCategory, Material, Professional, ServiceType, BookMySqftPlotInfo, SqftUnit } from './types';

export const MOCK_PLOTS: Plot[] = [
  {
    id: 'plot1',
    title: 'Serene Valley Plot',
    location: 'Greenfield Estates, Bangalore',
    price: 5000000,
    area: 2400,
    imageUrl: 'https://picsum.photos/seed/plot1/400/300',
    type: PlotType.PUBLIC,
    description: 'A beautiful plot in a rapidly developing area, perfect for your dream home. North-facing with good road access.',
    amenities: ['Water Connection', 'Electricity', 'Gated Community'],
    sqftPrice: 2000,
  },
  {
    id: 'plot2',
    title: 'Greenheap Prime Location',
    location: 'Orchard Avenue, Pune',
    price: 7500000,
    area: 3000,
    imageUrl: 'https://picsum.photos/seed/plot2/400/300',
    type: PlotType.VERIFIED,
    description: 'A Greenheap verified plot with all legal checks complete. Ready for immediate construction. Close to schools and hospitals.',
    isFlagship: true,
    amenities: ['24/7 Security', 'Clubhouse Access', 'Paved Roads', 'Park'],
    sqftPrice: 2500,
  },
  {
    id: 'plot3',
    title: 'Riverside Retreat',
    location: 'Willow Creek, Chennai',
    price: 6000000,
    area: 2000,
    imageUrl: 'https://picsum.photos/seed/plot3/400/300',
    type: PlotType.PUBLIC,
    description: 'Peaceful plot located near the river, offering scenic views. Ideal for a weekend getaway home or investment.',
    sqftPrice: 3000,
  },
   {
    id: 'plot4-bms',
    title: 'Book My SqFt Special Plot',
    location: 'Tech Park Extension, Hyderabad',
    price: 0, // Price determined by sqft selection
    area: 5000, // Total area available for sqft booking
    imageUrl: 'https://picsum.photos/seed/plot4/400/300',
    type: PlotType.VERIFIED,
    description: 'Exclusive Greenheap plot available for "Book My SqFt". Choose your desired area and build your future.',
    sqftPrice: 1800,
    isFlagship: true,
  },
];

export const MOCK_MATERIAL_CATEGORIES: MaterialCategory[] = [
  { id: 'cat1', name: 'Cement', imageUrl: 'https://picsum.photos/seed/cement/100/100' },
  { id: 'cat2', name: 'Bricks & Blocks', imageUrl: 'https://picsum.photos/seed/bricks/100/100' },
  { id: 'cat3', name: 'Sand & Aggregates', imageUrl: 'https://picsum.photos/seed/sand/100/100' },
  { id: 'cat4', name: 'Tiles & Flooring', imageUrl: 'https://picsum.photos/seed/tiles/100/100' },
  { id: 'cat5', name: 'Steel & TMT Bars', imageUrl: 'https://picsum.photos/seed/steel/100/100' },
  { id: 'cat6', name: 'Paints & Finishes', imageUrl: 'https://picsum.photos/seed/paints/100/100' },
];

export const MOCK_MATERIALS: Material[] = [
  { id: 'mat1', name: 'UltraTech Cement PPC', category: 'Cement', price: 380, moq: 50, shippingTime: '2-3 days', vendor: 'Reliable Builders Inc.', imageUrl: 'https://picsum.photos/seed/mat1/300/200', description: 'Portland Pozzolana Cement, ideal for all types of construction.' },
  { id: 'mat2', name: 'Red Clay Bricks (Class A)', category: 'Bricks & Blocks', price: 8, moq: 1000, shippingTime: '3-5 days', vendor: 'Heritage Bricks Co.', imageUrl: 'https://picsum.photos/seed/mat2/300/200', description: 'High-quality red clay bricks, perfect for strong and durable walls.' },
  { id: 'mat3', name: 'River Sand (Fine Grade)', category: 'Sand & Aggregates', price: 2000, moq: 1, shippingTime: '1-2 days', vendor: 'EarthMovers Ltd.', imageUrl: 'https://picsum.photos/seed/mat3/300/200', description: 'Fine grade river sand suitable for plastering and concrete work. Price per cubic meter.' },
  { id: 'mat4', name: 'Vitrified Floor Tiles (600x600mm)', category: 'Tiles & Flooring', price: 45, moq: 100, shippingTime: '4-6 days', vendor: 'Elegant Tiles Emporium', imageUrl: 'https://picsum.photos/seed/mat4/300/200', description: 'Glossy finish vitrified tiles for modern interiors. Price per sq. ft.' },
  { id: 'mat5', name: 'TMT Steel Bars Fe500D', category: 'Steel & TMT Bars', price: 65, moq: 500, shippingTime: '3-5 days', vendor: 'StrongHold Steel Corp.', imageUrl: 'https://picsum.photos/seed/mat5/300/200', description: 'High-strength TMT steel bars for reinforced concrete structures. Price per kg.' },
];

export const MOCK_PROFESSIONALS: Professional[] = [
  { id: 'prof1', name: 'Ar. Priya Sharma', service: ServiceType.ARCHITECT, rating: 4.8, rate: '₹3000/consultation', imageUrl: 'https://picsum.photos/seed/prof1/300/300', specialization: 'Residential & Sustainable Design', bio: 'Experienced architect focusing on eco-friendly and modern homes.' },
  { id: 'prof2', name: 'ID. Rahul Verma', service: ServiceType.INTERIOR_DESIGNER, rating: 4.9, rate: '₹200/sqft', imageUrl: 'https://picsum.photos/seed/prof2/300/300', specialization: 'Modern & Minimalist Interiors', bio: 'Transforming spaces with creativity and functionality. Specializes in luxury apartments.' },
  { id: 'prof3', name: 'Ar. Anjali Reddy', service: ServiceType.ARCHITECT, rating: 4.5, rate: 'Project-based', imageUrl: 'https://picsum.photos/seed/prof3/300/300', specialization: 'Commercial & Office Spaces', bio: 'Innovative architectural solutions for businesses. Proven track record of delivering projects on time.'},
  { id: 'prof4', name: 'ID. Sameer Khan', service: ServiceType.INTERIOR_DESIGNER, rating: 4.7, rate: '₹2500/consultation + project', imageUrl: 'https://picsum.photos/seed/prof4/300/300', specialization: 'Bohemian & Eclectic Styles', bio: 'Creating unique and personalized interiors that reflect your personality.'},
];

const generateSqftGrid = (rows: number, cols: number, bookedUnits?: {row: number, col: number}[]): SqftUnit[][] => {
  const grid: SqftUnit[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: SqftUnit[] = [];
    for (let j = 0; j < cols; j++) {
      const isBooked = bookedUnits?.some(unit => unit.row === i && unit.col === j) || false;
      row.push({
        id: `R${i}C${j}`,
        row: i,
        col: j,
        isAvailable: !isBooked,
        isSelected: false,
        isBooked: isBooked,
      });
    }
    grid.push(row);
  }
  return grid;
};


export const MOCK_BMS_PLOT_INFO: BookMySqftPlotInfo = {
  id: 'bms-plot-alpha',
  name: 'Alpha Square - Book My SqFt',
  location: 'Central Business District, Gurgaon',
  totalUnits: 100, // 10x10 grid
  unitsWide: 10,
  unitsTall: 10,
  sqftPricePerUnit: 25000, // Assuming each unit is e.g. 10 sqft, so price per unit
  emiOptions: ['3 months @ 5% interest', '6 months @ 7% interest', '12 months @ 10% interest'],
  initialGrid: generateSqftGrid(10, 10, [{row: 2, col: 3}, {row: 5, col: 7}, {row: 0, col:0}]),
};

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Plot Marketplace', path: '/plots' },
  { name: 'Book My SqFt', path: `/book-my-sqft/${MOCK_BMS_PLOT_INFO.id}` },
  { name: 'Materials Store', path: '/materials' },
  { name: 'Professional Services', path: '/services' },
  { name: 'Dash Board', path: '/dashboard' },
];

// SVG Icons (Heroicons)
export const LocationMarkerIcon: React.FC = () => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 inline mr-1", viewBox: "0 0 20 20", fill: "currentColor" },
    React.createElement('path', { fillRule: "evenodd", d: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z", clipRule: "evenodd" })
  )
);

export const CheckBadgeIcon: React.FC = () => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: "w-5 h-5 inline text-green-500" },
    React.createElement('path', { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z", clipRule: "evenodd" })
  )
);

export const AreaIcon: React.FC = () => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 inline mr-1", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2" },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" })
  )
);

export const RupeeIcon: React.FC = () => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    className: "h-5 w-5 inline mr-1",
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5" // Adjusted for visual clarity; can be fine-tuned
  },
    React.createElement('path', {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      // Standard path for Indian Rupee Symbol (₹)
      // M6 3 H16 (top bar), M6 7 H16 (middle bar), M9 7 V17 (vertical stem), M6 11 H10 (lower horizontal bar on stem)
      // Simplified for better rendering in small sizes:
      d: "M6 4h10M6 8h10M8.5 8v8M6 12h5"
    })
  )
);
