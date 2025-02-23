import { useState, useEffect } from 'react';
import { Table, Button, Container, Spinner, Alert, Row, Col, InputGroup, Form } from 'react-bootstrap';
import axios from 'axios';
import BASE_URL from '../config';
import { toast } from 'react-hot-toast';
import { FaSearch } from 'react-icons/fa';

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/auth/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setUsers(response.data.users);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err.response?.data?.message || 'Failed to fetch users');
            toast.error('Error loading users');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await axios.delete(`${BASE_URL}/auth/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.success) {
                toast.success('User deleted successfully');
                fetchUsers(); // Refresh user list
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            toast.error(err.response?.data?.message || 'Failed to delete user');
        }
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user => {
        const searchStr = searchTerm.toLowerCase();
        return (
            user.name?.toLowerCase().includes(searchStr) ||
            user.email?.toLowerCase().includes(searchStr) ||
            user.role?.toLowerCase().includes(searchStr)
        );
    });

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="py-3">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2>Users Management</h2>
                </Col>
                <Col md={4}>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search by name, email, or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
            </Row>

            <Table responsive striped bordered hover>
                <thead className="bg-dark text-white">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <span className={`badge bg-${user.role === 'admin' ? 'danger' : 'info'}`}>
                                    {user.role}
                                </span>
                            </td>
                            <td>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteUser(user._id)}
                                    disabled={user.role === 'admin'}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {filteredUsers.length === 0 && (
                <Alert variant="info" className="text-center">
                    {searchTerm ? "No users found matching your search" : "No users found"}
                </Alert>
            )}
        </Container>
    );
};

export default UsersPage;
