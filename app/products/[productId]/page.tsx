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
import { MdOutlineRateReview } from "react-icons/md";
import { LuTags } from "react-icons/lu";

import { useCart } from '@/context/CartContext'
import Sidebar from "@/components/sidebar"

import { Avatar } from "radix-ui"

type Review = {
    reviewerName: string
    rating: number
    comment: string
    reviewerEmail: string
}
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
    reviews: Review[]
    brand: string
}

const avatarImages = [
    { id: 0, avatarUrl: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" },
    { id: 1, avatarUrl: "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&w=128&h=128&dpr=2&q=80" },
    { id: 2, avatarUrl: "https://images.unsplash.com/photo-1728577740843-5f29c7586afe?q=80&w=880" },
]

export default function SingleProduct() {
    const [product, setProduct] = useState<Product | null>(null)
    const [alreadtInCart, setAlreadyInCart] = useState<boolean>(false)
    const [currentProductQuantity, setCurrentProductQuantity] = useState<number>(0)

    const params = useParams()
    const id = Number(params.productId)

    const router = useRouter()

    const { addToCart, cart, increaseQuantity, decreaseQuantity, removeFromCart } = useCart()

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
            const res = await fetch(`https://dummyjson.com/products/${id}`, {
                cache: "no-store",
            })
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

    const discount = product?.discountPercentage
    const discountPrice = (discount / 100) * product.price
    const roundedDiscount = Number(discountPrice.toFixed(2))
    const afterDiscountPrice = (product?.price - roundedDiscount)
    const savedAmount = product.price - afterDiscountPrice

    return (
        <div>
            <Sidebar />
            <div className="flex flex-col items-center md:flex md:flex-row md:justify-between mt-0 ml-[10%]">
                <ToastContainer
                    toastClassName={() =>
                        "bg-blue-950 text-white rounded-lg px-4 py-3 w-60 flex items-center justify-start"
                    }
                />
                <div className="w-full md:h-screen md:w-0 p-10 mt-[20%] md:mt-[5%]">
                    <button onClick={() => router.back()} className="w-20"><IoMdArrowRoundBack size={24} className="text-blue-950 cursor-pointer" /></button>
                </div>
                <div className="w-full md:w-[50%] h-full">
                    <Image
                        src={product?.images?.[0] || "/fallback.png"}
                        alt="productImage"
                        height={500}
                        width={500}
                        loading="eager"
                        className="object-contain h-full w-full hover:scale-105 transition duration-300"
                    />
                </div>
                <div className="flex flex-col w-full p-10 md:w-[50%] ml-[2%] md:ml-0">
                    <h1 className="text-3xl font-bold text-blue-950 mb-1">{product.title}</h1>
                    <p className="italic text-sm flex items-center mb-2"><LuTags size={16} className="mr-2" />{product.brand}</p>
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
                        <h1 className="text-xl font-bold mb-2 mr-4 ml-1">$</h1>
                        <h1 className="text-xl font-bold mb-2 line-through mr-2 text-gray-400">{product.price}</h1>
                        <h1 className="text-xl font-bold mb-2">{afterDiscountPrice.toFixed(2)}</h1>
                    </div>
                    <p className="text-sm text-green-600 font-semibold italic mb-2"> {discount > 1 ? Math.ceil(discount) : discount}% discount applied. You can save ${savedAmount.toFixed(2)} on this order</p>
                    {alreadtInCart ?
                        <div className="flex">
                            <div className="bg-blue-950 text-white w-40 p-2 rounded-xl flex items-center justify-around mt-2">
                                <button onClick={() => {
                                    decreaseQuantity(product.id)
                                }}
                                    disabled={currentProductQuantity === 1}
                                    className="text-xl font-bold px-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                >
                                    -
                                </button>
                                <span className="flex items-center justify-center w-8 h-8 text-blue-950 bg-white rounded-full text-sm">
                                    {currentProductQuantity}
                                </span>
                                <button onClick={() => increaseQuantity(product.id)} className="text-xl font-bold px-2 cursor-pointer">+</button>
                            </div>
                            <button onClick={() => {
                                removeFromCart(product.id)
                                setAlreadyInCart(false)
                                toast.success("Removed from cart", {
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
            <div className="m-5 ml-[18%] md:ml-[12%]">
                <h1 className="text-2xl font-bold text-blue-950 flex items-center"><MdOutlineRateReview size={24} className="mr-3" />Customer Reviews</h1>
                <div className="md:flex items-center flex-wrap">
                    {product.reviews.map((review: Review) => {
                        const ids = Object.keys(avatarImages)
                        // eslint-disable-next-line react-hooks/purity
                        const randomId = Number(ids[Math.floor(Math.random() * ids.length)])
                        const reviewAvatar = avatarImages[randomId]
                        return (
                            <div key={review.reviewerEmail} className="border md:w-[32%] rounded-2xl p-3 m-2 flex justify-between items-center">
                                <div className="flex items-center">
                                    <Avatar.Root className="inline-flex size-11.25 select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle mr-3">
                                        <Avatar.Image
                                            className="size-full rounded-[inherit] object-cover"
                                            src={reviewAvatar.avatarUrl}
                                            alt="Avatar"
                                        />
                                        <Avatar.Fallback
                                            className="leading-1 flex size-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
                                            delayMs={600}
                                        >
                                            Reviewer Image
                                        </Avatar.Fallback>
                                    </Avatar.Root>
                                    <div>
                                        <h1 className="text-md font-bold text-blue-950">{review.reviewerName}</h1>
                                        <p className="text-sm text-gray-500">{review.comment}</p>
                                    </div>
                                </div>
                                <p className="text-xs bg-green-700 text-white px-2 py-1 rounded-md flex items-center w-12">
                                    <CiStar size={12} className="mr-1 text-white" /> {review.rating}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}