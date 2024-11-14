import TextField from '@mui/material/TextField';
import { Button, Typography } from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import { API_URL } from "../utils";
import { LoadingButton } from '@mui/lab';
import DeleteIcon from "@mui/icons-material/Delete"
import DoDisturbIcon from '@mui/icons-material/DoDisturb';


export const UpdateUserForm = () => {
    const location = useLocation();
    const { state } = location;
    const [currentUser, setCurrentUser] = useState(state);
    const navigate = useNavigate();
    console.log(currentUser)

    const password = currentUser.password
  const [newFirst, setNewFirst] = useState(currentUser.firstName);
  const [newLast, setNewLast] = useState(currentUser.lastName);
  const [newEmail, setNewEmail] = useState(currentUser.email);
  const [isUpdated, setIsUpdated] = useState(false);

  const editUser = async () => {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'none'
        },
        body: JSON.stringify({
          email: currentUser.email,
          updateFirstVal: newFirst,
          updateLastVal: newLast,
          updatePasswordIDVal: password
        }),
        mode: 'cors'
      });
      setCurrentUser({
        password: password,
        firstName: newFirst,
        lastName: newLast,
        email: newEmail
      })
  
      const result = await response.json();
      setIsUpdated(true)
      console.log(result);
      console.log(JSON.stringify(currentUser));
      // Handle the response data here
    } catch (error) {
      console.error(error);
    }
  };

  const CancelEditUser = () => {
    console.log(currentUser);
    navigate('/');
  }

  const PressDeleteUser = () => {
    console.log(currentUser);
    navigate('/delete-account');
  }

  useEffect(() => {
    console.log(currentUser);
    if (isUpdated) {
      navigate('/', { state: currentUser });
      setNewFirst("");
      setNewLast("");
      setNewEmail("");
      setIsUpdated(false);
    }
  }, [isUpdated, currentUser]);

    return (
        <div className='loginBody'>
          <div className='rectangle'>
            <div className="logo-container">
              <img src="thatpivc.png" alt="ClimbIQ Logo" className="logo"/>
              <span className="logo-text">ClimbIQ</span>
            </div>
            <Typography align="left" variant="h6" sx={{paddingTop: "2", paddingBottom: "2"}}>
              Update your ClimbIQ™ account
            </Typography>
            <div className='addUserForm'>
              <TextField fullWidth size='small'
                id="outlined-basic"
                label="First Name"
                name='firstName'
                variant="outlined"
                value={newFirst}
                onChange={(e) => setNewFirst(e.target.value)}
              />
              <TextField fullWidth size='small'
              id="outlined-basic"
              label="Last Name"
              name='lastName'
              variant="outlined"
              value={newLast}
              onChange={(e) => setNewLast(e.target.value)} 
              />
            </div>
            <div className='addUserForm'>
              <TextField fullWidth size='small'
                id="email"
                label="Email"
                variant="outlined"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                name='email'
              />
            </div>
            <div className='addUserForm'>
          <Button size='big' disabled={!newFirst || !newLast || !newEmail}
          variant='outlined' onClick={CancelEditUser} sx={{paddingTop: "2", width: "50%"}}>
           <DoDisturbIcon/>Cancel
          </Button>
          <Button size='big' disabled={!newFirst || !newLast || !newEmail}
          variant='outlined' onClick={editUser} sx={{paddingTop: "2", width: "50%"}}>
           <TaskIcon/>Save
          </Button>
          </div>
          <LoadingButton size='big'
          variant='outlined' color="error" onClick={PressDeleteUser}   sx={{ width: '100%' }}
          paddingTop={2}>
          <DeleteIcon/>Delete Account
          </LoadingButton>
          <div className='tinytext'>
          </div>
        </div>
        </div>
      )
}
