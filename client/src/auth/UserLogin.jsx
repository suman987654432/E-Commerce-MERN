import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "../css/Signup.css";

const Signup = () => {
    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2 className="signup-title">Log In</h2>
                <form className="signup-form">
                    <input type="email" name="email" placeholder="Email" className="signup-input" />
                    <input type="password" name="password" placeholder="Password" className="signup-input" />

                    <Dropdown className="signup-dropdown">
                        <Dropdown.Toggle variant="light" className="signup-dropdown-toggle mb-2">
                            Select Role
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item as={Link} to="/adminlogin">Admin</Dropdown.Item>
                            <Dropdown.Item as={Link} to="/usersignup">User</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <button type="submit" className="signup-button">Login</button>
                </form>
                <p className="signup-text">
                    Dont have an account? <Link to="/usersignup" className="signup-link">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
