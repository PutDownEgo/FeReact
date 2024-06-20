import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { UseLocalStorage } from "./UseLocalStorage";
import { Coupon } from '../models/Coupon';
import { set } from "lodash";

type ShoppingCartContext = {
    getItemQuantity: (id: number) => number;
    increaseItemQuantity: (id: number) => void;
    decreaseItemQuantity: (id: number) => void;
    putItemInCartWithQuantity: (id: number, quantity: number) => void;
    removeItemFromCart: (id: number) => void;
    doSetCoupon: (coupon: Coupon) => void;
    coupon: Coupon | null;
    cartQuantity: number;
    cartItems: CartItem[];
    clearCart: () => void;
}

const ShoppingCartContext = createContext({} as ShoppingCartContext);

type ShoppingCartContextProps = {
    children: React.ReactNode;
}

type CartItem = {
    id: number;
    quantity: number;

}



export function useShoppingCart() {
    return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartContextProps) {
    const [coupon, setCouponState] = useState<Coupon | null>(null);

    const [cartItems, setCartItems] = UseLocalStorage<CartItem[]>("cartItems", []);

    const cartQuantity = cartItems.reduce((quantity, item) => quantity + item.quantity, 0);
    const [discount, setDiscount] = useState<number>(0);


    // function calculateDiscount() {
    //     if (coupon) {
    //         const subtotal = cartItems.reduce((total, item) => total + item.quantity * getProductPrice(item.id), 0);
    //         setDiscount(subtotal * coupon.discount);
    //     } else {
    //         setDiscount(0);
    //     }
    // }

    function getItemQuantity(id: number) {
        const item = cartItems.find(item => item.id === id);
        return item ? item.quantity : 0;
    }

    function increaseItemQuantity(id: number) {
        setCartItems(currentItems => {
            const itemIndex = currentItems.findIndex(item => item.id === id);
            if (itemIndex >= 0) {
                const newCartItems = [...currentItems];
                newCartItems[itemIndex] = { ...newCartItems[itemIndex], quantity: newCartItems[itemIndex].quantity + 1 };

                return newCartItems;
            } else {
                return [...currentItems, { id, quantity: 1 }];
            }
        });
    }

    function decreaseItemQuantity(id: number) {
        setCartItems(currentItems => {
            const itemIndex = currentItems.findIndex(item => item.id === id);
            if (itemIndex >= 0 && currentItems[itemIndex].quantity > 1) {
                const newCartItems = [...currentItems];
                newCartItems[itemIndex] = { ...newCartItems[itemIndex], quantity: newCartItems[itemIndex].quantity - 1 };
                return newCartItems;
            } else {
                return currentItems.filter(item => item.id !== id);
            }
        });
    }

    function putItemInCartWithQuantity(id: number, quantity: number) {
        setCartItems(currentItems => {
            const itemIndex = currentItems.findIndex(item => item.id === id);
            if (itemIndex >= 0) {

                const newCartItems = [...currentItems];
                newCartItems[itemIndex] = { ...newCartItems[itemIndex], quantity: newCartItems[itemIndex].quantity + quantity };
                return newCartItems;
            } else {
                return [...currentItems, { id, quantity }];
            }
        });
    }

    function removeItemFromCart(id: number) {
        setCartItems(currentItems => currentItems.filter(item => item.id !== id));
    }
    function doSetCoupon(coupon: Coupon) {
        setCouponState(coupon);
    }
    function clearCart() {
        setCartItems([]);
    }



    return <ShoppingCartContext.Provider
        value={{
            getItemQuantity,
            increaseItemQuantity,
            decreaseItemQuantity,
            removeItemFromCart,
            putItemInCartWithQuantity,
            doSetCoupon,
            clearCart,
            cartItems,
            cartQuantity,
            coupon
        }}>

        {children}

    </ShoppingCartContext.Provider>;
}