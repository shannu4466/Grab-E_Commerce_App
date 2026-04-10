"use client"

import Sidebar from "@/components/sidebar"
import { useCart } from "@/context/CartContext"
import Image from "next/image"
import Link from "next/link"
import Head from "next/head"

import { MdDeleteOutline } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify'
import { useEffect, useState } from "react"

export default function CartClient() {
    const [quantityError, setQuantityError] = useState<boolean>(false)

    const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart()

    let totalCartValue = 0;
    let totalCartPrice = 0;
    let totalSaved = 0;

    useEffect(() => {
        const hasError = cart.some(
            (item) => item.quantity < item.minimumOrderQuantity
        )
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setQuantityError(hasError);
    }, [cart])

    return (
        <div>
            <Head>
                <title>Grab</title>
            </Head>
            <Sidebar />
            <div className="md:ml-[10%] mt-[20%] md:mt-[5%] px-3 sm:px-4 md:px-6 flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-[65%]">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-950 mb-4">
                        Your Cart
                    </h1>
                    <ToastContainer toastClassName={() => "bg-blue-950 text-white rounded-lg px-4 py-3 w-60 flex items-center justify-start mt-[20%] md:mt-[25%]"} />
                    {cart.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-72 sm:h-96 w-full text-center md:ml-[20%]">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-950 mb-3">
                                Cart is empty
                            </h1>
                            <p className="text-blue-950 mb-3">
                                Please try to add products in the cart
                            </p>
                            <Link href="/products">
                                <button className="bg-blue-950 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-xl cursor-pointer">
                                    Add products
                                </button>
                            </Link>
                        </div>
                    ) : (
                        cart.map(product => {
                            const discount = product.discountPercentage
                            const discountPrice = (discount / 100) * product.price
                            const roundedDiscount = Number(discountPrice.toFixed(2))
                            const afterDiscountPrice = product.price - roundedDiscount
                            const cartItemProductPrice = afterDiscountPrice * product.quantity
                            const roundedPrice = cartItemProductPrice.toFixed(2)
                            totalCartValue += Number(roundedPrice)

                            totalCartPrice += Number(product.price * product.quantity)
                            totalSaved = (totalCartPrice - totalCartValue)

                            return (
                                <div
                                    key={product.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 mb-4 bg-white border border-gray-400 rounded-md shadow"
                                >
                                    <Link href={`/products/${product.id}`} className="w-full sm:w-auto">
                                        <div className="flex flex-col items-center gap-3 sm:gap-4">
                                            <div className="flex items-center">
                                                <Image
                                                    src={product?.images[0]}
                                                    alt="product"
                                                    height={70}
                                                    width={70}
                                                    loading="eager"
                                                    className="object-cover rounded shrink-0 h-40 w-40"
                                                />
                                                <h1 className="text-xl sm:text-md md:text-lg font-bold text-blue-950 line-clamp-2">
                                                    {product.title}
                                                </h1>
                                            </div>
                                            <div className="sm:block hidden">
                                                {product.quantity < product.minimumOrderQuantity && (
                                                    <p className="text-sm text-red-600 font-semibold">Minimum order should be {product.minimumOrderQuantity}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between w-full sm:w-auto gap-3 sm:gap-6">
                                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full border">
                                            <button
                                                onClick={() => {
                                                    decreaseQuantity(product.id)
                                                    if (product.quantity === 1) {
                                                        removeFromCart(product.id)
                                                    }
                                                }}
                                                className="text-lg sm:text-xl font-bold px-2 cursor-pointer"
                                            >
                                                -
                                            </button>

                                            <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-white bg-blue-950 rounded-full text-xs sm:text-sm">
                                                {product.quantity}
                                            </span>

                                            <button
                                                onClick={() => increaseQuantity(product.id)}
                                                className="text-lg sm:text-xl font-bold px-2 cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="flex flex-col justify-center items-center">
                                            <p className="text-sm line-through text-gray-400">${(product.price * product.quantity).toFixed(2)}</p>
                                            <p className="text-base sm:text-lg font-bold text-blue-950 text-right min-w-17.5">
                                                ${roundedPrice}
                                            </p>
                                        </div>
                                        <button
                                            className="bg-red-100 p-2 rounded-xl hover:bg-red-200 cursor-pointer"
                                            onClick={() => {
                                                removeFromCart(product.id)
                                                toast.success('Removed from cart', {
                                                    position: "top-right",
                                                    autoClose: 2000,
                                                    hideProgressBar: true,
                                                    closeOnClick: false,
                                                    pauseOnHover: true,
                                                    draggable: true,
                                                    progress: undefined,
                                                    theme: "colored"
                                                })
                                            }}
                                        >
                                            <MdDeleteOutline size={22} className="text-red-500" />
                                        </button>
                                    </div>
                                    <div className="sm:hidden">
                                        {product.quantity < product.minimumOrderQuantity && (
                                            <p className="text-sm text-red-600">Minimum order should be {product.minimumOrderQuantity}</p>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
                {cart.length > 0 && (
                    <div className="w-full lg:w-[30%] mt-[4%] mb-[20%] md:mb-0">
                        <div className="flex flex-col border rounded-xl p-5 sm:p-6 w-full max-w-sm mx-auto lg:sticky lg:top-24">
                            <h1 className="text-lg sm:text-xl font-bold mb-1">
                                Cart Value
                            </h1>
                            <div className="flex items-center justify-between">
                                <h1>Total price: </h1>
                                <h1 className="font-bold text-blue-950 text-xl sm:text-xl">
                                    ${totalCartPrice.toFixed(2)}
                                </h1>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <h1>Discount: </h1>
                                <h1 className="font-bold text-blue-950 text-xl sm:text-xl">
                                    ${totalSaved.toFixed(2)}
                                </h1>
                            </div>
                            <hr />
                            <div className="flex items-center justify-between mt-2 mb-2">
                                <h1>Final amount to be paid: </h1>
                                <h1 className="font-bold text-blue-950 text-xl sm:text-xl">
                                    ${totalCartValue.toFixed(2)}
                                </h1>
                            </div>
                            <hr />
                            <p className="text-green-500 italic mb-4">You saved upto total of <span className="font-bold">${totalSaved.toFixed(2)}</span></p>
                            <button
                                disabled={quantityError}
                                className="w-full text-white bg-blue-950 rounded-xl py-2 sm:py-3 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                onClick={() => {
                                    toast.info('Not implemented', {
                                        position: "top-right",
                                        autoClose: 2000,
                                        hideProgressBar: true,
                                        closeOnClick: false,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "colored"
                                    })
                                }}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}