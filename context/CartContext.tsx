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
    id: number;
    title: string;
    price: number;
    minimumOrderQuantity: number;
}

export interface CartItem extends Product {
    images: string[];
    discountPercentage: number;
    quantity: number;
}

interface CartState {
    cart: CartItem[];
}

type CartAction =
    | { type: "ADD_TO_CART"; payload: { product: Product, minimumQunatity: boolean } }
    | { type: "REMOVE_FROM_CART"; payload: number }
    | { type: "CLEAR_CART" }
    | { type: "LOAD_CART"; payload: CartItem[] }
    | { type: "INCREASE_QUANTITY", payload: number }
    | { type: "DECREASE_QUANTITY", payload: number };

/* =======================
   CONTEXT TYPE
======================= */

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, minimumOrderQuantity: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    increaseQuantity: (id: number) => void
    decreaseQuantity: (id: number) => void
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
            const { product, minimumOrderQuantity } = action.payload

            const existingItem = state.cart.find(
                (item) => item.id === product.id
            );

            if (existingItem) {
                return {
                    ...state,
                    cart: state.cart.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }

            return {
                ...state,
                cart: [...state.cart, {
                    images: [],
                    discountPercentage: 0,
                    ...product, quantity: minimumOrderQuantity,
                }],
            };
        }

        case "REMOVE_FROM_CART":
            return {
                ...state,
                cart: state.cart.filter((item) => item.id !== action.payload),
            };

        case "CLEAR_CART":
            return { cart: [] };

        case "INCREASE_QUANTITY":
            return {
                ...state,
                cart: state.cart.map((item) => (
                    item.id === action.payload ?
                        { ...item, quantity: Math.max(0, item.quantity + 1) }
                        : item
                )),
            }

        case "DECREASE_QUANTITY":
            return {
                ...state,
                cart: state.cart.map((item) => (
                    item.id == action.payload ?
                        { ...item, quantity: Math.max(0, item.quantity - 1) }
                        : item
                )),
            }

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
        const stored = localStorage.getItem("grabCart");
        if (stored) {
            dispatch({ type: "LOAD_CART", payload: JSON.parse(stored) });
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("grabCart", JSON.stringify(state.cart));
    }, [state.cart]);

    const addToCart = (product: Product, minimumOrderQuantity: number) => {
        dispatch({ type: "ADD_TO_CART", payload: { product, minimumOrderQuantity } });
    };

    const removeFromCart = (id: number) => {
        dispatch({ type: "REMOVE_FROM_CART", payload: id });
    };

    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" });
    };

    const increaseQuantity = (id: number) => {
        dispatch({ type: "INCREASE_QUANTITY", payload: id })
    }

    const decreaseQuantity = (id: number) => {
        dispatch({ type: "DECREASE_QUANTITY", payload: id })
    }

    return (
        <CartContext.Provider
            value={{
                cart: state.cart,
                addToCart,
                removeFromCart,
                clearCart,
                increaseQuantity,
                decreaseQuantity,
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