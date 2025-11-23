import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from '../config';
import { Table, Button, Container, Row, Col, InputGroup, Form, Modal } from 'react-bootstrap';
import { FaSearch, FaEdit } from 'react-icons/fa';

const UpdateProduct = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        brand: '',
        price: '',
        description: '',
        category: '',
        subcategory: ''
    });
    const [editImage, setEditImage] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState('');

    const loadData = async () => {
        const api = `${BASE_URL}/admin/productdisplay`;
        try {
            setLoading(true);
            const response = await axios.get(api);
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrimary = async (e, id) => {
        e.preventDefault();
        const api = `${BASE_URL}/admin/productmakeprimary`;
        try {
            const response = await axios.post(api, { id: id });
            console.log(response.data);
            loadData();
        } catch (error) {
            console.log(error);
        }
    };

    const handleNormal = async (id) => {
        const api = `${BASE_URL}/admin/productmakenormal`;
        try {
            const response = await axios.post(api, { id: id });
            console.log(response.data);
            loadData();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const api = `${BASE_URL}/admin/productdelete/${id}`;
            console.log('Delete API URL:', api);
            console.log('Product ID:', id);
            console.log('BASE_URL:', BASE_URL);
            try {
                const response = await axios.delete(api);
                console.log('Delete response:', response.data);
                loadData();
                alert('Product deleted successfully');
            } catch (error) {
                console.error('Delete error details:', error.response?.data || error.message);
                console.error('Error status:', error.response?.status);
                console.error('Request URL:', error.config?.url);
                alert(`Failed to delete product: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setEditFormData({
            name: product.name,
            brand: product.brand,
            price: product.price,
            description: product.description,
            category: product.category,
            subcategory: product.subcategory
        });
        setEditImagePreview(`${BASE_URL}/${product.defaultImage}`);
        setEditImage(null);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const api = `${BASE_URL}/admin/productupdate/${editingProduct._id}`;
        
        const formData = new FormData();
        formData.append('name', editFormData.name);
        formData.append('brand', editFormData.brand);
        formData.append('price', editFormData.price);
        formData.append('description', editFormData.description);
        formData.append('category', editFormData.category);
        formData.append('subcategory', editFormData.subcategory);
        
        if (editImage) {
            formData.append('image', editImage);
        }

        try {
            await axios.put(api, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShowEditModal(false);
            loadData();
            alert('Product updated successfully');
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update product');
        }
    };

    const handleEditInputChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImage(file);
            const reader = new FileReader();
            reader.onload = () => {
                setEditImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Filter products based on search term
    const filteredProducts = products.filter(product => {
        const searchStr = searchTerm.toLowerCase();
        return (
            product.name?.toLowerCase().includes(searchStr) ||
            product.brand?.toLowerCase().includes(searchStr) ||
            product.category?.toLowerCase().includes(searchStr) ||
            product.subcategory?.toLowerCase().includes(searchStr) ||
            product.description?.toLowerCase().includes(searchStr) ||
            product.price?.toString().includes(searchStr)
        );
    });

    return (
        <Container fluid className="py-3">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h4>Update Product</h4>
                </Col>
                <Col md={4}>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search by name, brand, category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
            </Row>

            <Table responsive striped bordered hover style={{ fontSize: "12px" }}>
                <thead className="bg-dark text-white">
                    <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Brand</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Sub Cat</th>
                        <th>Status</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product._id}>
                            <td>
                                <img 
                                    src={`${BASE_URL}/${product.defaultImage}`} 
                                    style={{ width: 50, height: 50, objectFit: 'cover' }} 
                                    alt={product.name} 
                                />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.brand}</td>
                            <td>₹{product.price}</td>
                            <td>{product.description}</td>
                            <td>{product.category}</td>
                            <td>{product.subcategory}</td>
                            <td>{product.status}</td>
                            <td>{product.ratings}</td>
                            <td>
                                {product.status === "normal" ? (
                                    <Button 
                                        variant="warning" 
                                        size="sm" 
                                        onClick={(e) => handlePrimary(e, product._id)}
                                        className="me-1"
                                    >
                                        Primary
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="success" 
                                        size="sm" 
                                        onClick={() => handleNormal(product._id)}
                                        className="me-1"
                                    >
                                        Normal
                                    </Button>
                                )}
                                <Button
                                    variant="info"
                                    size="sm"
                                    onClick={() => handleEdit(product)}
                                    className="me-1"
                                >
                                    <FaEdit /> Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(product._id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {filteredProducts.length === 0 && (
                <div className="text-center mt-4">
                    {searchTerm ? "No products found matching your search" : "No products found"}
                </div>
            )}

            {/* Edit Product Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Brand</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="brand"
                                        value={editFormData.brand}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={editFormData.price}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="category"
                                        value={editFormData.category}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sub Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="subcategory"
                                        value={editFormData.subcategory}
                                        onChange={handleEditInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={editFormData.description}
                                onChange={handleEditInputChange}
                                required
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Product Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleEditImageChange}
                            />
                            {editImagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={editImagePreview}
                                        alt="Preview"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        className="border rounded"
                                    />
                                    <small className="text-muted d-block">Current/Preview Image</small>
                                </div>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEditSubmit}>
                        Update Product
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UpdateProduct;