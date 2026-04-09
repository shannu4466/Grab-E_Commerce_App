"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Sidebar from "@/components/sidebar"
import noProducts from "../../public/noProducts.png"

import { CiStar } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

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

    const router = useRouter()

    const searchParams = useSearchParams()
    const pageUrl = Number(searchParams.get("page")) || 1
    const [currPage, setCurrPage] = useState<number>(pageUrl)

    useEffect(() => {
        router.push(`?page=${currPage}`)
    }, [router, currPage])

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch("https://dummyjson.com/products?limit=100")
            const data = await res.json()
            setProducts(data.products)
        }
        fetchProducts()
    }, [])

    const filteredProducts = products.filter((each) => {
        return (each.title.toLocaleLowerCase().includes(searchProduct.toLowerCase()))
    })

    // pagination logic
    const itemsPerPage = 10
    const start = (currPage - 1) * itemsPerPage
    const currItems = filteredProducts.slice(start, start + itemsPerPage)
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

    return (
        <div className="bg-zinc-50 h-screen text-black flex flex-col" >
            <Sidebar />
            <div className="ml-[10%] mt-[15%] md:mt-[5%] p-6 h-full md:h-[90%]">
                <div className="flex justify-end mr-[10%] md:mr-[4%] mb-[2%] ml-[8%]">
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
                    <div className="flex flex-wrap gap-6 h-[70%] overflow-auto ml-[1%]">
                        {currItems.map((eachProduct) => (
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
                {filteredProducts.length !== 0 && (
                    <div className="flex justify-center items-center w-full overflow-auto">
                        <Pagination className="mt-5">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currPage > 1) setCurrPage(currPage - 1);
                                        }}
                                        className={currPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                                {generatePagination(currPage, totalPages).map((page, i) => (
                                    <PaginationItem key={i}>
                                        {page === "..." ? (
                                            <PaginationEllipsis />
                                        ) : (
                                            <PaginationLink
                                                href="#"
                                                isActive={page === currPage}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrPage(Number(page));
                                                }}
                                                className="cursor-pointer"
                                            >
                                                {page}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currPage < totalPages) setCurrPage(currPage + 1);
                                        }}
                                        className={currPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>

        </div>
    )
}

function generatePagination(current: number, total: number) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | string)[] = [];
    pages.push(1);

    if (current > 3) {
        pages.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) {
        pages.push("...");
    }

    pages.push(total);
    return pages;
}