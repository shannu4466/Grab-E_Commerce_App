"use client"

import Sidebar from "@/components/sidebar"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"

type User = {
    image: string
    name: string
    firstName: string
    lastName: string
    email: string
    username: string
    gender: string
}
export default function Profile() {
    const [authenticated, setAuthenticated] = useState<boolean>(false)
    const [userDetails, setUserDetails] = useState<User[]>([])
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!user && !loading) {
            router.replace("/login")
        } else if (!loading) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUserDetails(user)
            setAuthenticated(true)
        }
    }, [user, router, loading])

    if (!authenticated) {
        return null
    }

    return (
        <div>
            <Sidebar />
            <div className="ml-[10%] mt-[5%] p-6 h-full">
                <h1 className="text-3xl font-bold text-blue-950">Profile</h1>
                <div className="flex flex-col md:flex-row items-center mt-[10%]">
                    <div className="border rounded-[50%] p-5 mr-10">
                        <Image
                            src={user?.image}
                            alt='userProfile'
                            height={100}
                            width={100}
                        />
                    </div>
                    <div className="flex flex-col justify-start items-center md:items-start">
                        <h1 className="text-2xl font-bold">Name: {userDetails.firstName} {userDetails.lastName}</h1>
                        <h1 className="text-xl">Email: {userDetails.email.slice(0, 5)}XXXXX{userDetails.email.slice(20)}</h1>
                        <h1 className="text-xl">Gender: {userDetails.gender}</h1>
                        <h1 className="text-xl">Username: {userDetails.username}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}