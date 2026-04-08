"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    id: string;
    username: string;
    email: string;
    image?: string;
}
interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    loading : boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        const savedUser = localStorage.getItem("grabUserData");
        if (savedUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(JSON.parse(savedUser));
        }
        setLoading(false)
    }, []);
    const logout = () => {
        localStorage.removeItem("grabToken");
        localStorage.removeItem("grabUserData");
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};