import { createContext, useState } from 'react'

const UserContext = createContext();
const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState([]);
    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
        );
    };

export { UserProvider, UserContext };