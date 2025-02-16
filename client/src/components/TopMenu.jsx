import { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";
import "../css/TopMenu.css";
import { Navbar, Nav, Container, Form, FormControl, InputGroup, Dropdown } from "react-bootstrap";
import logo from "../images/logo.png";
import wish from "../images/image.png";
import { useSelector } from "react-redux";
const TopMenu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const ProductData = useSelector(state => state.mycart.cart)
  const proLength = ProductData.length

  return (
    <Navbar bg="light" expand="lg" className="top-menu sm py-2 fixed=top">
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
                <FaSearch className="text-muted " />
              </InputGroup.Text>
            </InputGroup>
          </Form>

          <Nav className="d-flex gap-3">
            {/* DROPDOWN */}
            <Dropdown show={showDropdown} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
              <Nav.Link className="d-flex align-items-center " onClick={() => setShowDropdown(!showDropdown)}>
                <FaUser size={20} className="cursor-pointer mt-1 " />
              </Nav.Link>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/userlogin">Login</Dropdown.Item>
                <Dropdown.Item as={Link} to="/usersignup">SignUp</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Nav.Link as={Link} to="/cart" className="d-flex align-items-center">
              <FaShoppingCart size={20} />
              <sup className="myitem">{proLength}</sup>
            </Nav.Link>

            <Nav.Link as={Link} to="/wish" className="d-flex align-items-center">
              <img src={wish} alt="Wishlist" width="30" height="30" />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopMenu;
