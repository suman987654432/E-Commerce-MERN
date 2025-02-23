import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import BASE_URL from "../config";
import { toast } from "react-toastify";
import { clearCart } from "../redux/cartSlice";
import OrderModal from "../components/OrderModal";
import "../css/checkout.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.mycart.cart);

  // Use items from location state if it's a "Buy Now" purchase, otherwise use cart items
  const items = location.state?.isBuyNow ? location.state.items : cartItems;
  const totalAmount = items.reduce((total, item) => total + (item.price * item.qnty), 0);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [showOrderModal, setShowOrderModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowOrderModal(true);
  };

  const handleOrderComplete = async (success) => {
    if (success) {
      try {
        // Only clear cart and navigate on success
        if (!location.state?.isBuyNow) {
          dispatch(clearCart());
        }
        toast.success("Order placed successfully!");
        navigate("/order-success");
      } catch (error) {
        console.error("Order completion error:", error);
        toast.error("Error completing your order. Please try again.");
      }
    }
    setShowOrderModal(false);
  };

  return (
    <Container className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      <Row>
        <Col md={8}>
          <Form onSubmit={handleSubmit} className="checkout-form">
            <h4>Shipping Information</h4>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col md={4}>
          <div className="order-summary">
            <h4>Order Summary</h4>
            {items.map((item) => (
              <div key={item.id} className="order-item">
                <img src={`${BASE_URL}/${item.defaultImage}`} alt={item.name} />
                <div className="item-details">
                  <h6>{item.name}</h6>
                  <p>Quantity: {item.qnty}</p>
                  <p>₹{item.price * item.qnty}</p>
                </div>
              </div>
            ))}
            <hr />
            <div className="total-amount">
              <h5>Total Amount:</h5>
              <h5>₹{totalAmount}</h5>
            </div>
            <Button type="submit" className="place-order-btn" onClick={handleSubmit}>
              Place Order
            </Button>
          </div>
        </Col>
      </Row>

      <OrderModal
        show={showOrderModal}
        onHide={() => setShowOrderModal(false)}
        onOrderComplete={handleOrderComplete}
        amount={totalAmount}
        formData={{
          ...formData,
          items: items,
          amount: totalAmount
        }}
      />
    </Container>
  );
};

export default CheckoutPage; 