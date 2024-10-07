import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from './components/Loading';

const ProductDetails = () => {
    const { id } = useParams(); 
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3002/delete/${id}`);
            navigate('/'); 
        } catch (err) {
            setError(err);
        }
    };

    const handleUpdate = () => {
        navigate(`/update/${id}`); 
    };

    const handleBack = () =>{
        navigate('/');
    }

    if (loading) return <div><Loading /></div>;
    if (error) return <div>Error loading product details: {error.message}</div>;

    return (
        <div className="container mt-4">
            <button className='btn btn-dark mb-5' onClick={handleBack} >go Back</button>
            <h1>{product.userName}</h1>
            <img src={product.image} alt={product.name} style={{ width: '300px', height: '300px' }} />
            <p>{product.description}</p>

            <button onClick={handleDelete} className="btn btn-danger me-3">Delete</button>
            <button onClick={handleUpdate} className="btn btn-primary">Update</button>
        </div>
    );
};

export default ProductDetails;
