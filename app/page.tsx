"use client"

import Image from "next/image";
import Sidebar from "@/components/sidebar";
import homePage from "../public/homePage.png"
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Grab - Home";
  }, []);

  return (
    <div className="flex flex-col md:flex-row bg-zinc-50 font-sans min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center text-blue-950 px-6 pt-24 pb-20 md:pt-16 md:pb-0 md:ml-20">
        <div className="w-full max-w-150">
          <Image
            src={homePage}
            alt="image"
            width={600}
            height={500}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        <div className="w-full md:w-[70%] lg:w-[60%] text-center md:text-left mt-6">
          <h1 className="text-2xl md:text-4xl lg:text-5xl leading-tight">
            Grab - <span className="font-bold">Everything You Need, Delivered Fast</span>
          </h1>
          <p className="mt-4 text-sm md:text-base lg:text-lg leading-relaxed text-gray-700">
            Discover a smarter way to shop with Grab. From everyday essentials to trending products,
            we bring you quality, affordability, and convenience all in one place.
            Enjoy seamless browsing, secure payments, and lightning-fast delivery—because you deserve the best, instantly.
          </p>
        </div>
      </div>
    </div>
  );
}