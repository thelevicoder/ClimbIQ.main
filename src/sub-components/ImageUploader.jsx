import React, { useState } from 'react';

export const ImageUploader = ({ userId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const apiUrl = 'https://g6cwxw4zrh.execute-api.us-east-1.amazonaws.com/prod/upload';

  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage('');
      setError(null);
    }
  };


  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError('Please select an image to upload.');
      return;
    }

    if (!userId) {
      setError('User ID is required. Please log in.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError(null);

    try {

      const imageBase64 = await convertToBase64(selectedFile);


      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

     
      const requestBody = {
        userId: userId,
        imageBase64: imageBase64,
        tags: tagsArray.length > 0 ? tagsArray : ['default'],
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      setMessage(`Image uploaded successfully! Image ID: ${data.imageId}`);
      setSelectedFile(null);
      setTags('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Upload an Image</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="fileInput">Select Image: </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
          {selectedFile && (
            <p>Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)</p>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="tagsInput">Tags (comma-separated, optional): </label>
          <input
            type="text"
            id="tagsInput"
            value={tags}
            onChange={handleTagsChange}
            placeholder="e.g., nature, climbing"
            disabled={loading}
            style={{ width: '100%', padding: '5px' }}
          />
        </div>

        <button type="submit" disabled={loading || !selectedFile}>
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>

      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

