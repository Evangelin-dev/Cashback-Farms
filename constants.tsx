
import React from 'react';
import { Plot, User, Booking, MaterialCategory, PaymentInstallment, Professional, SiteDetails, MaterialDetail, PaymentStatus, UserRole, BookingStatus, PaymentType, InvestmentDetails, PropertyListing, ListingType, PropertyCategory, ResidentialPropertyType, CommercialPropertyType, PropertyLocation, CommercialPropertyInfo, PlotType, ServiceType } from './types';

export const IconDashboard = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

export const IconUserCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const IconBuildingOffice = (props: React.SVGProps<SVGSVGElement>) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5A.375.375 0 019 6.75zM9 12.75h6.375a.375.375 0 01.375.375v1.5a.375.375 0 01-.375.375H9a.375.375 0 01-.375-.375v-1.5a.375.375 0 01.375-.375z" />
  </svg>
);

export const IconMapPin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);


export const IconCollection = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export const IconInformationCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

export const IconLogout = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);

export const IconChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

export const IconTableCells = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6zM3.75 12h16.5M12 3.75v16.5" />
  </svg>
);

export const IconUsers = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

export const IconCubeTransparent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

export const IconCreditCard = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-5.25H21.75m-3-5.25H21.75m0 0V5.25A2.25 2.25 0 0019.5 3H4.5A2.25 2.25 0 002.25 5.25v13.5A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V15M18 14.25h.008v.008H18v-.008z" />
  </svg>
);

export const IconCog = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.057-1.246a11.99 11.99 0 017.583 1.05A11.952 11.952 0 0122 11.882a11.952 11.952 0 01-1.27 6.188a11.99 11.99 0 01-7.583 1.05c-.497-.239-.966-.704-1.057-1.246m0 0L6.75 12l2.844-2.882m0 0c-.09-.542-.56-1.007-1.057-1.246A11.99 11.99 0 002 11.882a11.952 11.952 0 001.27 6.188a11.99 11.99 0 007.583 1.05c.497-.239.966-.704 1.057-1.246M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" />
  </svg>
);

export const IconKey = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

export const IconShieldCheck = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);


export const IconPlus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const IconPencil = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

export const IconTrash = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.033 3.223.096M15 5.25V4.5a2.25 2.25 0 00-2.25-2.25H11.25A2.25 2.25 0 009 4.5v.75M5.75 5.25H18.25" />
  </svg>
);

export const IconSearch = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);


// --- Mock Data ---
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


export let MOCK_USERS: User[] = [
  { id: 'user-001', name: 'Alice Wonderland', email: 'alice@example.com', role: UserRole.USER, createdAt: '2023-01-10' },
  { id: 'user-002', name: 'Bob The Builder', email: 'bob@example.com', role: UserRole.USER, createdAt: '2023-02-15' },
  { id: 'admin-001', name: 'AdminISTRATOR', email: 'admin@cashbackfarm.com', role: UserRole.ADMIN, createdAt: '2023-01-01' },
];

export let MOCK_PAYMENTS: PaymentInstallment[] = [
  // Payments for Booking B001 (Plot AG-P1-A101)
  { id: 'pay-001', bookingId: 'B001', scheduleName: 'Booking Advance', dueDate: '2024-01-15', amount: 60000, status: PaymentStatus.PAID, paymentType: PaymentType.BOOKING_ADVANCE, paidDate: '2024-01-14', transactionId: 'TXN1001' },
  { id: 'pay-002', bookingId: 'B001', scheduleName: '1st Installment', dueDate: '2024-03-15', amount: 120000, status: PaymentStatus.PAID, paymentType: PaymentType.INSTALLMENT, paidDate: '2024-03-10', transactionId: 'TXN1002' },
  { id: 'pay-003', bookingId: 'B001', scheduleName: '2nd Installment', dueDate: '2024-06-15', amount: 120000, status: PaymentStatus.DUE, paymentType: PaymentType.INSTALLMENT },
  { id: 'pay-004', bookingId: 'B001', scheduleName: '3rd Installment', dueDate: '2024-09-15', amount: 150000, status: PaymentStatus.UPCOMING, paymentType: PaymentType.INSTALLMENT },
  { id: 'pay-005', bookingId: 'B001', scheduleName: 'Final Payment', dueDate: '2024-12-15', amount: 150000, status: PaymentStatus.UPCOMING, paymentType: PaymentType.INSTALLMENT },
  // Payments for another booking (imaginary)
  { id: 'pay-006', bookingId: 'B002', scheduleName: 'Booking Advance', dueDate: '2024-02-20', amount: 75000, status: PaymentStatus.PENDING, paymentType: PaymentType.BOOKING_ADVANCE },
  { id: 'pay-007', bookingId: 'B002', scheduleName: '1st Installment', dueDate: '2024-04-20', amount: 150000, status: PaymentStatus.UPCOMING, paymentType: PaymentType.INSTALLMENT },
];

export let MOCK_BOOKINGS: Booking[] = [
  {
    id: 'B001',
    plotId: 'AG-P1-A101',
    userId: 'user-001',
    bookingDate: '2024-01-15',
    status: BookingStatus.CONFIRMED,
    paymentIds: ['pay-001', 'pay-002', 'pay-003', 'pay-004', 'pay-005'],
    investmentDetails: { // Example specific to this booking for user view
        yourInvestment: MOCK_PLOTS.find(p=>p.id === 'AG-P1-A101')?.plotValue || 0,
        cashbackPercentage: 10,
        cashbackAmount: (MOCK_PLOTS.find(p=>p.id === 'AG-P1-A101')?.plotValue || 0) * 0.10,
        netInvestment: (MOCK_PLOTS.find(p=>p.id === 'AG-P1-A101')?.plotValue || 0) * 0.90,
    }
  },
   {
    id: 'B002',
    plotId: 'AG-P1-A102', // Assuming this plot will be marked unavailable once booking is confirmed
    userId: 'user-002',
    bookingDate: '2024-02-20',
    status: BookingStatus.PENDING_CONFIRMATION,
    paymentIds: ['pay-006', 'pay-007']
  },
];

export let MOCK_SITE_DETAILS: SiteDetails = {
  id: 'site-alpha-main',
  name: 'Alpha Greens Township',
  location: 'Green Valley, North City',
  description: 'A premium plotted development project offering a serene living experience amidst nature, equipped with modern amenities and excellent connectivity. Spread across 50 acres of lush landscapes.',
  amenities: ['Clubhouse', 'Swimming Pool', 'Gymnasium', 'Landscaped Gardens', '24/7 Security', 'Children\'s Play Area', 'Jogging Track'],
  sitePlanImageUrl: 'https://picsum.photos/seed/siteplan/800/500',
};

export let MOCK_MATERIALS: MaterialDetail[] = [
  { id: 'mat1', name: 'Eco-friendly Bricks', description: 'Locally sourced, high-compression strength bricks with low environmental impact.', qualityStandard: 'IS 1077', supplier: 'GreenBuild Co.', imageUrl: 'https://picsum.photos/seed/bricks/100/100' },
  { id: 'mat2', name: 'Premium Cement', description: 'OPC 53 Grade cement ensuring high durability and strength for all structures.', qualityStandard: 'IS 269', supplier: 'UltraRock Cement', imageUrl: 'https://picsum.photos/seed/cement/100/100' },
  { id: 'mat3', name: 'TMT Steel Bars', description: 'Fe500D TMT bars for superior earthquake resistance and structural integrity.', qualityStandard: 'IS 1786', supplier: 'StrongSteel Inc.', imageUrl: 'https://picsum.photos/seed/steel/100/100' },
  { id: 'mat4', name: 'Vitrified Tiles', description: 'Double-charged vitrified tiles for flooring, offering durability and aesthetic appeal.', qualityStandard: 'IS 15622', supplier: 'DecorTiles Ltd.', imageUrl: 'https://picsum.photos/seed/tiles/100/100' },
];

// Helper function to get booking details for user view (similar to old MOCK_BOOKING_DETAILS)
export const getExtendedBookingDetailsById = (bookingId: string): (Omit<Booking, 'paymentIds'> & {
  plotInfo: Plot | undefined;
  user: User | undefined;
  payments: PaymentInstallment[];
  siteDetails: SiteDetails;
  materials: MaterialDetail[];
  investmentDetails: InvestmentDetails | undefined;
  paymentSummary: { totalPaid: number; totalDue: number; balance: number; totalValue: number };
}) | undefined => {
  const booking = MOCK_BOOKINGS.find(b => b.id === bookingId);
  if (!booking) return undefined;

  const plotInfo = MOCK_PLOTS.find(p => p.id === booking.plotId);
  const user = MOCK_USERS.find(u => u.id === booking.userId);
  const payments = MOCK_PAYMENTS.filter(p => p.bookingId === booking.id);

  let totalPaid = 0;
  let totalDue = 0;
  payments.forEach(p => {
    if (p.status === PaymentStatus.PAID) totalPaid += p.amount;
    if (p.status === PaymentStatus.DUE || p.status === PaymentStatus.OVERDUE || p.status === PaymentStatus.PENDING) totalDue += p.amount;
  });
  const totalValue = plotInfo?.plotValue || 0;
  const balance = totalValue - totalPaid;


  const { paymentIds, ...restOfBooking } = booking; // Exclude paymentIds from top level of returned booking

  return {
      ...restOfBooking,
      plotInfo,
      user,
      payments,
      siteDetails: MOCK_SITE_DETAILS,
      materials: MOCK_MATERIALS,
      investmentDetails: booking.investmentDetails, // Use the one from MOCK_BOOKINGS
      paymentSummary: { totalPaid, totalDue, balance, totalValue }
  };
};

// --- New Mock Data for Property Listings ---
export const MOCK_PROPERTY_LISTINGS: PropertyListing[] = [
  {
    id: 'prop-001',
    listingType: ListingType.BUY,
    propertyCategory: PropertyCategory.RESIDENTIAL,
    residentialType: ResidentialPropertyType.APARTMENT,
    title: 'Spacious 3 BHK Apartment in Prime Location',
    description: 'A beautiful and well-maintained 3 BHK apartment with modern amenities and excellent connectivity. Ready to move in.',
    location: { locality: 'Koramangala', city: 'Bengaluru', pincode: '560034' },
    areaSqFt: 1650,
    price: 12500000, // 1.25 Cr
    bedrooms: 3,
    bathrooms: 3,
    amenities: ['Swimming Pool', 'Gym', 'Clubhouse', '24/7 Security', 'Power Backup'],
    images: ['https://picsum.photos/seed/apt1/600/400', 'https://picsum.photos/seed/apt1_int/600/400'],
    postedDate: '2024-05-01',
    availabilityStatus: 'Available',
    contactName: 'Owner (Mr. Sharma)',
    contactNumber: '98XXXXXX01',
    isOwnerListing: true,
  },
  {
    id: 'prop-002',
    listingType: ListingType.RENT,
    propertyCategory: PropertyCategory.RESIDENTIAL,
    residentialType: ResidentialPropertyType.APARTMENT,
    title: 'Modern 2 BHK for Rent near IT Hub',
    description: 'Well-ventilated 2 BHK flat available for rent, ideal for IT professionals. Close to major tech parks.',
    location: { locality: 'Whitefield', city: 'Bengaluru', pincode: '560066' },
    areaSqFt: 1100,
    price: 0, // Not for sale
    rentPerMonth: 35000,
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['Covered Parking', 'Lift', 'Security'],
    images: ['https://picsum.photos/seed/apt2/600/400', 'https://picsum.photos/seed/apt2_int/600/400'],
    postedDate: '2024-05-10',
    availabilityStatus: 'Available',
    contactName: 'Owner (Ms. Priya)',
    contactNumber: '99XXXXXX02',
    isOwnerListing: true,
  },
  {
    id: 'prop-003',
    listingType: ListingType.BUY,
    propertyCategory: PropertyCategory.COMMERCIAL,
    commercialType: CommercialPropertyType.OFFICE_SPACE,
    title: 'Prime Office Space in Business District',
    description: 'Fully furnished office space suitable for startups and MNCs. Located in a prestigious commercial building.',
    location: { locality: 'MG Road', city: 'Bengaluru', pincode: '560001' },
    areaSqFt: 2500,
    price: 30000000, // 3 Cr
    amenities: ['Reception Area', 'Conference Room', 'Pantry', 'High-speed Internet'],
    images: ['https://picsum.photos/seed/office1/600/400'],
    postedDate: '2024-04-15',
    availabilityStatus: 'Available',
    contactName: 'Real Estate Agency',
    contactNumber: '97XXXXXX03',
    isOwnerListing: false,
  },
  {
    id: 'prop-004',
    listingType: ListingType.RENT,
    propertyCategory: PropertyCategory.COMMERCIAL,
    commercialType: CommercialPropertyType.SHOP,
    title: 'Retail Shop for Rent on High Street',
    description: 'Excellent visibility retail shop on a busy high street. Ideal for various businesses.',
    location: { locality: 'Indiranagar 100ft Road', city: 'Bengaluru', pincode: '560038' },
    areaSqFt: 800,
    price: 0,
    rentPerMonth: 75000,
    amenities: ['Main Road Facing', 'Ample Footfall', 'Restroom'],
    images: ['https://picsum.photos/seed/shop1/600/400'],
    postedDate: '2024-05-05',
    availabilityStatus: 'Available',
    contactName: 'Owner (Mr. Kumar)',
    contactNumber: '96XXXXXX04',
    isOwnerListing: true,
  }
];

// --- Mock Data for Admin Commercial Properties ---
export let MOCK_COMMERCIAL_PROPERTIES: CommercialPropertyInfo[] = [
  {
    id: 'comm-001',
    propertyName: 'Innovatech Hub - Unit A',
    commercialType: CommercialPropertyType.OFFICE_SPACE,
    location: { locality: 'Electronic City', city: 'Bengaluru', pincode: '560100', addressLine1: 'No. 123, Tech Avenue' },
    areaSqFt: 3000,
    isForSale: false,
    isForRent: true,
    rentPerMonth: 150000,
    availabilityStatus: 'Available',
    description: 'Grade A office space with modern interiors, plug and play setup available. Suitable for IT/ITES companies.',
    amenities: ['24/7 Power Backup', 'Central AC', 'Security', 'Cafeteria Access', 'Meeting Rooms'],
    imagesUrls: ['https://picsum.photos/seed/commoffice1/300/200', 'https://picsum.photos/seed/commoffice1_b/300/200'],
    floor: '5th Floor',
    totalFloors: 10,
    parkingSpaces: 20,
    yearBuilt: 2018,
    contactPerson: 'Rajesh Singh',
    contactNumber: '9876543210',
    addedDate: '2024-01-15',
  },
  {
    id: 'comm-002',
    propertyName: 'Downtown Retail Plaza - Shop G5',
    commercialType: CommercialPropertyType.SHOP,
    location: { locality: 'Commercial Street', city: 'Bengaluru', pincode: '560001', addressLine1: 'Shop G5, Downtown Plaza' },
    areaSqFt: 600,
    isForSale: true,
    salePrice: 18000000, // 1.8 Cr
    isForRent: true,
    rentPerMonth: 90000,
    availabilityStatus: 'Available',
    description: 'High footfall retail shop in a prime shopping district. Glass frontage.',
    amenities: ['Main road facing', 'Signage space', 'Shared restrooms'],
    imagesUrls: ['https://picsum.photos/seed/commshop1/300/200'],
    floor: 'Ground Floor',
    contactPerson: 'Priya Menon',
    contactNumber: '9123456789',
    addedDate: '2024-02-20',
  },
  {
    id: 'comm-003',
    propertyName: 'Alpha Logistics Park - Unit W2',
    commercialType: CommercialPropertyType.WAREHOUSE,
    location: { locality: 'Peenya Industrial Area', city: 'Bengaluru', pincode: '560058', addressLine1: 'Unit W2, Alpha Park' },
    areaSqFt: 10000,
    isForSale: false,
    isForRent: true,
    rentPerMonth: 250000,
    availabilityStatus: 'Leased',
    description: 'Large warehouse with high ceilings, loading docks, and office space. Suitable for logistics and storage.',
    amenities: ['Loading Docks', '24/7 Security', 'Truck Parking', 'Fire Safety'],
    imagesUrls: ['https://picsum.photos/seed/commwarehouse1/300/200'],
    contactPerson: 'Anil Kumar',
    contactNumber: '9000011111',
    addedDate: '2023-12-01',
  }
];


export const MOCK_PROFESSIONALS: Professional[] = [
  { id: 'prof1', name: 'Ar. Priya Sharma', service: ServiceType.ARCHITECT, rating: 4.8, rate: '₹3000/consultation', imageUrl: 'https://picsum.photos/seed/prof1/300/300', specialization: 'Residential & Sustainable Design', bio: 'Experienced architect focusing on eco-friendly and modern homes.' },
  { id: 'prof2', name: 'ID. Rahul Verma', service: ServiceType.INTERIOR_DESIGNER, rating: 4.9, rate: '₹200/sqft', imageUrl: 'https://picsum.photos/seed/prof2/300/300', specialization: 'Modern & Minimalist Interiors', bio: 'Transforming spaces with creativity and functionality. Specializes in luxury apartments.' },
  { id: 'prof3', name: 'Ar. Anjali Reddy', service: ServiceType.ARCHITECT, rating: 4.5, rate: 'Project-based', imageUrl: 'https://picsum.photos/seed/prof3/300/300', specialization: 'Commercial & Office Spaces', bio: 'Innovative architectural solutions for businesses. Proven track record of delivering projects on time.'},
  { id: 'prof4', name: 'ID. Sameer Khan', service: ServiceType.INTERIOR_DESIGNER, rating: 4.7, rate: '₹2500/consultation + project', imageUrl: 'https://picsum.photos/seed/prof4/300/300', specialization: 'Bohemian & Eclectic Styles', bio: 'Creating unique and personalized interiors that reflect your personality.'},
  // Buy Services
  { id: 'buy1', name: 'Builder Projects', service: ServiceType.BUY_SERVICE, rating: 4.6, rate: '₹5000/project', imageUrl: 'https://picsum.photos/seed/buy1/300/300', specialization: 'Residential & Commercial', bio: 'Expert in builder projects for homes and offices.' },
  { id: 'buy2', name: 'Construction Materials', service: ServiceType.BUY_SERVICE, rating: 4.5, rate: '₹1000/consultation', imageUrl: 'https://picsum.photos/seed/buy2/300/300', specialization: 'All construction materials', bio: 'Supplier of quality construction materials.' },
  { id: 'buy3', name: 'Property Legal Services', service: ServiceType.BUY_SERVICE, rating: 4.7, rate: '₹2000/case', imageUrl: 'https://picsum.photos/seed/buy3/300/300', specialization: 'Legal documentation', bio: 'Legal expert for property matters.' },
  { id: 'buy4', name: 'Home Interiors', service: ServiceType.BUY_SERVICE, rating: 4.8, rate: '₹300/sqft', imageUrl: 'https://picsum.photos/seed/buy4/300/300', specialization: 'Modern interiors', bio: 'Interior design for homes and apartments.' },
  { id: 'buy5', name: 'Plot Maintenance', service: ServiceType.BUY_SERVICE, rating: 4.4, rate: '₹1500/month', imageUrl: 'https://picsum.photos/seed/buy5/300/300', specialization: 'Plot cleaning & maintenance', bio: 'Reliable plot maintenance services.' },

  // Sell Services
  { id: 'sell1', name: 'Property Listing', service: ServiceType.SELL_SERVICE, rating: 4.5, rate: '₹2000/listing', imageUrl: 'https://picsum.photos/seed/sell1/300/300', specialization: 'Online & offline listing', bio: 'Get your property listed for sale.' },
  { id: 'sell2', name: 'Brokerage Services', service: ServiceType.SELL_SERVICE, rating: 4.3, rate: '2% commission', imageUrl: 'https://picsum.photos/seed/sell2/300/300', specialization: 'Brokerage', bio: 'Professional brokerage for property sales.' },
  { id: 'sell3', name: 'Resale Assistance', service: ServiceType.SELL_SERVICE, rating: 4.6, rate: '₹3000/transaction', imageUrl: 'https://picsum.photos/seed/sell3/300/300', specialization: 'Resale', bio: 'Assistance with property resale.' },
  { id: 'sell4', name: 'Land Sale', service: ServiceType.SELL_SERVICE, rating: 4.7, rate: '₹5000/acre', imageUrl: 'https://picsum.photos/seed/sell4/300/300', specialization: 'Land sales', bio: 'Expert in land sales and documentation.' },
  { id: 'sell5', name: 'Commercial Property Sale', service: ServiceType.SELL_SERVICE, rating: 4.5, rate: '₹10000/property', imageUrl: 'https://picsum.photos/seed/sell5/300/300', specialization: 'Commercial property', bio: 'Sell your commercial property with ease.' },

  // Commercial Services
  { id: 'comm1', name: 'Packers and Movers', service: ServiceType.COMMERCIAL_SERVICE, rating: 4.6, rate: '₹5000/move', imageUrl: 'https://picsum.photos/seed/comm1/300/300', specialization: 'Relocation', bio: 'Professional packers and movers for homes and offices.' },
  { id: 'comm2', name: 'Building Materials', service: ServiceType.COMMERCIAL_SERVICE, rating: 4.5, rate: '₹1000/consultation', imageUrl: 'https://picsum.photos/seed/comm2/300/300', specialization: 'All building materials', bio: 'Supplier of commercial building materials.' },
  { id: 'comm3', name: 'Home Cleaning', service: ServiceType.COMMERCIAL_SERVICE, rating: 4.7, rate: '₹1500/cleaning', imageUrl: 'https://picsum.photos/seed/comm3/300/300', specialization: 'Deep cleaning', bio: 'Home and office cleaning services.' },
  { id: 'comm4', name: 'Sanitary Kitchen Electric Shop', service: ServiceType.COMMERCIAL_SERVICE, rating: 4.4, rate: '₹500/visit', imageUrl: 'https://picsum.photos/seed/comm4/300/300', specialization: 'Sanitary & kitchen', bio: 'Sanitary, kitchen, and electric shop solutions.' },
  { id: 'comm5', name: 'Building Planner', service: ServiceType.COMMERCIAL_SERVICE, rating: 4.8, rate: '₹8000/project', imageUrl: 'https://picsum.photos/seed/comm5/300/300', specialization: 'Planning', bio: 'Building planning and consulting.' },
  { id: 'comm6', name: 'Construction Materials', service: ServiceType.COMMERCIAL_SERVICE, rating: 4.5, rate: '₹1000/consultation', imageUrl: 'https://picsum.photos/seed/comm6/300/300', specialization: 'Materials', bio: 'Commercial construction material supplier.' },
];
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