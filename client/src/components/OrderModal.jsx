import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import BASE_URL from '../config';
import { isAuthenticated } from '../utils/authCheck';

const OrderModal = ({ show, onHide, onOrderComplete, amount, formData }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOrder = async () => {
        try {
            // Check if user is logged in
            if (!isAuthenticated()) {
                toast.error('Please login to place order');
                onHide();
                navigate('/userlogin');
                return;
            }

            setLoading(true);
            if (!formData || !formData.items) {
                throw new Error('Invalid order data');
            }

            const orderData = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                items: formData.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    qnty: item.qnty
                })),
                amount: amount,
                paymentMethod: 'cod',
                status: 'pending'
            };

            const response = await axios.post(`${BASE_URL}/order/create`, orderData);
            
            if (response.data.success) {
                toast.success('Order placed successfully!');
                onOrderComplete(true);
            } else {
                throw new Error('Failed to create order');
            }
        } catch (error) {
            console.error('Order error:', error);
            toast.error('Failed to place order');
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
                <div className="order-details mb-4">
                    <h4>Total Amount: ₹{amount}</h4>
                    <p>Payment Method: Cash on Delivery</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleOrder}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Place Order'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderModal; 