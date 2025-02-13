import { Link } from "react-router-dom";
import "../css/Signup.css";

const Signup = () => {
    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2 className="signup-title">Sign Up</h2>
                <form className="signup-form">
                    <input type="text" name="fullName" placeholder="Full Name" className="signup-input" />
                    <input type="email" name="email" placeholder="Email" className="signup-input" />
                    <input type="password" name="password" placeholder="Password" className="signup-input" />
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" className="signup-input" />
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
