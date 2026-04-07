import Image from "next/image";
import Link from "next/link";

import { CiLogout } from "react-icons/ci";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import homepageLogoBgRemover from '../public/homepageLogoBgRemover.png'

export default function Sidebar() {
    const { logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push("/login")
    }
    return (
        <div className="flex flex-col bg-zinc-50 font-sans p-2">
            <div className="flex justify-between items-center h-[15%] w-full fixed mb-[10%]">
                <Link className="h-25 w-40 -ml-11.25 md:-ml-3" href="/">
                    <Image
                        src={homepageLogoBgRemover}
                        alt="logo"
                        width={100}
                        height={100}
                        className="object-contain h-[80%] w-auto"
                    />
                </Link>
                <button onClick={handleLogout} className="cursor-pointer p-2 mr-10">
                    <CiLogout size={24} className="text-blue-950" />
                </button>
            </div>

            <div className="h-[80%] w-[10%] mt-[15%] md:mt-[5%] ml-[2%]  md:ml-0 flex flex-col justify-center items-center fixed">
                <Link href="/">
                    <IoHomeOutline size={36} className="text-blue-950 mb-8 mt-8 cursor-pointer" />
                </Link>
                <Link href="/products">
                    <MdOutlineShoppingBag size={36} className="text-blue-950 mb-8 mt-8 cursor-pointer" />
                </Link>
                <Link href="/cart">
                    <FiShoppingCart size={36} className="text-blue-950 mb-8 mt-8 cursor-pointer" />
                </Link>
                <Link href="/profile">
                    <CgProfile size={36} className="text-blue-950 mb-8 mt-8 cursor-pointer" />
                </Link>
            </div>
        </div >
    );
}