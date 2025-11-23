import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "../css/Signup.css";
import BASE_URL from "../config";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, formData);

            if (response.data.success) {
                const { token, user } = response.data;
                
                // Store token and user data
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('userRole', user.role); // Store role separately

                toast.success('Login successful!');
                
                // Redirect based on role
                if (user.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2 className="signup-title">Log In</h2>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        className="signup-input"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        className="signup-input"
                        value={formData.password}
                        onChange={handleChange}
                        required 
                    />
                    <button type="submit" className="signup-button">Login</button>
                </form>
                <p className="signup-text">
                    Dont have an account? <Link to="/usersignup" className="signup-link">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
