import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from './components/Loading';

const UpdateProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3002/view/${id}`);
                setProduct(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file ? file.name : null); // Update the filename
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('userName', product.userName);
        formData.append('description', product.description);
        const imageFile = document.getElementById('imageInput').files[0];
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            await axios.put(`http://localhost:3002/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate(`/view/${id}`);
        } catch (err) {
            setError(err);
        }
    };

    const handleBack = () =>{
        navigate(`/view/${id}`);
    }

    if (loading) return <div><Loading /></div>;
    if (error) return <div>Error loading product details: {error.message}</div>;

    return (
        <div className="container mt-4">
            <button className='btn btn-dark mb-5' onClick={handleBack} >go Back</button>
            <h1>Update Product</h1>
            <form onSubmit={handleUpdate}>
                <div className="mb-3 ">
                    <label htmlFor="userName" className="form-label">User Name:</label>
                    <input 
                        type="text" 
                        value={product.userName}
                        className="form-control" 
                        id="userName" 
                        name="userName" 
                        aria-describedby="userName" 
                        onChange={e => setProduct({ ...product, userName: e.target.value })} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description">Description:</label>
                    <textarea 
                        className="form-control" 
                        placeholder="" 
                        name="description" 
                        id="description"
                        value={product.description} 
                        onChange={e => setProduct({ ...product, description: e.target.value })} 
                    />
                    
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label image">Image:</label>
                    <input type="file" className="form-control image" onSubmit={handleFileChange} name="image" id="imageInput" />
                    {selectedFile && <div className="mt-2">Selected file: {selectedFile}</div>}
                </div>
                <button type="submit" className="btn btn-primary">Update Product</button>
            </form>
        </div>
    );
};

export default UpdateProduct;
