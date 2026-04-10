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

    const isActive = (route: string) => {
        if (route === '' && path === '/') return true;
        return path.startsWith(`/${route}`) && route !== '';
    }

    return (
        <div className="flex flex-col bg-zinc-50 font-sans">
            <div className="flex justify-between items-center h-16 md:h-[10%] w-full fixed top-0 z-50 bg-gray-100 border-b border-gray-200 px-4 md:px-8">
                <Link className="flex items-center justify-around md:-ml-[4%]" href="/">
                    <div className="relative h-[10%] w-20 md:h-[10%] md:w-30">
                        <Image
                            src={homepageLogoBgRemover}
                            alt="logo"
                            height={400}
                            width={400}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-blue-950 text-2xl md:text-4xl font-bold -ml-[20%]">Grab</h1>
                </Link>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="flex items-center">
                        <CiUser size={20} className="text-blue-950" />
                        <h1 className="sm:block font-bold text-blue-950 italic ml-2">
                            Hi...{user?.firstName} {user?.lastName}
                        </h1>
                    </div>

                    <button
                        onClick={() => setOpenDialog(true)}
                        className="cursor-pointer p-2 hover:bg-orange-400 rounded-full transition-colors"
                    >
                        <CiLogout size={24} className="text-blue-950 hover:text-black" />
                    </button>
                </div>
            </div>

            {openDialog && (
                <AlertDialog.Root open={openDialog} onOpenChange={setOpenDialog}>
                    <AlertDialog.Portal>
                        <AlertDialog.Overlay className="fixed inset-0 bg-black/40 z-60" />
                        <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg z-[70]">
                            <AlertDialog.Title className="text-lg font-semibold text-gray-900">
                                Are you sure you want to logout?
                            </AlertDialog.Title>
                            <div className="flex justify-end gap-4 mt-4">
                                <AlertDialog.Cancel asChild>
                                    <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer">
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

            <div className="fixed bottom-0 left-0 w-full h-16 bg-gray-100 border-t border-gray-200 flex flex-row justify-around items-center px-4 z-50 md:top-16 md:left-0 md:w-20 md:h-[calc(100vh-64px)] md:flex-col md:justify-start md:pt-8 md:border-t-0 md:border-r">
                <Link href="/">
                    <div className={`text-blue-950 p-2 transition-all cursor-pointer ${path === '/' ? "bg-orange-400 rounded-full" : "hover:bg-gray-200 rounded-full"} md:mb-8`}>
                        <IoHomeOutline size={28} />
                    </div>
                </Link>
                <Link href="/products">
                    <div className={`text-blue-950 p-2 transition-all cursor-pointer ${path.includes('products') ? "bg-orange-400 rounded-full" : "hover:bg-gray-200 rounded-full"} md:mb-8`}>
                        <MdOutlineShoppingBag size={28} />
                    </div>
                </Link>
                <Link href="/cart">
                    <div className={`relative text-blue-950 p-2 transition-all cursor-pointer ${path.includes('cart') ? "bg-orange-400 rounded-full" : "hover:bg-gray-200 rounded-full"} md:mb-8`}>
                        <FiShoppingCart size={28} />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-gray-100">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </Link>
                <Link href="/profile">
                    <div className={`text-blue-950 p-2 transition-all cursor-pointer ${path.includes('profile') ? "bg-orange-400 rounded-full" : "hover:bg-gray-200 rounded-full"} md:mb-8`}>
                        <CgProfile size={28} />
                    </div>
                </Link>
            </div>
        </div>
    );
}