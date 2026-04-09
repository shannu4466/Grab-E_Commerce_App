"use client"

import Image from "next/image";

import Sidebar from "@/components/sidebar";
import homePage from "../public/homePage.png"

export default function Home() {
  return (
    <div className="flex bg-zinc-50 font-sans h-screen">
      <Sidebar />
      <div className="mt-[20%] md:mt-[7%] ml-[10%] md:w-full flex flex-col items-center text-blue-950">
        <Image src={homePage} alt="image" width={600} height={500} />
        <h1 className="text-md md:text-3xl w-[60%]">Grab - <span className="font-bold">Everything You Need, Delivered Fast</span></h1>
        <p className="w-[60%]">Discover a smarter way to shop with Grab. From everyday essentials to trending products,
          we bring you quality, affordability, and convenience all in one place.
          Enjoy seamless browsing, secure payments, and lightning-fast delivery—because you deserve the best, instantly.
        </p>
      </div>
    </div >
  );
}
