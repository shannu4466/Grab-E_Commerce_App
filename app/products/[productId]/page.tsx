"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { ToastContainer, toast } from 'react-toastify'

import { MdOutlineLocalShipping } from "react-icons/md";
import { CiStar } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import { GiConfirmed } from "react-icons/gi";
import { useCart } from '@/context/CartContext'

type Product = {
    title: string
    description: string
    images?: string[]
    availabilityStatus: string
    price: number
    rating: number
    shippingInformation: string
    warrantyInformation: string
}

export default function SingleProduct() {
    const [product, setProduct] = useState<Product[] | null>(null)
    const params = useParams()
    const id = params.productId as string

    const { addToCart } = useCart()

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`https://dummyjson.com/products/${id}`)
            const data = await res.json()
            setProduct(data)
        }
        fetchProduct()
    }, [id])

    if (!product) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center md:flex md:flex-row md:justify-between mt-0">
            <ToastContainer />
            <div className="w-full md:w-[50%] h-full">
                <Image
                    src={product?.images[0] || "/placeholder.png"}
                    alt="productImage"
                    height={500}
                    width={500}
                    className="object-contain h-full w-full hover:scale-105 transition duration-300"
                />
            </div>
            <div className="flex flex-col w-full p-10 md:w-[50%] ml-[2%] md:ml-0">
                <h1 className="text-3xl font-bold text-blue-950 mb-2">{product.title}</h1>
                <div className="flex justify-between items-center mr-[15%] mb-2">
                    <p className={`${product.availabilityStatus === 'In Stock' ? "text-green-700" : "text-red-500"} font-bold`}>{product.availabilityStatus}</p>
                    <p className="text-sm bg-green-700 text-white px-2 py-1 rounded-md flex items-center w-18">
                        <CiStar size={18} className="mr-1 text-white" /> {product.rating}
                    </p>
                </div>
                <p className="italic text-sm mb-2">{product.description}</p>
                <p className="flex items-center mb-2"><MdOutlineLocalShipping size={18} className="mr-3" />{product.shippingInformation}</p>
                <p className="flex items-center mb-2"><GiConfirmed size={18} className="mr-3" />{product.warrantyInformation}</p>
                <h1 className="text-xl font-bold mb-2">${product.price}</h1>
                <button
                    className="bg-blue-950 text-white w-40 p-2 rounded-xl flex items-center justify-around mt-2 cursor-pointer"
                    onClick={() => {
                        addToCart(product)
                        toast.success('Added to cart', {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                    }}
                >
                    <FiShoppingCart size={18} />
                    Add to cart
                </button>
            </div>
        </div>
    )
}