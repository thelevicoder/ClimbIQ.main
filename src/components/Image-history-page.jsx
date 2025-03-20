import { useNavigate } from 'react-router-dom';
import React, { useEffect, useContext } from "react";
import { PageLayout } from '../sub-components/sidebar-topbar';
import Typography from '@mui/material/Typography';
import { Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import { UserContext } from '../Contexts/UserContext';
import { ImageUploader } from '../sub-components/ImageUploader';
import { ImageGallery } from '../sub-components/ImageGallery';

export const ImageHistoryForm = () => {
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

  if (currentUser) {
    return (
      <div className='homepageBackground'>
        
      <PageLayout
      user={currentUser}
      setUser={setCurrentUser}
      />
        <ImageGallery userId={currentUser.email} />
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
