
export enum PlotType {
  PUBLIC = 'Public Listing',
  VERIFIED = 'Greenheap Verified',
}

export interface Plot {
  id: string;
  title: string;
  location: string;
  price: number;
  area: number; // in sqft
  imageUrl: string;
  type: PlotType;
  description: string;
  amenities?: string[];
  isFlagship?: boolean;
  documents?: string[]; 
  sqftPrice?: number; // For plots that can be booked by sqft
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
    