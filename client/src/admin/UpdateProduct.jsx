import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from '../config';
import { Table, Button, Container, Row, Col, InputGroup, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

const UpdateProduct = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

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
                                    >
                                        Primary
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="success" 
                                        size="sm" 
                                        onClick={() => handleNormal(product._id)}
                                    >
                                        Normal
                                    </Button>
                                )}
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
        </Container>
    );
};

export default UpdateProduct;