import React, { useState, useEffect } from 'react';

export const ImageGallery = ({ userId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = 'https://g6cwxw4zrh.execute-api.us-east-1.amazonaws.com/prod/images'; 


  useEffect(() => {
    const fetchImages = async () => {
      if (!userId) {
        setError('User ID is required. Please log in.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${apiUrl}?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch images');
        }

        const data = await response.json();
        setImages(data.images || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [userId]); 

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Your Uploaded Images</h2>
      {loading && <p>Loading images...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && images.length === 0 && <p>No images found.</p>}
      {!loading && !error && images.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {images.map((image) => (
            <div
              key={image.imageId}
              style={{
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '5px',
                textAlign: 'center',
                width: '200px',
              }}
            >
              <img
                src={image.url}
                alt={`Image ${image.imageId}`}
                style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.alt = 'Image failed to load (URL may have expired)';
                  e.target.style.display = 'none';
                }}
              />
              <p>
                <strong>Uploaded:</strong>{' '}
                {new Date(image.uploadDate).toLocaleString()}
              </p>
              <p>
                <strong>Tags:</strong> {image.tags.join(', ')}
              </p>
              <p>
                <strong>Image ID:</strong> {image.imageId}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
