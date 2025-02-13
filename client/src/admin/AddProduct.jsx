import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import "../css/AddProduct.css";

const AddProduct = () => {
    const [input, setInput] = useState({
        category: "",
        brand: "",
        name: "",
        price: "",
        description: "",
    });
    console.log(input);
    const [images, setImages] = useState(null);

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


        for (let i = 0; i < images.length; i++) {
            formData.append("image", images[i]);
        }


        try {
            await axios.post("http://localhost:8000/products/insertdata", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("Data saved successfully");
        } catch (error) {
            alert("Error saving data: " + error.message);
        }
    };

    return (
        <div className="insert-container">
            <div className="form-container">
                <h1 className="title">Add Product</h1>
                <Form className="insert-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <Form.Label>Select Category</Form.Label>
                        <Form.Select
                            name="category"
                            value={input.category}
                            onChange={handleInput}
                            required
                        >
                            <option value="">Choose Category</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Hand Bag">Hand Bag</option>
                            <option value="Books">Books</option>
                            <option value="Tech">Tech</option>
                            <option value="Sneakers">Sneakers</option>
                            <option value="Travel">Travel</option>
                        </Form.Select>
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
