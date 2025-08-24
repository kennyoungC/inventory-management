import React from 'react';
import HeaderBar from '../HeaderBar';
import MainContent from './MainContent';

const ProductDetails = ({ productId }: { productId: string }) => {
    return (
        <>
            <HeaderBar title="Product Management System" />
            <MainContent productId={productId} />
        </>
    );
};

export default ProductDetails;
