import { toast } from 'react-toastify';

export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

export const getUserRole = () => {
    return localStorage.getItem('userRole');
};

export const requireAuth = (navigate) => {
    if (!isAuthenticated()) {
        toast.error('Please login to continue');
        navigate('/userlogin');
        return false;
    }
    return true;
}; 