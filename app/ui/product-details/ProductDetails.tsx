import React from 'react';
import HeaderBar from '../HeaderBar';
import MainContent from './MainContent';
import { Toaster } from 'react-hot-toast';

const ProductDetails = ({ productId }: { productId: string }) => {
    return (
        <>
            <HeaderBar title="Product Management System" />
            <MainContent productId={productId} />
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
            />
        </>
    );
};

export default ProductDetails;
