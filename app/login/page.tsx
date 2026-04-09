"use client";

export const dynamic = "force-dynamic";

import * as Label from "@radix-ui/react-label";
import { Spinner } from '@radix-ui/themes'
import { ToastContainer, toast } from 'react-toastify'

import { useFormik } from "formik";
import Image from "next/image";
import LoginAppLogo from '../../public/LoginAppLogo.png'
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEyeSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
    const { setUser } = useAuth()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [authenticated, setAuthenticated] = useState<boolean>(true)

    const router = useRouter()
    const redirect =
        typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("redirect") || "/"
            : "/";

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        onSubmit: async () => {
            setLoading(true)
            try {
                const res = await fetch('https://dummyjson.com/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: formik.values.username,
                        password: formik.values.password,
                    }),
                })
                const data = await res.json()
                if (res.ok) {
                    localStorage.setItem("grabToken", data.accessToken);
                    localStorage.setItem("grabUserData", JSON.stringify(data));
                    setUser(data);
                    router.replace("/");
                } else {
                    setError(data.message || "Invalid Credentials")
                    return
                }
                // localStorage.setItem("grabToken", data.accessToken)
                await new Promise(r => setTimeout(r, 800))
                router.replace("/")
            } catch (e: unknown) {
                setError(e?.toString() || "Something went wrong...please try again!")
            } finally {
                setLoading(false)
            }
        },
    });

    useEffect(() => {
        const isUserAlreadyLogin = Boolean(localStorage.getItem("grabToken"))
        if (isUserAlreadyLogin) {
            router.replace(redirect)
        } else {
            setAuthenticated(false)
        }
    }, [router, redirect])

    if (authenticated) {
        return <div className="min-h-screen bg-white" />;
    }

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen">
            <ToastContainer
                toastClassName={() =>
                    "bg-blue-950 text-white rounded-lg px-4 py-3 w-60 flex items-center justify-start"
                }
            />
            <div className="hidden md:flex w-1/2 items-center justify-center bg-blue-50">
                <Image
                    src={LoginAppLogo}
                    alt="logo"
                    className="object-contain h-[80%] w-auto"
                />
            </div>

            {/* mobile device */}
            <div className="md:hidden flex justify-between items-center w-full pl-5 pr-5">
                <div className="md:flex w-1/2 items-center justify-center -ml-7.5">
                    <Image
                        src={LoginAppLogo}
                        alt="logo"
                        className="object-contain h-[30%] w-[80%]"
                    />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-blue-950 text-center">
                    Sign in
                </h1>
            </div>

            <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6">
                <div className="w-full max-w-md space-y-6">
                    <h1 className="hidden md:block text-3xl md:text-4xl font-bold text-blue-950 text-center">
                        Sign in
                    </h1>
                    <div className="flex justify-center items-center">
                        {error && <p className="text-red-500">*{error}</p>}
                    </div>
                    <form onSubmit={formik.handleSubmit} className="space-y-5">
                        <div className="flex flex-col space-y-2">
                            <Label.Root className="text-sm font-medium text-gray-700">
                                Username
                            </Label.Root>
                            <input
                                name="username"
                                type="text"
                                placeholder="Enter your username"
                                onChange={formik.handleChange}
                                value={formik.values.username}
                                className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-950 transition"
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label.Root className="text-sm font-medium text-gray-700">
                                Password
                            </Label.Root>

                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-950 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                                >
                                    {showPassword ? <FaRegEyeSlash /> : <IoEyeOutline />}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="button" className="text-blue-900 underline cursor-pointer" onClick={(e) => e.stopPropagation()}>Forgot password...?</button>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative w-full bg-blue-950 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center cursor-pointer"
                        >
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Spinner size="2" />
                                </div>
                            )}
                            <span className={loading ? "invisible" : "visible"}>
                                Login
                            </span>
                        </button>
                    </form>
                    <button
                        type="button"
                        className="w-full bg-blue-950 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition cursor-pointer"
                        onClick={() => {
                            toast.info('Feature coming soon!', {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: false,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                            });
                        }}
                    >
                        Don&apos;t have account...? Create one
                    </button>

                    {/* <Toast.Provider swipeDirection="right">
                        <Toast.Root
                            open={open}
                            onOpenChange={setOpenToast}
                            className="bg-white rounded-md shadow-lg p-4 grid grid-cols-[auto_max-content] gap-x-4 items-center data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-out"
                            duration={2000}
                            type="foreground"
                        >
                            <div className="flex flex-col gap-1">
                                <Toast.Title className="font-bold text-slate-900 text-sm">Success</Toast.Title>
                                <Toast.Description className="text-slate-600 text-xs">
                                    Account created successfully
                                </Toast.Description>
                            </div>
                        </Toast.Root>
                        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
                    </Toast.Provider> */}
                </div>
            </div>
        </div>
    );
}