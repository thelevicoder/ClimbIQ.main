import React, { useEffect, useState, useContext} from 'react';
import { API_URL } from '../utils';
import { Card, CardMedia, CardContent, Typography, Grid, Box } from '@mui/material';
import { UserContext } from '../Contexts/UserContext';

export const ImageGallery = () => {
  const [history, setHistory] = useState([]);
  const [error, setError]     = useState(null);
  const { setCurrentUser, currentUser } = useContext(UserContext);

  useEffect(() => {
    // Fetch the history once when the component mounts
    fetch(`${API_URL}/history?email=${encodeURIComponent(currentUser.email)}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        setHistory(data.history || []);
      })
      .catch(err => {
        console.error("Failed to load history:", err);
        setError("Could not load history.");
      });
  }, []);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 2, pt: 15 }}>
      <Grid container spacing={3}>
        {history.map(item => (
          <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: theme => theme.shadows[8],
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.image_url}
                alt={`Route graded ${item.grade}`}
                sx={{
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  objectFit: 'cover',
                }}
              />
              <CardContent
                sx={{
                  backgroundColor: '#e0c3ad',
                  pt: 2,
                  pb: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      px: 2,
                      py: 0.5,
                      backgroundColor: '#386343',
                      color: 'primary.contrastText',
                      borderRadius: 1,
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    {`Route graded ${item.grade}`}
                  </Box>
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(item.timestamp * 1000).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
