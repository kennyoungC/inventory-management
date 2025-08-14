import ProductDetails from 'app/ui/product-details/ProductDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Product Details',
};

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function Page(props: PageProps) {
    const { id } = await props.params;
    console.log({ id });

    return <ProductDetails />;
}
