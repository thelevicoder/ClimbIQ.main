import { useNavigate } from 'react-router-dom';
import React, { useEffect, useContext, useState } from "react";
import { PageLayout } from '../sub-components/sidebar-topbar';
import Typography from '@mui/material/Typography';
import { UserContext } from '../Contexts/UserContext';
import { API_URL } from '../utils';
import { GradingCanvas } from '../sub-components/GradingCanvas';

export const ImageUploadForm = () => {
  console.log("API_URL is:", API_URL);

  const { setCurrentUser, currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [imageBase64, setImageBase64] = useState("");
  const [status, setStatus] = useState("");
  const [finalGrade, setFinalGrade] = useState(null);

  useEffect(() => {
    if (!currentUser || !currentUser.email) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      setImageBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleGradingInput = async ({
    imageBase64,
    left_line,
    right_line,
    reference_color_hsv,
    start_hold,
    end_hold
  }) => {
    setStatus("Running contour detection...");
    try {
      const contourRes = await fetch(`${API_URL}/grade/contour`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, left_line, right_line, reference_color_hsv }),
      });
      const contourData = await contourRes.json();
      const metadata = contourData.contour_metadata;

      if (!metadata || Object.keys(metadata).length === 0) {
        setStatus("No contours found.");
        return;
      }

      setStatus("Grading holds...");

      const fakeImages = {};
      for (const key of Object.keys(metadata)) {
        fakeImages[key] = imageBase64; // placeholder
      }

      const gradeHoldRes = await fetch(`${API_URL}/grade/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata, images: fakeImages }),
      });

      const holdData = await gradeHoldRes.json();
      const gradedMetadata = holdData.updated_metadata;

      setStatus("Calculating route grade...");

      const gradeRouteRes = await fetch(`${API_URL}/grade/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metadata: gradedMetadata,
          wall_angle: 20,
          start_hold,
          end_hold,
          // ← NEW: send the full original image for S3 persistence
          full_image: imageBase64,
          user_email: currentUser.email,

        }),
      });

      const routeData = await gradeRouteRes.json();
      setFinalGrade(routeData.grade);
      setStatus("Grading complete.");
    } catch (err) {
      console.error("Grading failed:", err);
      setStatus("An error occurred during grading.");
    }
  };

  if (!currentUser) return null;

  return (
    <div className='homepageBackground'>
      <PageLayout user={currentUser} setUser={setCurrentUser} />

      <div style={{ padding: "2rem", marginTop: "6rem" }}>
        <Typography variant="h5" gutterBottom>
          Upload Climbing Wall Image
        </Typography>

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {imageBase64 && (
          <div style={{ marginTop: "2rem" }}>
            <GradingCanvas image={imageBase64} onSubmit={handleGradingInput} />
          </div>
        )}

        <div style={{ marginTop: "1rem" }}>
          <strong>Status:</strong> {status}
        </div>

        {finalGrade && (
          <Typography variant="h6" style={{ marginTop: "1rem" }}>
            🧗 Final Route Grade: <strong>{finalGrade}</strong>
          </Typography>
        )}
      </div>
    </div>
  );
};
