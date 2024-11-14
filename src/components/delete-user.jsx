import TextField from '@mui/material/TextField';
import { Button, Typography } from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../Contexts/UserContext';
import { API_URL } from "../utils";
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormHelperText } from '@mui/material';


// Define the LoginForm component
export const DeleteUserForm = () => {
    const location = useLocation();
    const { setCurrentUser, currentUser } = useContext(UserContext);
    console.log(currentUser)
    const [tPassword, setTPassword] = useState("")
    const [allUsers, setAllUsers] = useState({})
    const [newUserID, setnewUserID] = useState("")
    const [correct, setCorrect] = useState(false)

    const navigate = useNavigate();
    useEffect(() => {
      if (currentUser == null) {
        console.log(currentUser);
        navigate('/login');
      }
    }, [currentUser]);
  
  // Function to handle form submissions
  const DeleteUser = async () => {
    if (tPassword === currentUser.password) {
      const response = await fetch(`${API_URL}/user`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'none'
        },
        body: JSON.stringify({
          password: tPassword,
        }),
        mode: 'cors'
      });
      setCurrentUser({
        UserID: null,
        OrgID: null,
        firstName: null,
        lastName: null,
        Email: null,
        password: null
      })
  
      const result = await response.json();
      console.log(result);
      console.log(JSON.stringify(currentUser));
      navigate('/login');
      // Handle the response data here
    } else {
      setCorrect(true)
    }
  };
    
  return (
    <loginBody>
      <div className='rectangle' >
        <div className="logo-container">
          <img src="thatpivc.png" alt="ClimbIQ Logo" className="logo"/>
          <span className="logo-text">ClimbIQ</span>
        </div>
        <Typography 
          align="left" 
          variant="h6" 
          paddingTop={2} 
          paddingBottom={2}>
          {currentUser?.firstName}, we are sad to see you go. We're sorry to see you go and would love to hear if there's anything we can do to make you stay. If you’re sure about your decision, we’ll respect it and proceed. We wil forever long having you as a part of the ClimbIQ™ community, But if there’s something we can improve, please let us know. Thank you for being a valuable part of ClimbIQ™ and we hope to see you again very soon!
        </Typography>
          <TextField 
            fullWidth size='small'
            id="outlined-basic"
            color={ correct ? 'error' : 'primary' }
            label="Password"
            variant="outlined"
            value={tPassword}
            onChange={(e) => setTPassword(e.target.value)}
            name='OrgID'/>
            <FormHelperText error={correct}>{correct ? "Passwords do not match" : ""}</FormHelperText>
        <div className='logo-container' style={{ textAlign: 'center' }}></div>
        <div style={{ textAlign: 'center'}}>
          <LoadingButton 
            size='big' 
            disabled={!tPassword } 
            color='error'
            variant='outlined' 
            onClick={DeleteUser} 
            paddingTop={2} 
            sx={{ width: '75%' }}
          >
            <DeleteIcon />Delete
          </LoadingButton>
        </div>
        <div className='tinytext'>
          By deleting your ClimbIQ account, you have aknowledged that this is a permanant change and you will no longer be a part of ClimbIQ™.
        </div>
        <div></div>
      </div>
    </loginBody>
  );
}