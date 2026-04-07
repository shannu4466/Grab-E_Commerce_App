"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import { CiLogout } from "react-icons/ci";
import homepageLogo from '../public/homepageLogo.png'
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const userLoggedIn = () => {
    const isUserLoggedIn = Boolean(localStorage.getItem("grabToken"))
    if (!isUserLoggedIn) {
      router.replace("/login")
    } else {
      setAuthenticated(true)
    }
  }
  useEffect(() => {
    userLoggedIn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  if (!authenticated) {
    return null
  }

  return (
    <div className="flex flex-col bg-zinc-50 font-sans">
      <div className="flex justify-between items-center">
        <Image src={homepageLogo} alt="logo" className="" />
        <button onClick={handleLogout} className="cursor-pointer p-2">
          <CiLogout size={24} className="text-blue-950" />
        </button>
      </div>
      <div>
        <h1>Sidebars</h1>
      </div>
    </div >
  );
}
