export const getApiUrl = () => {
    if (window.RUNTIME_CONFIG?.API_URL) return window.RUNTIME_CONFIG.API_URL;
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    if (window.location.hostname === 'localhost') return 'http://localhost:4000';
    return `http://${window.location.hostname}:4000`;
};

export const API_URL = getApiUrl();
