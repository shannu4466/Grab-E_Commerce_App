"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Sidebar from "@/components/sidebar"
import noProducts from "../../public/noProducts.png"

import { CiStar } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link"

type Product = {
    id: number
    images: string[]
    title: string
    price: number
    rating: number
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([])
    const [searchProduct, setSearchProduct] = useState<string>("")
    const [authenticated, setAuthenticated] = useState<boolean>(false)

    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.replace("/login")
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAuthenticated(true)
        }
    }, [user, router])

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch("https://dummyjson.com/products?limit=52")
            const data = await res.json()
            setProducts(data.products)
        }
        fetchProducts()
    }, [])

    if (!authenticated) {
        return null
    }
console.log(products)
    const filteredProducts = products.filter((each) => {
        return (each.title.toLocaleLowerCase().includes(searchProduct.toLowerCase()))
    })

    return (
        <div className="bg-zinc-50 h-screen text-black flex flex-col" >
            <Sidebar />
            <div className="ml-[10%] mt-[15%] md:mt-[5%] p-6 h-full">
                <div className="flex justify-end mr-[10%] md:mr-[4%] mb-[2%]">
                    <div className="relative w-90">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-950 focus:border-blue-950 transition"
                            onChange={(e) => setSearchProduct(e.target.value)}
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <CiSearch />
                        </span>
                    </div>
                </div>
                {filteredProducts.length === 0 ?
                    <div className="flex flex-col justify-center items-center">
                        <Image src={noProducts} alt="No products" height={200} width={200} />
                        <h1 className="text-3xl font-bold">No product found</h1>
                        <p>Try adjusting your filters</p>
                    </div>
                    :
                    <div className="flex flex-wrap gap-6 h-[70%] overflow-auto">
                        {filteredProducts.map((eachProduct) => (
                            <div
                                key={eachProduct.id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-4 cursor-pointer w-37 md:w-75"
                            >
                                <Link href={`/products/${eachProduct.id}`}>
                                    <div className="w-full h-45 flex items-center justify-center overflow-hidden rounded-xl bg-zinc-100">
                                        <Image
                                            src={eachProduct.images[0]}
                                            alt="productImage"
                                            width={150}
                                            height={150}
                                            className="object-contain h-full w-full hover:scale-105 transition duration-300"
                                        />
                                    </div>
                                    <h1 className="mt-3 text-sm font-semibold text-gray-800 line-clamp-2">
                                        {eachProduct.title}
                                    </h1>
                                    <div className="flex flex-col md:flex md:flex-row justify-between items-center mt-3">
                                        <h3 className="text-lg font-bold text-blue-950">
                                            ${eachProduct.price}
                                        </h3>
                                        <p className="text-sm bg-green-800 text-white px-2 py-1 rounded-md flex items-center">
                                            <CiStar size={18} className="mr-1" /> {eachProduct.rating}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}