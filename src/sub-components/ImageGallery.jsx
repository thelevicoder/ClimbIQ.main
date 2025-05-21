import React, { useEffect, useState, useContext } from 'react';
import { API_URL } from '../utils';
import { Card, CardMedia, CardContent, Typography, Grid, Box } from '@mui/material';
import { UserContext } from '../Contexts/UserContext';

export const ImageGallery = () => {
  const [history, setHistory] = useState([]);
  const [error, setError]     = useState(null);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    // Only run if a user is logged in
    if (!currentUser || !currentUser.email) return;

    setError(null);
    setHistory([]);
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
  }, [currentUser]);

  if (!currentUser || !currentUser.email) {
    return <Typography color="error">Please log in to view your image history.</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!history.length) {
    return (
      <Box sx={{ p: 4, pt: 18, textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: "#528771" }}>No climbs found! Upload and grade your first route to see it here.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, pt: 15 }}>
      <Grid container spacing={3}>
        {history.map(item => (
          <Grid item key={item.id || item.s3_key} xs={12} sm={6} md={4} lg={3}>
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
              {item.image_url ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image_url}
                  alt={item.grade ? `Route graded ${item.grade}` : "Climb image"}
                  sx={{
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    objectFit: 'cover',
                    background: "#ececec",
                  }}
                />
              ) : (
                <Box sx={{height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: "#eee"}}>
                  <Typography variant="caption" color="error">No image URL found</Typography>
                </Box>
              )}
              {item.image_url && (
                <Typography variant="caption" sx={{wordBreak: "break-all", fontSize: 10}}>{item.image_url}</Typography>
              )}

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
                      color: '#fff',
                      borderRadius: 1,
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                    }}
                  >
                    {item.grade ? `Route graded ${item.grade}` : "Route graded N/A"}
                  </Box>
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {item.timestamp ? new Date(item.timestamp * 1000).toLocaleString() : ""}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
