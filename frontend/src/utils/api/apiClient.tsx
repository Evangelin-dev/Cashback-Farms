import axios, { AxiosResponse, AxiosError } from 'axios';

export interface ResponseInterface {
    data: any;
    message: string;
}


const logout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response: AxiosResponse): any => response.data,
    (error: AxiosError): Promise<AxiosError> => {
        if (error.response?.status === 401) {
            // Logout the user and clear credentials
            logout();
            
            // Redirect to login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;