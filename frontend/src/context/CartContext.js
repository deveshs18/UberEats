import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const addToCart = (item) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            const updatedCart = cart.map(cartItem =>
                cartItem.id === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
        
        setTotal(prevTotal => prevTotal + item.price);
    };

    const removeFromCart = (itemId) => {
        const itemToRemove = cart.find(item => item.id === itemId);
        if (itemToRemove) {
            setTotal(prevTotal => prevTotal - (itemToRemove.price * itemToRemove.quantity));
            setCart(cart.filter(item => item.id !== itemId));
        }
    };

    const updateQuantity = (itemId, change) => {
        const item = cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            const newQuantity = item.quantity + (typeof change === 'number' ? change : 0);
            
            if (newQuantity <= 0) {
                // Remove item if quantity becomes 0 or negative
                setCart(cart.filter(cartItem => cartItem.id !== itemId));
                setTotal(prevTotal => prevTotal - (item.price * item.quantity));
            } else {
                // Update quantity
                setCart(cart.map(cartItem =>
                    cartItem.id === itemId
                        ? { ...cartItem, quantity: newQuantity }
                        : cartItem
                ));
                setTotal(prevTotal => prevTotal + (item.price * (change)));
            }
        }
    };

    const clearCart = () => {
        setCart([]);
        setTotal(0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            total,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 