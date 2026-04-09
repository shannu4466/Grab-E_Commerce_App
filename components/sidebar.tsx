import Image from "next/image";
import Link from "next/link";

import { CiLogout } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { CiUser } from "react-icons/ci";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

import { AlertDialog } from "radix-ui";

import homepageLogoBgRemover from '../public/homepageLogoBgRemover.png'
import { useState } from "react";

export default function Sidebar() {
    const [openDialog, setOpenDialog] = useState(false)

    const { user, logout } = useAuth()
    const router = useRouter()
    const path = usePathname()

    const { cart } = useCart()
    const cartCount = cart.length

    const handleLogout = () => {
        logout()
        router.push("/login")
    }
    return (
        <div className="flex flex-col bg-zinc-50 font-sans">
            <div className="flex justify-between items-center h-[10%] w-full fixed mb-[10%] bg-gray-100 border-red-600">
                <Link className="h-25 w-40 -ml-11.25 md:-ml-3 flex items-center" href="/">
                    <Image
                        src={homepageLogoBgRemover}
                        alt="logo"
                        width={100}
                        height={100}
                        className="object-contain h-[80%] w-auto"
                    />
                    <h1 className="text-blue-950 text-4xl font-bold ml-[-26%]">Grab</h1>
                </Link>
                <div className="flex items-center justify-between -mr-10 md:w-[20%] md:mr-0">
                    <div className="flex justify-end items-center w-full mr-10">    
                        <CiUser size={18} className="text-blue-950" />
                        <h1 className="font-bold text-blue-950 italic ml-2">Hi...{user?.firstName} {user?.lastName}</h1>
                    </div>

                    <button className="cursor-pointer p-2 mr-10 hover:bg-orange-400 hover:rounded-4xl">
                        <CiLogout onClick={() => setOpenDialog(true)} size={24} className="text-blue-950 hover:text-black" />
                    </button>
                </div>
            </div>

            {/* logout confirmation */}
            {openDialog && (
                <AlertDialog.Root open={openDialog} onOpenChange={setOpenDialog}>
                    <AlertDialog.Portal>
                        <AlertDialog.Overlay className="fixed inset-0 bg-black/40" />

                        <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg">

                            <AlertDialog.Title className="text-lg font-semibold text-gray-900">
                                Are you sure you want to logout?
                            </AlertDialog.Title>

                            <div className="flex justify-end gap-4 mt-4">
                                <AlertDialog.Cancel asChild>
                                    <button
                                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </AlertDialog.Cancel>

                                <AlertDialog.Action asChild>
                                    <button
                                        className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        Yes, Logout
                                    </button>
                                </AlertDialog.Action>
                            </div>

                        </AlertDialog.Content>
                    </AlertDialog.Portal>
                </AlertDialog.Root>
            )}

            <div className="h-full w-[10%] mt-[10%] md:mt-[4%] ml-[0%] p-8  md:ml-0 flex flex-col justify-center items-center fixed bg-gray-100">
                <Link href="/">
                    <div className={`text-blue-950 mb-8 mt-8 cursor-pointer ${path.slice(1,) === '' ? "bg-orange-400 rounded-4xl p-2" : ""}`}>
                        <IoHomeOutline size={30} />
                    </div>
                </Link>
                <Link href="/products">
                    <div className={`text-blue-950 mb-8 mt-8 cursor-pointer ${path.slice(1,) === 'products' ? "bg-orange-400 rounded-4xl p-2" : ""}`}>
                        <MdOutlineShoppingBag size={30} />
                    </div>
                </Link>
                <Link href="/cart">
                    <div className={`relative text-blue-950 mb-8 mt-8 cursor-pointer ${path.slice(1,) === 'cart' ? "bg-orange-400 rounded-4xl p-2" : ""}`}>
                        <FiShoppingCart size={30} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-4.5 h-4.5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </Link>
                <Link href="/profile">
                    <div className={`text-blue-950 mb-8 mt-8 cursor-pointer ${path.slice(1,) === 'profile' ? "bg-orange-400 rounded-4xl p-2" : ""}`}>
                        <CgProfile size={30} />
                    </div>
                </Link>
            </div>
        </div >
    );
}