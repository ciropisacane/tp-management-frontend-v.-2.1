import axios from 'axios';

// Create Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        // Check localStorage (or wherever you store the token)
        // Note: We'll likely move to HttpOnly cookies for security, 
        // but for now, if using localStorage:
        const token = localStorage.getItem('token');

        // Or if relying solely on Cookies (credentials: true), we don't need to manually attach Bearer usually
        // unless the backend expects it specifically alongside cookies or for CSRF.
        // The current backend middleware checks 'Authorization: Bearer ...' header.
        // So if using cookies, the browser sends them automatically, but the middleware as written expects Header.
        // We should clarify if we want Cookie-based or Header-based.
        // Current Backend Middleare: const token = authHeader.split(' ')[1];
        // So we MUST send Header.

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401/RefreshToken
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh token
                // const { data } = await api.post('/auth/refresh');
                // localStorage.setItem('token', data.data.accessToken);
                // originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                // return api(originalRequest);

                // For now, redirect to login if refresh logic isn't fully client-side ready
                // window.location.href = '/login';
            } catch (refreshError) {
                // Clear auth and redirect
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
