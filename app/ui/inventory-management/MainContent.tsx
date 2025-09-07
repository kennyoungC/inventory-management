import { getAllProductsWithSuppliers } from '@/data/product';
import ProductCard from './ProductCard';

const MainContent = async () => {
    const products = await getAllProductsWithSuppliers();

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-8">
            <div
                className="grid gap-6"
                style={{
                    gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                }}
            >
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default MainContent;
