import { createContext, useState } from 'react'

const ItemContext = createContext();
const ItemProvider = ({ children }) => {
    const [currentItem, setCurrentItem] = useState({name: "",
        material: "",
        cost: "",
        description: "",
        colors: [],
        hwl: [],
        isLabeled: false,
        label: ""});
    return (
        <ItemContext.Provider value={{ currentItem, setCurrentItem }}>
            {children}
        </ItemContext.Provider>
        );
    };

export { ItemProvider, ItemContext };