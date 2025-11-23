import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Badge } from "react-bootstrap";
import {  FaFilter, FaStar, FaRegHeart, FaHeart } from "react-icons/fa";
import { PiCurrencyInrThin } from "react-icons/pi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addtoCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import BASE_URL from "../config";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.mywishlist.items);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/product/homeproductdisplay`);
      setProducts(response.data);
      setFilteredProducts(response.data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, priceRange, sortBy, products]);

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort products
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
  };

  const handleWishlist = (product) => {
    const isWishlisted = wishlistItems.some(item => item.id === product._id);
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist({
        id: product._id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        description: product.description,
        category: product.category,
        subcategory: product.subcategory,
        defaultImage: product.defaultImage,
        status: product.status,
        qnty: 1
      }));
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addtoCart({
      id: product._id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory,
      defaultImage: product.defaultImage,
   
      status: product.status,
      qnty: 1
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: 0, max: 100000 });
    setSortBy("");
  };

  return (
    <Container fluid className="py-4">
      <Row>
        {/* Filter Sidebar */}
        <Col lg={3} md={4} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0"><FaFilter /> Filters</h5>
              <Button variant="outline-light" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </Card.Header>
            <Card.Body>
              {/* Search */}
              <div className="mb-4">
                <Form.Label><strong>Search Products</strong></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <Form.Label><strong>Category</strong></Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <Form.Label><strong>Price Range</strong></Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})}
                    />
                  </Col>
                </Row>
              </div>

              {/* Sort By */}
              <div className="mb-4">
                <Form.Label><strong>Sort By</strong></Form.Label>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="name">Name A-Z</option>
                </Form.Select>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Products Grid */}
        <Col lg={9} md={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>All Products</h2>
            <Badge bg="secondary">{filteredProducts.length} Products Found</Badge>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Row>
              {filteredProducts.length === 0 ? (
                <Col className="text-center py-5">
                  <h4>No products found</h4>
                  <p>Try adjusting your filters</p>
                </Col>
              ) : (
                filteredProducts.map((product) => {
                  const isWishlisted = wishlistItems.some(item => item.id === product._id);
                  const averageRating = product.averageRating || product.ratings || 0;

                  return (
                    <Col xl={4} lg={6} md={6} sm={6} xs={12} key={product._id} className="mb-4">
                      <Card className="h-100 product-card-hover">
                        <div className="position-relative">
                          <Card.Img
                            variant="top"
                            src={`${BASE_URL}/${product.defaultImage}`}
                            alt={product.name}
                            style={{ height: "250px", objectFit: "cover", cursor: "pointer" }}
                            onClick={() => navigate(`/productdetails/${product._id}`)}
                          />
                          <Button
                            variant={isWishlisted ? "danger" : "outline-danger"}
                            size="sm"
                            className="position-absolute top-0 end-0 m-2"
                            onClick={() => handleWishlist(product)}
                          >
                            {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                          </Button>
                          {product.status === "primary" && (
                            <Badge bg="success" className="position-absolute top-0 start-0 m-2">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <Card.Title 
                            className="text-truncate"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/productdetails/${product._id}`)}
                          >
                            {product.name}
                          </Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            {product.brand}
                          </Card.Subtitle>
                          <Card.Text className="text-truncate flex-grow-1">
                            {product.description}
                          </Card.Text>
                          <div className="mb-2">
                            {[...Array(Math.max(0, Math.floor(Number(averageRating))))].map((_, index) => (
                              <FaStar key={index} className="text-warning me-1" />
                            ))}
                            <small className="text-muted">({averageRating.toFixed(1)})</small>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-primary">
                              <PiCurrencyInrThin />{product.price}
                            </h5>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAddToCart(product)}
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })
              )}
            </Row>
          )}
        </Col>
      </Row>

      {/* Custom CSS */}
      <style>{`
        .product-card-hover {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .product-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
      `}</style>
    </Container>
  );
};

export default Product;