import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from '../config';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

const UpdateProduct = () => {
    const [mydata, setMydata] = useState([]);
    const loadData = async () => {

        const api = `${BASE_URL}/admin/productdisplay`
        try {
            const response = await axios.get(api)
            setMydata(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handlePrimary = async (e, id) => {
        e.preventDefault()
        const api = `${BASE_URL}/admin/productmakeprimary`
        try {
            const response = await axios.post(api, { id: id })
            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
        loadData()
    }
    const handleNormal = async (id) => {
        const api = `${BASE_URL}/admin/productmakenormal`;
        try {
            const response = await axios.post(api, { id: id });
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
        loadData();
    }

    const ans = mydata.map((key) => {

        return (

            <>

                <tr>
                    <td>
                        <img src={`${BASE_URL}/${key.defaultImage}`} style={{ width: 50, height: 50 }} alt="Uploaded File" />
                    </td>
                    <td>{key.name}</td>
                    <td>{key.brand}</td>
                    <td>{key.price}</td>
                    <td>{key.description}</td>
                    <td>{key.category}</td>
                    <td>{key.subcategory}</td>
                    <td>{key.status}</td>
                    <td>{key.ratings}</td>
                    <td>
                        {key.status == "normal" ? (<>
                            <Button variant="warning" size="sm" onClick={(e) => { handlePrimary(e, key._id) }}>Primary</Button>

                        </>) : (<>

                            <Button variant="success" size="sm" onClick={() => { handleNormal(key._id) }}>Noraml</Button>

                        </>)}

                    </td>

                </tr>
            </>
        )

    })
    useEffect(() => {
        loadData()
    })

    return (
        <>
            <h4> Update Product</h4>
            <Table striped bordered hover style={{ fontSize: "12px" }}>
                <thead>
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
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {ans}
                </tbody>
            </Table>
        </>
    )
}

export default UpdateProduct