import { useState, useEffect } from 'react';
import { Table, Container, Form, Spinner, Alert, Row, Col, InputGroup, Pagination, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../config';
import { toast } from 'react-hot-toast';
import { FaSearch } from 'react-icons/fa';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);
    const token = localStorage.getItem('token');

    // Fetch orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            console.log('Fetching orders with token:', token);
            console.log('BASE_URL:', BASE_URL);
            
            // Load cached orders first
            const cachedOrders = localStorage.getItem('adminOrders');
            if (cachedOrders) {
                try {
                    const parsedOrders = JSON.parse(cachedOrders);
                    if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
                        setOrders(parsedOrders);
                        console.log('Loaded cached admin orders:', parsedOrders);
                    }
                } catch (cacheError) {
                    console.error('Error parsing cached orders:', cacheError);
                }
            }
            
            // Try to fetch fresh data
            try {
                console.log('Trying admin endpoint: /order');
                
                const response = await axios.get(`${BASE_URL}/order`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                console.log('Response from /order:', response.data);
                
                // Handle different response structures
                const ordersData = response.data.orders || 
                                 response.data.data || 
                                 response.data || 
                                 [];
                
                if (Array.isArray(ordersData)) {
                    setOrders(ordersData);
                    // Cache orders
                    localStorage.setItem('adminOrders', JSON.stringify(ordersData));
                    console.log('Orders loaded and cached successfully:', ordersData);
                } else {
                    console.log('Invalid orders data structure:', typeof ordersData);
                    // Keep cached orders if response is invalid
                }
                
            } catch (fetchError) {
                console.error('Error fetching fresh orders:', fetchError);
                
                if (fetchError.response?.status === 401) {
                    setError('Session expired. Please login again.');
                    setOrders([]);
                    localStorage.removeItem('adminOrders');
                } else {
                    setError('Unable to fetch latest orders. Showing cached data.');
                    // Keep cached orders on other errors
                }
            }
            
        } catch (err) {
            console.error('Error in fetchOrders:', err);
            setError('Failed to fetch orders');
            toast.error('Error loading orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Update order status
    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await axios.put(`${BASE_URL}/order/${orderId}/status`,
                { status: newStatus },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            toast.success('Order status updated');
            fetchOrders(); // Refresh orders
        } catch (err) {
            console.error('Error updating status:', err);
            toast.error('Failed to update order status');
        }
    };

    // Update payment status
    const handlePaymentStatusUpdate = async (orderId, newStatus) => {
        try {
            await axios.put(`${BASE_URL}/order/${orderId}/payment-status`,
                { status: newStatus },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            toast.success('Payment status updated');
            fetchOrders(); // Refresh orders
        } catch (err) {
            console.error('Error updating payment status:', err);
            toast.error('Failed to update payment status');
        }
    };

    // Enhanced filter function to search across more fields
    const filteredOrders = orders.filter(order => {
        const searchStr = searchTerm.toLowerCase();
        return (
            order.userName?.toLowerCase().includes(searchStr) ||
            order.email?.toLowerCase().includes(searchStr) ||
            order.status?.toLowerCase().includes(searchStr) ||
            order.items?.some(item =>
                item.name?.toLowerCase().includes(searchStr)
            )
        );
    });

    // Pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    if (loading) {
        return <Container className="text-center mt-5"><Spinner animation="border" /></Container>;
    }

    if (error) {
        return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
    }

    return (
        <Container fluid className="py-3">
            <Row className="mb-4">
                <Col>
                    <h2>Orders Management</h2>
                </Col>
                <Col md={4}>
                    <InputGroup>
                        <InputGroup.Text><FaSearch /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search by name, email, phone, status, or products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
            </Row>

            <Table responsive striped bordered hover>
                <thead className="bg-dark text-white">
                    <tr>
                        <th>User Name</th>
                        <th>Email</th>

                        <th>Products</th>
                        <th>Total Price</th>
                        <th>Order Status</th>
                        <th>Payment Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map((order) => (
                        <tr key={order._id}>
                            <td>{order.fullName || order.userName || order.name || 'Not found'}</td>
                            <td>{order.email || 'Not found'}</td>
                            <td>
                                {(order.items || []).map((item, idx) => (
                                    <div key={idx} className="mb-1">
                                        <span>{item.name} (Qty: {item.qnty || item.quantity || 1})</span>
                                    </div>
                                ))}
                            </td>
                            <td>₹{order.amount || order.total || 0}</td>
                            <td>
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant={
                                            order.status === 'Delivered' ? 'success' :
                                                order.status === 'Processing' ? 'info' :
                                                    order.status === 'Cancelled' ? 'danger' :
                                                        order.status === 'Shipped' ? 'primary' :
                                                            'warning'
                                        }
                                        size="sm"
                                    >
                                        {order.status}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                                            <Dropdown.Item
                                                key={status}
                                                onClick={() => handleStatusUpdate(order._id, status)}
                                                active={order.status === status}
                                            >
                                                {status}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                            <td>
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant={
                                            order.paymentStatus === 'Paid' ? 'success' :
                                                order.paymentStatus === 'Failed' ? 'danger' :
                                                    'warning'
                                        }
                                        size="sm"
                                    >
                                        {order.paymentStatus}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {['Pending', 'Paid', 'Failed'].map(status => (
                                            <Dropdown.Item
                                                key={status}
                                                onClick={() => handlePaymentStatusUpdate(order._id, status)}
                                                active={order.paymentStatus === status}
                                            >
                                                {status}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                            <td>
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </td>
                            <td>
                                <Dropdown>
                                    <Dropdown.Toggle variant="secondary" size="sm">
                                        Actions
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item>View Details</Dropdown.Item>
                                        <Dropdown.Item>Print Invoice</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination */}
            <div className="d-flex justify-content-center mt-4">
                <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1} />

                    {[...Array(totalPages)].map((_, idx) => (
                        <Pagination.Item
                            key={idx + 1}
                            active={currentPage === idx + 1}
                            onClick={() => setCurrentPage(idx + 1)}
                        >
                            {idx + 1}
                        </Pagination.Item>
                    ))}

                    <Pagination.Next onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            </div>
        </Container>
    );
};

export default OrdersPage;
