import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "../css/Signup.css";
import BASE_URL from "../config";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/auth/signup`, {
                name: formData.fullName,
                email: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                toast.success('Registration successful! Please login.');
                navigate('/userlogin');
            }
        } catch (error) {
            console.error('Signup error:', error);
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2 className="signup-title">Sign Up</h2>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="fullName" 
                        placeholder="Full Name" 
                        className="signup-input"
                        value={formData.fullName}
                        onChange={handleChange}
                        required 
                    />
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
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Confirm Password" 
                        className="signup-input"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required 
                    />
                    <button type="submit" className="signup-button">Sign Up</button>
                </form>
                <p className="signup-text">
                    Already have an account? <Link to="/userlogin" className="signup-link">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
