import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import BASE_URL from "../config";
import { toast } from "react-toastify";
import { clearCart } from "../redux/cartSlice";
import OrderModal from "../components/OrderModal";
import "../css/checkout.css";
import axios from "axios";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.mycart.cart);

  // Use items from location state if it's a "Buy Now" purchase, otherwise use cart items
  const items = location.state?.isBuyNow ? location.state.items : cartItems;
  const totalAmount = items.reduce((total, item) => total + (item.price * (item.qnty || 1)), 0);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
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
    
    // Validate form data
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Debug: Log the order data before sending
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData?.id || userData?._id || userData?.userId;
    const token = localStorage.getItem('token');
    
    console.log('User data:', userData);
    console.log('User ID:', userId);
    console.log('Token:', token);
    console.log('Form data:', formData);
    console.log('Items:', items);
    console.log('BASE_URL:', BASE_URL);

    if (!userId || !token) {
      toast.error('Please login to place order');
      return;
    }

    // Use only the working endpoint
    try {
      const orderData = {
        userId: userId,
        user: userId, // Add both fields to ensure compatibility
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        items: items.map(item => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          qnty: item.qnty || 1,
          quantity: item.qnty || 1,
          image: item.defaultImage || item.images?.[0] || ''
        })),
        amount: totalAmount,
        total: totalAmount,
        paymentMethod: paymentMethod,
        status: 'Pending',
        paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Pending'
      };

      console.log('Sending order data to /order/create:', orderData);

      const response = await axios.post(`${BASE_URL}/order/create`, orderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Order creation response:', response.data);

      if (response.data.success || response.status === 200 || response.status === 201) {
        toast.success('Order placed successfully!');
        
        // Clear cached orders so fresh data is fetched
        localStorage.removeItem('userOrders');
        localStorage.removeItem('adminOrders');
        
        // Clear cart if not buy now
        if (!location.state?.isBuyNow) {
          dispatch(clearCart());
        }
        
        navigate('/order-success', { 
          state: { 
            orderId: response.data.orderId || response.data.order?._id || response.data._id,
            amount: totalAmount 
          } 
        });
      } else {
        throw new Error(response.data.message || 'Failed to place order');
      }

    } catch (error) {
      console.error('Order creation error:', error);
      console.error('Error response:', error.response?.data);
      
      // Show modal as fallback
      toast.error('Direct order failed, please try through the confirmation modal');
      setShowOrderModal(true);
    }
  };

  const handleOrderComplete = async (success) => {
    if (success) {
      try {
        // Only clear cart and navigate on success
        if (!location.state?.isBuyNow) {
          dispatch(clearCart());
        }
        // Remove duplicate toast - it's already shown in OrderModal
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
          {/* Product Summary Section - Add this section */}
          <div className="product-summary mb-4">
            <h4>Order Summary</h4>
            <div className="product-list">
              {items.map((item, index) => (
                <div key={index} className="product-item">
                  <div className="product-details">
                    <div className="product-image">
                      <img 
                        // eslint-disable-next-line no-constant-binary-expression
                        src={`${BASE_URL}/${item.defaultImage || item.images?.[0]}` || "https://via.placeholder.com/50"} 
                        alt={item.name} 
                      />
                    </div>
                    <div className="product-info">
                      <h5>{item.name}</h5>
                      <p>Quantity: {item.qnty || 1}</p>
                      <p>Price: ₹{item.price}</p>
                      <p>Subtotal: ₹{item.price * (item.qnty || 1)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total">
              <h5>Total Amount: ₹{totalAmount}</h5>
            </div>
          </div>
          
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

            <h4 className="mt-4">Payment Method</h4>
            <Form.Group className="mb-3">
              <div className="payment-options">
                <Form.Check
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Cash on Delivery (COD)"
                  className="mb-2"
                />
                <Form.Check
                  type="radio"
                  id="online"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  label="Online Payment"
                />
              </div>
            </Form.Group>
          </Form>
        </Col>
        
        <Col md={4}>
          <div className="order-summary">
            <h4>Payment Summary</h4>
            <div className="summary-item">
              <span>Items ({items.reduce((total, item) => total + (item.qnty || 1), 0)}):</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="summary-item">
             
            </div>
            <div className="summary-item total">
              <span>Total:</span>
              <span>₹{totalAmount}</span>
            </div>
            <Button 
              type="button" 
              variant="primary" 
              className="place-order-btn" 
              onClick={handleSubmit}
            >
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
        paymentMethod={paymentMethod}
        formData={{
          ...formData,
          items: items.map(item => ({
            productId: item._id || item.id,
            name: item.name,
            price: item.price,
            qnty: item.qnty || 1,
            image: item.defaultImage || item.images?.[0] || ''
          })),
          amount: totalAmount,
          userId: JSON.parse(localStorage.getItem('user') || '{}')?.id || 
                  JSON.parse(localStorage.getItem('user') || '{}')?.userId ||
                  JSON.parse(localStorage.getItem('user') || '{}')?._id,
          address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.pincode}`
        }}
      />
    </Container>
  );
};

export default CheckoutPage;