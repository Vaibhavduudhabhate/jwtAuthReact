import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading products: {error.message}</div>;

    return (
        <div className='text-center'>
        <h1>Anime</h1>
        <div className='d-flex justify-content-around'>
            {products.map(product => (
                // <li key={product._id}>
                //     <h2>{product.userName}</h2>
                //     <p>{product.description}</p>
                //     <img src={product.image} alt={product.name} style={{ width: '200px', height: '200px' }} />
                // </li>
                <div class="card rounded-bottom-3" style={{ width: '300px' }}>
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '300px' }} class="card-img-top"  />
                <div class="card-body">
                  <h2 class="card-text">{product.userName}</h2>
                </div>
                <div class="card-body">
                  <p class="card-text">{product.description}</p>
                </div>
                <button type="button" className='btn btn-primary rounded-bottom-3 rounded-top-0'>view more</button>
              </div>
            ))}
        </div>
    </div>
    );
};

export default Products;