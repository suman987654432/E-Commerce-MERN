import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import "../css/TopMenu.css";
import { Navbar, Nav, Container, Form, FormControl, InputGroup, Dropdown } from "react-bootstrap";
import logo from "../images/logo.png";
import wish from "../images/image.png";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { clearCart } from "../redux/cartSlice";
import { clearWishlist } from "../redux/wishlistSlice";

const TopMenu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ProductData = useSelector((state) => state.mycart.cart);
  const proLength = ProductData.length;
  const WishData = useSelector((state) => state.mywishlist.items || []);
  const wishLength = WishData.length;

  const handleLogout = (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    
    // Clear any stored tokens/data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear cart and wishlist
    dispatch(clearCart());
    dispatch(clearWishlist());
    
    // Show success message
    toast.success('Logged out successfully');
    // Redirect to home
    navigate('/');
  };

  return (
    <Navbar bg="light" expand="lg" className="top-menu sm py-2 fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={logo} alt="Shopcart Logo" height="50" className="me-2" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto gap-3">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/product">Product</Nav.Link>
            <Nav.Link as={Link} to="/blog">Blog</Nav.Link>
          </Nav>
          <Form className="d-flex align-items-center me-4">
            <InputGroup>
              <FormControl type="search" placeholder="Search Product" className="border-end-0" />
              <InputGroup.Text className="bg-white border-start cursor-pointer">
                <FaSearch className="text-muted" />
              </InputGroup.Text>
            </InputGroup>
          </Form>
          <Nav className="d-flex gap-3">
            {/* DROPDOWN */}
            <Dropdown show={showDropdown} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
              <Nav.Link className="d-flex align-items-center" onClick={() => setShowDropdown(!showDropdown)}>
                <FaUser size={20} className="cursor-pointer mt-1" />
              </Nav.Link>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/userlogin">Login</Dropdown.Item>
                <Dropdown.Item as={Link} to="/usersignup">SignUp</Dropdown.Item>
                <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Nav.Link as={Link} to="/cart" className="d-flex align-items-center position-relative">
              <FaShoppingCart size={20} />
              <span
                className="position-absolute  start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "12px", padding: "4px 4px", minWidth: "19px" }}
              >
                {proLength}
              </span>
            </Nav.Link>
            <Nav.Link as={Link} to="/wish" className="d-flex align-items-center position-relative">
              <img src={wish} alt="Wishlist" width="30" height="30" />

              <span
                className="position-absolute start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "12px", padding: "4px 4px", minWidth: "19px" }}
              >
                {wishLength}
              </span>

            </Nav.Link>
            <Nav.Link onClick={handleLogout} className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
              <FaSignOutAlt size={20} className="text-danger" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopMenu;
