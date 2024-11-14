import { createContext, useState } from 'react'

const CartContext = createContext();
const CartProvider = ({ children }) => {
    const [currentCart, setCurrentCart] = useState([]);
    return (
        <CartContext.Provider value={{ currentCart, setCurrentCart }}>
            {children}
        </CartContext.Provider>
        );
    };

export { CartProvider, CartContext };