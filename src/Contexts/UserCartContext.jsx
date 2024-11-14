import { createContext, useState } from 'react'

const UserCartContext = createContext();
const UserCartProvider = ({ children }) => {
    const [userCart, setUserCart] = useState([]);
    return (
        <UserCartContext.Provider value={{ userCart, setUserCart }}>
            {children}
        </UserCartContext.Provider>
        );
    };

export { UserCartProvider, UserCartContext };