import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
import Loading from './Loading';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3002/allproducts')
            .then(response => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    const handleViewMore = (id) => {
        navigate(`/view/${id}`);
    };

    if (loading) return <div><Loading /></div>;
    if (error) return <div>Error loading products: {error.message}</div>;

    return (
        <div className='text-center'>
        <h1>Anime</h1>
        <div className='d-flex justify-content-around flex-wrap '>
            {products && products.map(product => (
                <div className="card rounded-bottom-3 my-2" style={{ width: '300px' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '300px' }} className="card-img-top"  />
                <div className="card-body">
                  <h2 className="card-text">{product.userName}</h2>
                </div>
                <div className="card-body">
                  <p className="card-text">{product.description}</p>
                </div>
                <button type="button" className='btn btn-primary rounded-bottom-3 rounded-top-0' onClick={() => handleViewMore(product._id)}>view more</button>
              </div>
            ))}
        </div>
    </div>
    );
};

export default Products;