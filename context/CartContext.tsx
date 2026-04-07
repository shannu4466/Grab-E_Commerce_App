"use client";

import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    ReactNode,
} from "react";

/* =======================
   TYPES
======================= */

export interface Product {
    id: string;
    title: string;
    price: number;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    cart: CartItem[];
}

type CartAction =
    | { type: "ADD_TO_CART"; payload: Product }
    | { type: "REMOVE_FROM_CART"; payload: string }
    | { type: "CLEAR_CART" }
    | { type: "LOAD_CART"; payload: CartItem[] };

/* =======================
   CONTEXT TYPE
======================= */

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
}

/* =======================
   CONTEXT
======================= */

const CartContext = createContext<CartContextType | undefined>(undefined);

/* =======================
   REDUCER
======================= */

const initialState: CartState = {
    cart: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_TO_CART": {
            const existingItem = state.cart.find(
                (item) => item.id === action.payload.id
            );

            if (existingItem) {
                return {
                    ...state,
                    cart: state.cart.map((item) =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }

            return {
                ...state,
                cart: [...state.cart, { ...action.payload, quantity: 1 }],
            };
        }

        case "REMOVE_FROM_CART":
            return {
                ...state,
                cart: state.cart.filter((item) => item.id !== action.payload),
            };

        case "CLEAR_CART":
            return { cart: [] };

        case "LOAD_CART":
            return { cart: action.payload };

        default:
            return state;
    }
}

/* =======================
   PROVIDER
======================= */

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("cart");
        if (stored) {
            dispatch({ type: "LOAD_CART", payload: JSON.parse(stored) });
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state.cart));
    }, [state.cart]);

    const addToCart = (product: Product) => {
        dispatch({ type: "ADD_TO_CART", payload: product });
    };

    const removeFromCart = (id: string) => {
        dispatch({ type: "REMOVE_FROM_CART", payload: id });
    };

    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" });
    };

    return (
        <CartContext.Provider
            value={{
                cart: state.cart,
                addToCart,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

/* =======================
   CUSTOM HOOK
======================= */

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }

    return context;
}