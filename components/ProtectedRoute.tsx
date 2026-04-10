"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const publicRoutes = ["/login"];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isPublic = publicRoutes.includes(pathname);

    useEffect(() => {
        if (!loading && !user && !isPublic) {
            router.replace(`/login?redirect=${pathname}`);
        }
    }, [user, loading, pathname, router, isPublic]);

    if (isPublic) return <>{children}</>;

    if (loading)
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>
        )


    if (!user) return null;

    return <>{children}</>;
}