
export enum PaymentStatus {
  PAID = 'Paid',
  DUE = 'Due',
  UPCOMING = 'Upcoming',
  OVERDUE = 'Overdue',
  PENDING = 'Pending' // Added for clarity, esp for advances
}

export enum PaymentType {
  BOOKING_ADVANCE = 'Booking Advance',
  INSTALLMENT = 'Installment',
  FINAL = 'Final Payment',
}

export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User'
}

export enum BookingStatus {
  PENDING_CONFIRMATION = 'Pending Confirmation',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed'
}

export interface Plot {
  id: string;
  title: string;
  location: string;
  price: number;
  area: number; // in sqft
  imageUrl: string;
  type: PlotType;
  value: number;
  description: string;
  amenities?: string[];
  isFlagship?: boolean;
  documents?: string[]; 
  sqftPrice?: number; // For plots that can be booked by sqft
  plotValue?: number; // Total value of the plot, if applicable
}

export interface MaterialCategory {
  id: string;
  name: string;
  imageUrl: string;
}

export interface InvestmentDetails { // This seems specific to a user's view of a booking
  yourInvestment: number;
  cashbackPercentage: number;
  cashbackAmount: number;
  netInvestment: number;
}

export interface PaymentInstallment {
  id: string; // Unique ID for the payment record
  bookingId: string; // Link to a booking
  scheduleName: string;
  dueDate: string;
  amount: number;
  status: PaymentStatus;
  paymentType: PaymentType;
  paidDate?: string;
  transactionId?: string;
}

export interface PaymentSummary { // This is likely calculated for a specific booking
  totalPaid: number;
  totalDue: number;
  balance: number;
  totalValue: number; // Total value of the booking/plot
}

export interface SiteDetails {
  id: string; // Should be a single site for the project, e.g., 'main-site'
  name: string;
  location: string;
  description: string;
  amenities: string[];
  sitePlanImageUrl?: string;
}

export interface MaterialDetail {
  id: string;
  name: string;
  description: string;
  qualityStandard: string;
  supplier?: string;
  imageUrl?: string;
  pricing:number;
  category: MaterialCategory; // Reference to MaterialCategory
  moq: number; // Minimum Order Quantity
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Booking {
  id: string; // Unique booking ID
  plotId: string; // Reference to PlotInfo.id
  userId: string; // Reference to User.id
  bookingDate: string;
  status: BookingStatus;
  // InvestmentDetails might be part of a booking or calculated
  investmentDetails?: InvestmentDetails; // Optional here, can be primary for user view
  paymentIds: string[]; // List of associated payment installment IDs
}


// This was the old BookingDetails, which combined many things.
// The new structure separates concerns for better admin management.
export interface UserViewBookingDetails {
  plotInfo: Plot;
  investmentDetails: InvestmentDetails;
  paymentInstallments: PaymentInstallment[]; // Filtered for this booking
  paymentSummary: PaymentSummary; // Calculated for this booking
  siteDetails: SiteDetails; // Global site details
  materials: MaterialDetail[]; // Global materials list
  user: User; // The user who made the booking
  bookingInfo: Booking; // Core booking record
}

// --- New Types for Property Listing ---

export enum ListingType {
  BUY = 'Buy',
  RENT = 'Rent'
}

export enum PropertyCategory {
  RESIDENTIAL = 'Residential',
  COMMERCIAL = 'Commercial', // For user-facing search filter if needed
  PLOT = 'Plot' // Existing type, can be integrated
}

export enum ResidentialPropertyType {
  APARTMENT = 'Apartment',
  VILLA = 'Villa',
  INDEPENDENT_HOUSE = 'Independent House',
  PLOT = 'Plot' // Residential plot
}

export enum CommercialPropertyType {
  OFFICE_SPACE = 'Office Space',
  CO_WORKING = 'Co-working Space',
  SHOP = 'Shop',
  SHOWROOM = 'Showroom',
  WAREHOUSE = 'Warehouse / Godown',
  INDUSTRIAL_BUILDING = 'Industrial Building',
  INDUSTRIAL_SHED = 'Industrial Shed',
  COMMERCIAL_PLOT = 'Commercial Plot/Land',
  OTHER = 'Other Commercial'
}

export interface PropertyLocation {
  addressLine1?: string;
  locality: string;
  city: string;
  pincode?: string;
  state?: string;
  country?: string;
  mapLink?: string;
}

export interface PropertyListing {
  id: string;
  listingType: ListingType; // Buy or Rent
  propertyCategory: PropertyCategory; // Residential or Commercial
  
  title: string; // e.g., "3 BHK Luxury Apartment" or "Spacious Office for Rent"
  description: string;
  
  location: PropertyLocation;
  
  areaSqFt: number;
  price: number; // If for sale
  rentPerMonth?: number; // If for rent
  
  bedrooms?: number; // For residential
  bathrooms?: number; // For residential
  residentialType?: ResidentialPropertyType; // For residential (e.g. Apartment, Villa)
  
  commercialType?: CommercialPropertyType; // For commercial properties

  amenities: string[];
  images: string[]; // URLs of images
  
  postedDate: string;
  availabilityStatus: 'Available' | 'Sold' | 'Rented';
  
  contactName: string;
  contactNumber: string;
  contactEmail?: string;
  isOwnerListing: boolean; // To highlight "No Brokerage"
}

// --- Type for Admin Management of Commercial Properties ---
export interface CommercialPropertyInfo {
  id: string;
  propertyName: string; // e.g., "ABC Tech Park Unit 201" or "Main Street Retail Space"
  commercialType: CommercialPropertyType;
  location: PropertyLocation; // Re-use or specify more admin-centric location fields
  areaSqFt: number;
  
  isForSale: boolean;
  salePrice?: number;
  
  isForRent: boolean;
  rentPerMonth?: number;
  
  availabilityStatus: 'Available' | 'Leased' | 'Sold' | 'Under Offer';
  description: string;
  amenities: string[]; // Comma separated or array
  imagesUrls: string[]; // Comma separated or array of URLs
  
  floor?: string; // e.g., "3rd Floor", "Ground Floor"
  totalFloors?: number;
  parkingSpaces?: number;
  yearBuilt?: number;
  
  contactPerson: string;
  contactNumber: string;
  addedDate: string;
}

export enum PlotType {
  PUBLIC = 'Public Listing',
  VERIFIED = 'Greenheap Verified',
}



export interface MaterialCategory {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Material {
  id:string;
  name: string;
  category: string;
  price: number;
  moq: number; 
  shippingTime: string;
  vendor: string;
  imageUrl:string;
  description: string;
}

export enum ServiceType {
  ARCHITECT = 'Architect',
  CIVIL_ENGINEER = 'Civil Engineer',
  INTERIOR_DESIGNER = 'Interior Designer',
  STRUCTURAL_CONSULTANT = 'Structural Consultant',
  BUY_SERVICE = "Buy Service",
  SELL_SERVICE = "Sell Service",
  COMMERCIAL_SERVICE = "Commercial Service",
}

export interface Professional {
  id: string;
  name: string;
  service: ServiceType;
  rating: number;
  rate: string; 
  imageUrl: string;
  specialization: string;
  bio: string;
  portfolioImages?: string[];
}

export interface SqftUnit {
  id: string; 
  row: number;
  col: number;
  isAvailable: boolean;
  isSelected: boolean;
  isBooked: boolean;
}

export interface BookMySqftPlotInfo {
  id: string;
  name: string;
  location: string;
  totalUnits: number;
  unitsWide: number;
  unitsTall: number;
  sqftPricePerUnit: number;
  emiOptions: string[];
  initialGrid: SqftUnit[][]; 
}
export interface SqftUnit {
  id: string; 
  row: number;
  col: number;
  isAvailable: boolean;
  isSelected: boolean;
  isBooked: boolean;
}    
export interface Material {
  id:string;
  name: string;
  category: string;
  price: number;
  moq: number; 
  shippingTime: string;
  vendor: string;
  imageUrl:string;
  description: string;
}