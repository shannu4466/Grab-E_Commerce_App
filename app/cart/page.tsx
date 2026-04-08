"use client"

import Sidebar from "@/components/sidebar"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MdDeleteOutline } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify'

export default function Cart() {
    const [authenticated, setAuthenticated] = useState<boolean>(false)

    const { user, loading } = useAuth()
    const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart()

    const router = useRouter()

    useEffect(() => {
        if (!user && !loading) {
            router.replace("/login")
        } else if (!loading && user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAuthenticated(true)
        }
    }, [user, router, loading])

    if (!authenticated) {
        return null
    }

    let totalCartValue = 0;

    return (
        <div>
            <Sidebar />
            <div className="ml-[10%] mt-[10%] md:mt-[5%] p-6 h-full">
                <h1 className="text-3xl font-bold text-blue-950">Your Cart</h1>
                <ToastContainer />
                {cart.length === 0 ?
                    <div className="flex flex-col justify-center items-center h-100">
                        <h1 className="text-3xl font-bold text-blue-950 mb-3">Cart is empty</h1>
                        <p className="text-blue-950 mb-3">Please try to add products in the cart</p>
                        <Link href="/products">
                            <button className="bg-blue-950 text-white p-3 rounded-xl cursor-pointer">Add products</button>
                        </Link>
                    </div>
                    :
                    (
                        cart.map((product) => {
                            const discount = product?.discountPercentage
                            const discountPrice = (discount / product.price) * 100
                            const roundedDiscount = discountPrice.toFixed(2)
                            const afterDiscountPrice = (product?.price - roundedDiscount)

                            const cartItemProductPrice = afterDiscountPrice * product.quantity
                            const roundedPrice = cartItemProductPrice.toFixed(2)
                            totalCartValue += Number(roundedPrice)

                            return (
                                <div key={product.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 m-3 bg-white border border-gray-400 rounded-md shadow">
                                    <Link href={`/products/${product.id}`}>
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <Image src={product.images[0]} alt='product' height={80} width={80} className="object-cover rounded" />
                                            <h1 className="text-md md:text-lg font-bold text-blue-950 flex-1 line-clamp-2">{product.title}</h1>
                                        </div>
                                    </Link>
                                    <div className="flex flex-wrap items-center justify-between w-full sm:w-auto gap-4">
                                        <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-full">
                                            <button onClick={() => decreaseQuantity(product.id)} className="text-xl font-bold px-2 cursor-pointer">-</button>
                                            <span className="flex items-center justify-center w-8 h-8 text-white bg-blue-950 rounded-full text-sm">
                                                {product.quantity}
                                            </span>
                                            <button onClick={() => increaseQuantity(product.id)} className="text-xl font-bold px-2 cursor-pointer">+</button>
                                        </div>
                                        <p className="text-lg font-bold text-blue-950 min-w-20 text-center">
                                            ${roundedPrice}
                                        </p>
                                        <button
                                            className="w-full sm:w-auto bg-red-100 text-white text-sm font-semibold rounded-xl px-5 py-2 hover:bg-red-100 transition-colors cursor-pointer flex justify-center"
                                            onClick={() => {
                                                removeFromCart(product.id)
                                                toast.success('Item Removed from cart', {
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
                                            <MdDeleteOutline size={24} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )
                }
                <div className="flex flex-col justify-end items-end pr-10">
                    <div className="flex flex-col justify-between border rounded-xl p-6 w-60">
                        <h1 className="text-xl font-bold mb-1">Cart Value</h1>
                        <h1 className="font-bold text-blue-950 text-2xl mb-1">${totalCartValue.toFixed(2)}</h1>
                        <button className="text-white bg-blue-950 rounded-xl pr-5 pl-5 p-2 cursor-pointer mb-1"
                            onClick={() => {
                                toast.info('Not implimented', {
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
                        >checkout</button>
                    </div>
                </div>
            </div>

        </div>
    )
}