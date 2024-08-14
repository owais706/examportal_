import axiosInstance from './axiosInstance';

// Login service
export const login = async (username, password) => {
    try {
        const response = await axiosInstance.post('/auth/login', { username, password });
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

// Fetch user data
export const fetchUserData = async () => {
    try {
        const response = await axiosInstance.get('/user/data'); // Adjust endpoint as needed
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
};
