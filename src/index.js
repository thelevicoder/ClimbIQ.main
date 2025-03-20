import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AddUserForm } from './components/add-user-form';
import CssBaseline from '@mui/material/CssBaseline';
import { HomepageForm } from './components/home-page'
import { ImageHistoryForm } from './components/Image-history-page';
import { ImageUploadForm } from './components/image-upload-page';
import { LoginForm } from './components/login';
import { UserProvider } from './Contexts/UserContext';


const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/upload-image" element={<ImageUploadForm />} />
            <Route path="/create-account" element={<AddUserForm />} />
            <Route path="/" element={<HomepageForm/>} />
            <Route path="/image-history" element={<ImageHistoryForm/>} />
            <Route path="/login" element={<LoginForm/>} />
            {/* <Route path="/delete-account" element={<DeleteUserForm />}/>
            <Route path="/update-account" element={<UpdateUserForm />}/>
            <Route path="/logout" element={<LogoutPage />}/> */}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
  </UserProvider>
);




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals



