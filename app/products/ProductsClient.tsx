"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Sidebar from "@/components/sidebar"
import noProducts from "../../public/noProducts.png"

import { CiStar } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link"

import { Select } from "radix-ui"
import classnames from "classnames"

import { useFetch } from "@/hooks/useFetch"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

type Product = {
    id: number
    images: string[]
    title: string
    price: number
    rating: number
}

type ProductsResponse = {
    products: Product[]
    total: number
    skip: number
    limit: number
}

export default function ProductsClient() {
    const [searchProduct, setSearchProduct] = useState<string>("")
    const [category, setCategory] = useState<string>("all-products")
    const [sortedValue, setSortedValue] = useState<string>("asc")

    const router = useRouter()

    const searchParams = useSearchParams()
    const pageUrl = Number(searchParams.get("page")) || 1
    const [currPage, setCurrPage] = useState<number>(pageUrl)

    useEffect(() => {
        router.push(`?page=${currPage}&category=${category}&sortBy=${sortedValue}`)
    }, [router, currPage, category, sortedValue])

    const { apiData: categoryList } = useFetch<string[]>("https://dummyjson.com/products/category-list")

    const url = category === 'all-products' ?
        `https://dummyjson.com/products?limit=1000&sortBy=price&order=${sortedValue}`
        : `https://dummyjson.com/products/category/${category}/?limit=50&sortBy=price&order=${sortedValue}`

    const { apiData: productResponse, loading } = useFetch<ProductsResponse>(url)
    const products = productResponse?.products ?? []

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
            <div className="mt-[15%] md:mt-[5%] p-6 h-full md:h-[90%] md:ml-[5%]">
                {loading && (
                    <div className="flex flex-col justify-center items-center h-screen">
                        <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                    </div>
                )}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mx-4 sm:mx-6 md:mx-10 lg:mx-[8%] my-4">
                    <div className="md:flex items-center justify-between">
                        <div className="w-full md:w-auto md:flex md:items-center">
                            <label className="md:mr-3">Select category</label>
                            <Select.Root
                                value={category}
                                onValueChange={(value) => {
                                    setCategory(value)
                                    setCurrPage(1)
                                }}
                            >
                                <Select.Trigger
                                    className="w-full md:w-auto border h-10 px-3 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-950 focus:border-blue-950 mr-10 mb-2 md:mb-0 flex items-center justify-between cursor-pointer"
                                    aria-label="Category"
                                >
                                    <Select.Value placeholder="Select category" />
                                    <Select.Icon>
                                        <ChevronDownIcon />
                                    </Select.Icon>
                                </Select.Trigger>

                                <Select.Portal>
                                    <Select.Content className="overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,23,24,0.35),0px_10px_20px_-15px_rgba(22,23,24,0.2)]">

                                        <Select.ScrollUpButton className="flex h-6.25 items-center justify-center bg-white">
                                            <ChevronUpIcon />
                                        </Select.ScrollUpButton>

                                        <Select.Viewport className="p-1.25">
                                            <Select.Group>
                                                <Select.Item value="all-products" className="px-3 py-2 cursor-pointer">
                                                    <Select.ItemText>All Categories</Select.ItemText>
                                                </Select.Item>
                                                {categoryList?.map((eachCategory: string, idx: number) => (
                                                    <Select.Item
                                                        key={idx}
                                                        value={eachCategory}
                                                        className="px-3 py-2 cursor-pointer"
                                                    >
                                                        <Select.ItemText>{eachCategory}</Select.ItemText>
                                                    </Select.Item>
                                                ))}

                                            </Select.Group>
                                        </Select.Viewport>

                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </div>
                        <div className="md:flex md:items-center justify-start">
                            <label className="md:mr-3">Sort By</label>
                            <Select.Root
                                value={sortedValue}
                                onValueChange={(value) => {
                                    setSortedValue(value)
                                    setCurrPage(1)
                                }}
                            >
                                <Select.Trigger
                                    className="w-full md:w-auto border h-10 px-3 rounded-md bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-950 focus:border-blue-950 mr-10 mb-2 md:mb-0 flex items-center justify-between cursor-pointer"
                                    aria-label="Sort By"
                                >
                                    <Select.Value placeholder="Sort by" />
                                    <Select.Icon>
                                        <ChevronDownIcon />
                                    </Select.Icon>
                                </Select.Trigger>

                                <Select.Portal>
                                    <Select.Content className="overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,23,24,0.35),0px_10px_20px_-15px_rgba(22,23,24,0.2)]">

                                        <Select.ScrollUpButton className="flex h-6.25 items-center justify-center bg-white">
                                            <ChevronUpIcon />
                                        </Select.ScrollUpButton>

                                        <Select.Viewport className="p-1.25">
                                            <Select.Group>

                                                <Select.Item value="asc" className="px-3 py-2 cursor-pointer">
                                                    <Select.ItemText>Low to high</Select.ItemText>
                                                </Select.Item>

                                                <Select.Item value="desc" className="px-3 py-2 cursor-pointer">
                                                    <Select.ItemText>High to low</Select.ItemText>
                                                </Select.Item>

                                            </Select.Group>
                                        </Select.Viewport>

                                    </Select.Content>
                                </Select.Portal>
                            </Select.Root>
                        </div>
                    </div>
                    <div className="relative w-full md:w-80 lg:w-96">
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
                    <div className="flex items-center justify-center md:justify-start flex-wrap gap-6 h-[70%] overflow-auto">
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
                    <div className="flex justify-center items-center w-full overflow-auto pb-[20%] md:pb-0">
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