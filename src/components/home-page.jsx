import { useNavigate } from 'react-router-dom';
import React, { useEffect, useContext } from "react";
import { PageLayout } from '../sub-components/sidebar-topbar';
import Typography from '@mui/material/Typography';
import { Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import { UserContext } from '../Contexts/UserContext';


export const HomepageForm = () => {
  const { setCurrentUser, currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser.email == null) {
      console.log(currentUser);
      navigate('/login');
    }
  
  }, [currentUser]);
  
  console.log('user on homepage:',currentUser)
  if (!currentUser) {
    return
  }

  const pressPrints = () => {
    navigate('/print')

  }

  if (currentUser) {
    return (
      <div className='container'>
        
      <PageLayout
      user={currentUser}
      setUser={setCurrentUser}
      />
      </div>
    )
  } else {    
    return (
      <div>
        <body>
          ERROR DISPLAYING USER INFO
        </body>
      </div>
    )
      
    
}

}
