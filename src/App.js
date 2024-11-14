import { AddUserForm } from './components/AddUserForm';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useState, useEffect } from "react";
import { User } from "./components/User";
import axios from "axios";
import { API_URL } from "./utils";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  const [users, setUsers] = useState([]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(API_URL);

      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <AddUserForm />
        {users.map((user) => (
        <User user={user} key={user.UserID} fetchUser={fetchUser} />
        ))}
    </ThemeProvider>
  )
}
