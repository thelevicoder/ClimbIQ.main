import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate, Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { API_URL } from "../utils";
import HttpsIcon from '@mui/icons-material/Https';
import PersonIcon from '@mui/icons-material/Person';
import InputAdornment from '@mui/material/InputAdornment';
import { useContext } from 'react';
import { UserContext } from '../Contexts/UserContext';



// Define the LoginForm component
export const LoginForm = () => {
  const { setCurrentUser, currentUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState(""); // Email address
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)

  const navigate = useNavigate();

  // Function to handle form submission
  const findUser = async () => {
    setIsLoading(true)
    try {
      console.log(email)
      const response = await fetch(`${API_URL}/user?email=${(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'none'
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("response", response)
      
      console.log("result", `${API_URL}/user?email=${(email)}`);
      setCurrentUser({
        email: result.user.email,
        password: result.user.password,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        cart: result.user.cart,
      }); 
      setError(false)
      // Handle the response data here
    } catch (error) {
      console.error(error);
      setError(true)
      
      
    }
    finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    console.log(currentUser);
    if (Object.keys(currentUser).length) {
      if((password) === (currentUser.password)){
        navigate('/');
      } else {
        console.log("Invalid email or password")
        setError(true)
      }
    }
  }, [currentUser]);

  //Page Body
  return (
    <div className="loginBody" >
      <div className='rectangle'>
        <Typography align='center'>
        <div className="logo-container">
          <img src="thatpivc.png" alt="ClimbIQ Logo" className="logo"/>
          <span  className="logo-text">ClimbIQ</span>
        </div>
        </Typography>
        <Typography align="left" variant="h6" paddingTop={2} paddingBottom={2} fontSize='1.2vw'>
          Login to your ClimbIQ account
        </Typography>
        <div className='userForm'>
          <TextField fullWidth size='small'
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 10,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            id="email"
            label="Email"
            variant="outlined"
            error={error}
            value={email}
            onChange={(e) => setEmail(e.target.value) && setError(false)}
            name='email'
            />
        </div>
        <div className='userForm'>
          <TextField fullWidth size='small'
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: 10,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HttpsIcon />
                </InputAdornment>
              ),
            }}
            type='password'
            id="outlined-basic"
            label="Password"
            variant="outlined"
            error={error}
            helperText={error ? "Invalid email or password" : ""}
            value={password}
            onChange={(e) => setPassword(e.target.value) && setError(false)}
            name='password'
            />
        </div>
        <LoadingButton fullWidth loading={isLoading} size='big' disabled={!email.length || !email.length}
          variant='contained' onClick={findUser} sx={{paddingTop: "2", borderRadius: 5}}>
          SIGN IN
        </LoadingButton>
        <div className='tinytext'>
          <br/>
          By logging into your ClimbIQ account, you accept all of the ClimbIQ terms and conditions
        </div>
        <div className='tinytext'>
          Dont have an account? Create one <Link to='/create-account'>here</Link>
        </div>
      </div>
    </div>
  );
}
