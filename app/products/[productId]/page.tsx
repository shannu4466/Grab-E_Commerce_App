import EachProductClient from "./EachProductClient";
import { Metadata } from "next";

type Props = {
    params: Promise<{ productId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { productId } = await params;

    const product = await fetch(
        `https://dummyjson.com/products/${productId}`
    ).then(res => res.json());

    return {
        title: product.title,
    };
}

export default function SingleProduct() {
    return (
        <>
            <EachProductClient />
        </>
    )
}