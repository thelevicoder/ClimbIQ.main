import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AddUserForm } from './components/add-user-form';
import CssBaseline from '@mui/material/CssBaseline';
import { HomepageForm } from './components/home-page'
import { ViewCart } from './components/view-cart-page';
import { LoginForm } from './components/login';
import { DeleteUserForm } from './components/delete-user'
import { UpdateUserForm } from './components/update-user';
import { LogoutPage } from './components/logout'; 
import { ShopPage } from './components/shop-page';
import { UserProvider } from './Contexts/UserContext';
import { PrintPage } from './components/3d-print-page';
import { AddToCart } from './components/add-to-cart';
import { ItemProvider } from './Contexts/ItemContext';
import { CartProvider } from './Contexts/CartContext';
import { UserCartProvider } from './Contexts/UserCartContext';


const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    <ItemProvider>
      <CartProvider>
        <UserCartProvider>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <BrowserRouter>
              <Routes>
                <Route path="/create-account" element={<AddUserForm />} />
                <Route path="/" element={<HomepageForm/>} />
                <Route path="/login" element={<LoginForm/>} />
                <Route path="/delete-account" element={<DeleteUserForm />}/>
                <Route path="/update-account" element={<UpdateUserForm />}/>
                <Route path="/logout" element={<LogoutPage />}/>
                <Route path="/shop" element={<ShopPage />}/>
                <Route path="/print" element={<PrintPage />}/>
                <Route path="/add-cart" element={<AddToCart />}/>
                <Route path="/cart" element={<ViewCart />}/>
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </UserCartProvider>
      </CartProvider>
    </ItemProvider>
  </UserProvider>
);




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals



