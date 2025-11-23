import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../config';
import { toast } from 'react-toastify';

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load cached orders first to prevent empty state on refresh
        const cachedOrders = localStorage.getItem('userOrders');
        if (cachedOrders) {
            try {
                const parsedOrders = JSON.parse(cachedOrders);
                if (Array.isArray(parsedOrders) && parsedOrders.length > 0) {
                    setOrders(parsedOrders);
                    console.log('Loaded cached orders:', parsedOrders);
                }
            } catch (error) {
                console.error('Error parsing cached orders:', error);
            }
        }
        
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            
            // Get token and user data from localStorage
            const token = localStorage.getItem('token');
            const userDataString = localStorage.getItem('user');
            console.log('Raw user data from localStorage:', userDataString);
            
            if (!userDataString) {
                console.log('No user data found in localStorage');
                toast.error('Please login to view profile');
                setLoading(false);
                return;
            }

            const userData = JSON.parse(userDataString);
            console.log('Parsed user data:', userData);
            
            // Extract actual user ID from login data
            const userId = userData?.id || userData?._id || userData?.userId;
            console.log('Using userId for API call:', userId);
            console.log('BASE_URL:', BASE_URL);
            console.log('Token:', token ? 'Present' : 'Missing');
            
            // Set profile data first
            setUserProfile({
                name: userData.name || 'User',
                email: userData.email || 'Not provided',
                phone: userData.phone || 'Not provided',
                address: userData.address || 'Not provided'
            });

            if (userId && token) {
                try {
                    console.log('Fetching all orders and filtering by user...');
                    const response = await axios.get(`${BASE_URL}/order`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    console.log('All orders response:', response.data);
                    
                    // Handle different response structures
                    const allOrdersData = response.data.orders || 
                                        response.data.data || 
                                        response.data || 
                                        [];
                    
                    console.log('All orders data:', allOrdersData);
                    console.log('Current userId to filter by:', userId);
                    
                    if (Array.isArray(allOrdersData)) {
                        // Try multiple filtering approaches
                        const userOrders = allOrdersData.filter(order => {
                            const matches = 
                                order.userId === userId || 
                                order.user === userId ||
                                order.userId?._id === userId ||
                                order.user?._id === userId ||
                                order.userId?.toString() === userId ||
                                order.user?.toString() === userId;
                            
                            console.log('Order check:', {
                                orderId: order._id,
                                orderUserId: order.userId,
                                orderUser: order.user,
                                currentUserId: userId,
                                matches: matches
                            });
                            
                            return matches;
                        });
                        
                        console.log('Filtered user orders:', userOrders);
                        
                        // Only update orders if we got a valid response
                        if (userOrders.length > 0 || allOrdersData.length === 0) {
                            setOrders(userOrders);
                            // Cache orders to localStorage
                            localStorage.setItem('userOrders', JSON.stringify(userOrders));
                        } else {
                            // Keep existing orders if filter returned empty but there are orders in DB
                            console.log('Filter returned empty but orders exist, keeping cached orders');
                            const cachedOrders = localStorage.getItem('userOrders');
                            if (cachedOrders) {
                                const parsedOrders = JSON.parse(cachedOrders);
                                if (Array.isArray(parsedOrders)) {
                                    setOrders(parsedOrders);
                                }
                            }
                        }
                        
                        if (userOrders.length === 0 && allOrdersData.length > 0) {
                            console.log('No orders found for current user');
                            console.log('Available order user IDs:', allOrdersData.map(o => ({
                                orderId: o._id,
                                userId: o.userId || o.user,
                                fullName: o.fullName
                            })));
                        }
                    } else {
                        console.log('Orders data is not an array:', typeof allOrdersData);
                        // Don't clear existing orders, just log the issue
                        console.log('Keeping existing orders due to invalid response');
                    }
                    
                } catch (error) {
                    console.error('Error fetching orders:', error);
                    console.log('Error details:', {
                        status: error.response?.status,
                        data: error.response?.data,
                        message: error.message
                    });
                    
                    // Don't clear existing orders on error
                    console.log('API error, keeping cached orders');
                    
                    if (error.response?.status === 401) {
                        toast.error('Your session has expired. Please login again.');
                        // Clear orders only on auth error
                        setOrders([]);
                        localStorage.removeItem('userOrders');
                    } else if (error.response?.status === 403) {
                        toast.error('Access denied. Please check your permissions.');
                    } else {
                        toast.error('Unable to fetch latest orders. Showing cached data.');
                    }
                }
            } else {
                console.log('Missing userId or token');
                toast.error('Please login to view your orders');
                setOrders([]);
                localStorage.removeItem('userOrders');
            }
            
        } catch (error) {
            console.error('Profile fetch error:', error);
            console.log('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                baseURL: BASE_URL
            });
            
            toast.error('Error loading profile data');
            // Keep existing orders on profile fetch error
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            'Pending': 'warning',
            'Processing': 'info',
            'Shipped': 'primary',
            'Delivered': 'success',
            'Cancelled': 'danger'
        };
        return <Badge bg={statusColors[status] || 'secondary'}>{status}</Badge>;
    };

    const getPaymentStatusBadge = (status) => {
        const statusColors = {
            'Pending': 'warning',
            'Paid': 'success',
            'Failed': 'danger'
        };
        return <Badge bg={statusColors[status] || 'secondary'}>{status}</Badge>;
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
                <p>Loading profile...</p>
            </Container>
        );
    }

    if (!userProfile) {
        return (
            <Container className="text-center mt-5">
                <p>Please login to view your profile</p>
                <p className="text-muted">Debug: Check browser console for details</p>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Row>
                {/* User Profile Section */}
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5>Profile Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <strong>Name:</strong>
                                <p>{userProfile.name}</p>
                            </div>
                            <div className="mb-3">
                                <strong>Email:</strong>
                                <p>{userProfile.email}</p>
                            </div>
                            <div className="mb-3">
                                <strong>Phone:</strong>
                                <p>{userProfile.phone || 'Not provided'}</p>
                            </div>
                            <div className="mb-3">
                                <strong>Address:</strong>
                                <p>{userProfile.address || 'Not provided'}</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Orders Section */}
                <Col md={8}>
                    <Card>
                        <Card.Header>
                            <h5>Your Orders ({orders.length})</h5>
                        </Card.Header>
                        <Card.Body>
                            {orders.length === 0 ? (
                                <div className="text-center">
                                    <p>No orders found for your account</p>
                                    <p className="text-muted small">
                                        Debug Info: Check browser console for details
                                    </p>
                                    <p className="text-muted small">
                                        Your User ID: {JSON.parse(localStorage.getItem('user') || '{}')?.id || 
                                                     JSON.parse(localStorage.getItem('user') || '{}')?.userId ||
                                                     JSON.parse(localStorage.getItem('user') || '{}')?._id || 'Not found'}
                                    </p>
                                    <p className="text-muted small">
                                        If you recently placed orders, they might be linked to a different user ID.
                                    </p>
                                </div>
                            ) : (
                                <Table responsive striped>
                                    <thead>
                                        <tr>
                                            <th>Order Date</th>
                                            <th>Items</th>
                                            <th>Amount</th>
                                            <th>Payment Method</th>
                                            <th>Status</th>
                                            <th>Payment Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order._id}>
                                                <td>
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                                </td>
                                                <td>
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="small">
                                                            {item.name} (x{item.qnty})
                                                        </div>
                                                    ))}
                                                </td>
                                                <td>₹{order.amount}</td>
                                                <td>
                                                    <Badge bg="secondary">
                                                        {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                                                    </Badge>
                                                </td>
                                                <td>{getStatusBadge(order.status)}</td>
                                                <td>{getPaymentStatusBadge(order.paymentStatus)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfile;
