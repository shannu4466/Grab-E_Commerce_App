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
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const savedUser = localStorage.getItem("grabUserData");
        if (savedUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUser(JSON.parse(savedUser));
        }
    }, []);
    const logout = () => {
        localStorage.removeItem("grabToken");
        localStorage.removeItem("grabUserData");
        setUser(null);
    };
    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
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