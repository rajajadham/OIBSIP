import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("pizzaCart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("pizzaCart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (pizza) => {
        setCart((currentCart) => {
            const existingItem = currentCart.find(
                (item) => item._id === pizza._id
            );

            if (existingItem) {
                return currentCart.map((item) =>
                    item._id === pizza._id
                        ? {
                              ...item,
                              quantity: item.quantity + 1,
                          }
                        : item
                );
            }

            return [
                ...currentCart,
                {
                    ...pizza,
                    quantity: 1,
                },
            ];
        });
    };

    const increaseQuantity = (pizzaId) => {
        setCart((currentCart) =>
            currentCart.map((item) =>
                item._id === pizzaId
                    ? {
                          ...item,
                          quantity: item.quantity + 1,
                      }
                    : item
            )
        );
    };

    const decreaseQuantity = (pizzaId) => {
        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    item._id === pizzaId
                        ? {
                              ...item,
                              quantity: item.quantity - 1,
                          }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (pizzaId) => {
        setCart((currentCart) =>
            currentCart.filter((item) => item._id !== pizzaId)
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalAmount = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                increaseQuantity,
                decreaseQuantity,
                removeFromCart,
                clearCart,
                totalAmount,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
