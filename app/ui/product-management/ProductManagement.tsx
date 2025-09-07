import { getAllProducts } from '@/data/product';
import HeaderBar from '../HeaderBar';
import MainContent from './MainContent';
import { getAllSuppliers } from '@/data/supplier';

const ProductManagement = async () => {
    const [products, suppliers] = await Promise.all([getAllProducts(), getAllSuppliers()]);

    return (
        <>
            <HeaderBar title="Product Management System" />
            <MainContent suppliers={suppliers} products={products} />
        </>
    );
};

export default ProductManagement;
