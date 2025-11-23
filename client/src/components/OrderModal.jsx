/* eslint-disable react/prop-types */
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import BASE_URL from '../config';
import { isAuthenticated } from '../utils/authCheck';

const OrderModal = ({ show, onHide, onOrderComplete, amount, formData, paymentMethod }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleOrderSubmit = async () => {
        try {
            // Check if user is logged in
            if (!isAuthenticated()) {
                toast.error('Please login to place order');
                onHide();
                navigate('/userlogin');
                return;
            }

            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('Please login to place order');
            }

            console.log('OrderModal - Creating order with data:', formData);

            const orderData = {
                userId: formData.userId,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                items: formData.items,
                amount: formData.amount,
                paymentMethod: paymentMethod,
                status: 'Pending',
                paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Pending'
            };

            console.log('OrderModal - Sending order data:', orderData);

            // Try multiple endpoints
            const endpoints = [
                `${BASE_URL}/order/create`,
                `${BASE_URL}/order`,
                `${BASE_URL}/orders/create`,
                `${BASE_URL}/api/order/create`
            ];

            let orderCreated = false;

            for (const endpoint of endpoints) {
                try {
                    console.log(`OrderModal - Trying endpoint: ${endpoint}`);
                    
                    const response = await axios.post(endpoint, orderData, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    console.log(`OrderModal - Response from ${endpoint}:`, response.data);

                    if (response.data.success || response.status === 200 || response.status === 201) {
                        toast.success('Order placed successfully!');
                        
                        // Clear cached orders so fresh data is fetched
                        localStorage.removeItem('userOrders');
                        localStorage.removeItem('adminOrders');
                        
                        onOrderComplete(true);
                        orderCreated = true;
                        break;
                    }
                } catch (endpointError) {
                    console.error(`OrderModal - Error with ${endpoint}:`, endpointError);
                    
                    if (endpointError.response?.status === 404) {
                        console.log(`Endpoint ${endpoint} not found, trying next...`);
                        continue;
                    }
                }
            }

            if (!orderCreated) {
                throw new Error('All order endpoints failed');
            }

        } catch (error) {
            console.error('OrderModal - Error placing order:', error);
            console.error('OrderModal - Error details:', error.response?.data);
            
            const errorMessage = error.response?.data?.message || error.message || 'Failed to place order';
            setError(errorMessage);
            toast.error(errorMessage);
            onOrderComplete(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                
                <div className="mb-3">
                    <h6>Order Summary</h6>
                    <p><strong>Total Amount:</strong> ₹{amount}</p>
                    <p><strong>Payment Method:</strong> {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                    <p><strong>Items:</strong> {formData.items?.length || 0} item(s)</p>
                </div>

                <div className="mb-3">
                    <h6>Shipping Details</h6>
                    <p><strong>Name:</strong> {formData.fullName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Address:</strong> {formData.address}</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleOrderSubmit} disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Placing Order...
                        </>
                    ) : (
                        'Confirm Order'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

OrderModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onOrderComplete: PropTypes.func.isRequired,
    amount: PropTypes.number.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    formData: PropTypes.shape({
        fullName: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
        pincode: PropTypes.string.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            qnty: PropTypes.number.isRequired
        })).isRequired
    }).isRequired
};

export default OrderModal;