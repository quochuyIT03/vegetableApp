import React from 'react';
import { useNavigate } from 'react-router-dom';

const StarRating = ({ rating }) => {
    const navigate = useNavigate();

    const handleNavigateRating = (rating) => {
        navigate(`/products?rating=${rating}`, { state: { rating } });
    };

    return (
        <div style={{ padding: '0 10px', cursor: 'pointer' }} onClick={() => handleNavigateRating(rating)}>
            {`Từ ${rating} sao`}
        </div>
    );
};

export default StarRating;
