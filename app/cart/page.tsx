"use client"

import Sidebar from "@/components/sidebar"

export default function Car() {
    return (
        <div>
            <Sidebar />
            <div className="ml-[10%] mt-[5%] p-6 h-full">
                <h1 className="text-3xl font-bold text-blue-950">Your Cart</h1>
                <p>Currently there is no items in your cart. Keep adding more items</p>
            </div>
        </div>
    )
}