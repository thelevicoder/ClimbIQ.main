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
        <div className='big-rectangle'>
          <h1 className='title'>Welcome, {currentUser ? currentUser.firstName + " " + currentUser.lastName : ""}!</h1>
          <div className='card-container'>
          <Card sx={{ maxWidth: 1000, maxHeight: 200, borderRadius: 3, marginBottom: 5}}>
      <CardActionArea>
        <CardMedia
          component="img" 
          height="100"
          image="../confettiBacking.jpg"
          alt="green lizarddddddd"
        />
        
        
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Ad For ClimbIQ Sale
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    
    </div>
          <div className='card-container'>
          <Card sx={{ maxWidth: '31%', maxHeight: 200, borderRadius: 3}} onClick={() => pressPrints()}>
      <CardActionArea>
        <CardMedia
          component="img" 
          height="100"
          image="../backgroundSample.jpg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Shop 3D Prints
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    <Card sx={{ maxWidth: '31%', maxHeight: 200, borderRadius: 3}}>
      <CardActionArea>
        <CardMedia
          component="img" 
          height="100"
          image="../backgroundSample.jpg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Services
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    <Card sx={{ maxWidth: '31%', maxHeight: 200, borderRadius: 3}}>
      <CardActionArea>
        <CardMedia
          component="img" 
          height="100"
          image="../backgroundSample.jpg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Recently Purchased
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    </div>
        </div>
        
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
