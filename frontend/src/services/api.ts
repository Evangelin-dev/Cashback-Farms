import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  area: number;
  property_category: string;
  listing_type: string;
  residential_type?: string;
  commercial_type?: string;
  location: {
    city: string;
    locality: string;
    landmark?: string;
    pincode: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  parking_spots?: number;
  is_verified: boolean;
  images: Array<{
    id: number;
    image: string;
    is_primary: boolean;
  }>;
}

export interface Booking {
  id: number;
  property: Property;
  booking_date: string;
  status: string;
  amount: number;
  payment_status: boolean;
}

export interface Payment {
  id: number;
  booking: Booking;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: string;
  transaction_id?: string;
}

export const apiService = {
  // Auth
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login/', { username, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout/');
    return response.data;
  },

  // Properties
  getProperties: async (params?: {
    listing_type?: string;
    category?: string;
    city?: string;
    min_price?: number;
    max_price?: number;
  }) => {
    const response = await api.get('/properties/', { params });
    return response.data;
  },

  getProperty: async (id: number) => {
    const response = await api.get(`/properties/${id}/`);
    return response.data;
  },

  // Bookings
  getBookings: async () => {
    const response = await api.get('/bookings/');
    return response.data;
  },

  createBooking: async (propertyId: number, amount: number) => {
    const response = await api.post('/bookings/', {
      property_id: propertyId,
      amount,
    });
    return response.data;
  },

  // Payments
  makePayment: async (bookingId: number, data: {
    amount: number;
    payment_method: string;
    transaction_id?: string;
  }) => {
    const response = await api.post(`/bookings/${bookingId}/make_payment/`, data);
    return response.data;
  },

  getPayments: async () => {
    const response = await api.get('/payments/');
    return response.data;
  },
};

export default apiService; 