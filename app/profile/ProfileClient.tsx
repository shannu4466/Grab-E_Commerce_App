"use client"

import Sidebar from "@/components/sidebar"
import Image from "next/image"
import { useAuth } from "@/context/AuthContext"

export default function ProfileClient() {
    const { user } = useAuth()

    return (
        <div>
            <Sidebar />
            <div className="mt-[20%] p-6 h-full md:mt-[5%] md:ml-[10%]">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-950">Profile</h1>
                <div className="flex flex-col md:flex-row items-center mt-[10%]">
                    <div className="border rounded-[50%] p-5 mr-10">
                        <Image
                            src={user?.image || "placeholder.png"}
                            alt='userProfile'
                            height={100}
                            width={100}
                        />
                    </div>
                    <div className="flex flex-col justify-start md:items-start">
                        <h1 className="text-2xl font-bold">Name: {user?.firstName || ""} {user?.lastName}</h1>
                        <h1 className="text-xl">Email: {user?.email.slice(0, 5)}XXXXX{user?.email.slice(20)}</h1>
                        <h1 className="text-xl">Gender: {user?.gender}</h1>
                        <h1 className="text-xl">Username: {user?.username}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}