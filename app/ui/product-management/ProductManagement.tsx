import HeaderBar from '../HeaderBar';
import MainContent from './MainContent';
import { getAllProducts, getAllSuppliers } from 'app/lib/data';

const ProductManagement = async () => {
    const suppliers = await getAllSuppliers();
    const products = await getAllProducts();

    return (
        <>
            <HeaderBar title="Product Management System" />
            <MainContent suppliers={suppliers} products={products} />
        </>
    );
};

export default ProductManagement;
