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

    if (loading) return <div>Loading...</div>;

    if (!user) return null;

    return <>{children}</>;
}