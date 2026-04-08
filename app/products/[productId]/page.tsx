"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ToastContainer, toast } from 'react-toastify'

import { MdOutlineLocalShipping } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import { CiStar } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlinePolicy } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { useCart } from '@/context/CartContext'
import { useAuth } from "@/context/AuthContext";

type Product = {
    returnPolicy: string
    discountPercentage: number
    id: number
    title: string
    description?: string
    images?: string[]
    availabilityStatus?: string
    price: number
    rating?: number
    shippingInformation?: string
    warrantyInformation?: string
}

export default function SingleProduct() {
    const [product, setProduct] = useState<Product | null>(null)
    const [authenticated, setAuthenticated] = useState<boolean>(false)
    const [alreadtInCart, setAlreadyInCart] = useState<boolean>(false)
    const [currentProductQuantity, setCurrentProductQuantity] = useState<number>(0)

    const params = useParams()
    const id = params.productId as unknown as number

    const router = useRouter()

    const { addToCart, cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart()
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!user && !loading) {
            router.replace("/login")
        } else if (!loading) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAuthenticated(true)
        }
    }, [user, router, loading])

    useEffect(() => {
        const fetchProductDetails = () => {
            cart.map((each) => {
                if (each.id === Number(id)) {
                    setCurrentProductQuantity(each.quantity)
                    setAlreadyInCart(true)
                }
            })
        }
        fetchProductDetails()
    }, [id, cart])

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await fetch(`https://dummyjson.com/products/${id}`)
            const data = await res.json()
            setProduct(data)
        }
        fetchProduct()
    }, [id])

    if (!authenticated) {
        return null
    }

    if (!product) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>
        )
    }

    const discount = product?.discountPercentage
    const discountPrice = (discount / product.price) * 100
    const roundedDiscount = discountPrice.toFixed(2)
    const afterDiscountPrice = (product?.price - roundedDiscount)

    return (
        <div className="flex flex-col items-center md:flex md:flex-row md:justify-between mt-0">
            <ToastContainer
                toastClassName={() =>
                    "bg-blue-950 text-white rounded-lg px-4 py-3 w-50"
                }
            />
            <div className="w-full md:h-screen md:w-0 p-10 cursor-pointer">
                <button onClick={() => router.back()} className="w-20"><IoMdArrowRoundBack size={24} className="text-blue-950 cursor-pointer" /></button>
            </div>
            <div className="w-full md:w-[50%] h-full">
                <Image
                    src={product.images[0] || "/placeholder.png"}
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
                <p className="flex items-center mb-2"><MdOutlinePolicy size={18} className="mr-3" />{product.returnPolicy}</p>
                <div className="flex">
                    <h1 className="text-xl font-bold mb-2">$</h1>
                    <h1 className="text-xl font-bold mb-2 line-through mr-2 text-gray-400">{product.price}</h1>
                    <h1 className="text-xl font-bold mb-2">{afterDiscountPrice}</h1>
                </div>
                {alreadtInCart ?
                    <div className="flex">
                        <div className="bg-blue-950 text-white w-40 p-2 rounded-xl flex items-center justify-around mt-2 cursor-pointer">
                            <button onClick={() => decreaseQuantity(product.id)} className="text-xl font-bold px-2 cursor-pointer">-</button>
                            <span className="flex items-center justify-center w-8 h-8 text-blue-950 bg-white rounded-full text-sm">
                                {currentProductQuantity}
                            </span>
                            <button onClick={() => increaseQuantity(product.id)} className="text-xl font-bold px-2 cursor-pointer">+</button>
                        </div>
                        <button onClick={() => {
                            removeFromCart(product.id)
                            setAlreadyInCart(false)
                            toast.success("Item removed", {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                            })
                        }}
                            className="bg-red-300 rounded-xl flex items-center justify-around mt-2 cursor-pointer p-2 text-red-500 ml-5 mr-5"
                        >
                            <MdDeleteOutline size={24} />
                        </button>
                        <button
                            className="bg-blue-950 text-white w-40 p-2 rounded-xl flex items-center justify-around mt-2 cursor-pointer"
                            onClick={() => {
                                router.replace("/cart")
                            }}
                        >
                            <FiShoppingCart size={18} />
                            Go to cart
                        </button>
                    </div>
                    :
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
                                theme: "colored",
                            });
                            // setTimeout(() => {
                            //     router.push("/products")
                            // }, 2000)
                        }}
                    >
                        <FiShoppingCart size={18} />
                        Add to cart
                    </button>
                }
            </div >
        </div >
    )
}