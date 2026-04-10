import ProductsClient from "./ProductsClient";
import Head from "next/head";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Products",
};

export default function Products() {
    return (
        <>
            <ProductsClient />
        </>
    )
}