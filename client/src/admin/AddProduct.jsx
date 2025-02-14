import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import BASE_URL from "../config";
import "../css/AddProduct.css";

const AddProduct = () => {
    const [input, setInput] = useState({
        category: "",
        brand: "",
        name: "",
        price: "",
        description: "",
    });
    const [images, setImages] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState("");

    const categories = {
        Furniture: ["Living Room Furniture", "Bedroom Furniture", "Dining Room Furniture", "Office Furniture", "Kids Furniture"],
        Handbag: ["Tote Bags", "Shoulder Bags", "Crossbody Bags", "Backpacks", "Belt Bags"],
        Books: ["Fiction", "Non-Fiction", "Children's Books", "Academic & Educational", "Comics & Graphic Novels", "Religion & Spirituality", "Arts & Entertainment", "Cookbooks & Food", "Poetry & Drama"],
        Tech: ["Computers & Accessories", "Mobile Phones", "Audio & Sound Devices", "Gaming & Accessories", "Smart Home & IoT Devices", "Wearable Technology", "Cameras & Photography Equipment", "Office & Productivity", "Electric Vehicles & Accessories"],
        Sneakers: ["Athletic Sneakers", "Casual & Lifestyle Sneakers", "Fashion & Designer Sneakers", "Streetwear & Hype Sneakers", "Outdoor & Hiking Sneakers"],
        Travels: ["Luggage & Bags", "Travel Accessories", "Electronics & Gadgets", "Toiletries & Personal Care", "Safety & Security", "Travel Clothing & Footwear"],
    };

    const handleCategoryChange = (e) => {
        const category = e.target.value;
        setSelectedCategory(category);
        setSubcategories(categories[category] || []);
        setSelectedSubcategory("");
    };

    const handleSubcategoryChange = (e) => {
        setSelectedSubcategory(e.target.value);
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInput((values) => ({ ...values, [name]: value }));
    };

    const handleImage = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let key in input) {
            formData.append(key, input[key]);
        }
        formData.append("category", selectedCategory);
        formData.append("subcategory", selectedSubcategory);
        for (let i = 0; i < images.length; i++) {
            formData.append("files", images[i]);
        }

        try {
            const api = `${BASE_URL}/admin/productsave`;
            await axios.post(api, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert("File uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    return (
        <div className="insert-container">
            <div className="form-container">
                <h1 className="title">Add Product</h1>
                <Form className="insert-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <Form.Group className="mb-3">
                            <Form.Label>Select Product Category:</Form.Label>
                            <Form.Select value={selectedCategory} onChange={handleCategoryChange}>
                                <option value="">Select Category</option>
                                {Object.keys(categories).map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Select Subcategory:</Form.Label>
                            <Form.Select value={selectedSubcategory} onChange={handleSubcategoryChange} disabled={!selectedCategory}>
                                <option value="">Select Subcategory</option>
                                {subcategories.map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </div>

                    <div className="form-group">
                        <Form.Label>Enter Brand</Form.Label>
                        <Form.Control
                            type="text"
                            name="brand"
                            value={input.brand}
                            onChange={handleInput}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <Form.Label>Enter Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={handleInput}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <Form.Label>Enter Price</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            value={input.price}
                            onChange={handleInput}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <Form.Label>Enter Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={input.description}
                            onChange={handleInput}
                            required
                        />
                    </div>

                    <div className="form-group file-input">
                        <Form.Label>Upload Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            multiple
                            onChange={handleImage}
                        />
                    </div>

                    <div className="btn-container">
                        <Button variant="primary" type="submit">Submit</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default AddProduct;
