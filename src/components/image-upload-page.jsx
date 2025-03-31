import { useNavigate } from 'react-router-dom';
import React, { useEffect, useContext } from "react";
import { PageLayout } from '../sub-components/sidebar-topbar';
import Typography from '@mui/material/Typography';
import { Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import { UserContext } from '../Contexts/UserContext';
import { ImageUploader } from '../sub-components/ImageUploader';
import { ImageGallery } from '../sub-components/ImageGallery';

export const ImageUploadForm = async () => {
  const { setCurrentUser, currentUser } = await useContext(UserContext);
  const navigate = useNavigate();
console.log('user on homepage:', currentUser)
  useEffect(() => {
    if (currentUser.email == null || undefined) {
      navigate('/login');
    }
  
  }, [currentUser]);
  
  if (!currentUser) {
    return
  }

  const pressPrints = () => {
    navigate('/print')

  }

  if (currentUser) {
    return (
      <div className='homepageBackground'>
        
      <PageLayout
      user={currentUser}
      setUser={setCurrentUser}
      />
      
      <ImageUploader userId={JSON.stringify(currentUser)} />
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
