import { useNavigate } from 'react-router-dom';
import React, { useEffect, useContext, useState } from "react";
import { PageLayout } from '../sub-components/sidebar-topbar';
import Typography from '@mui/material/Typography';
import { UserContext } from '../Contexts/UserContext';
import { API_URL } from '../utils';
import { GradingCanvas } from '../sub-components/GradingCanvas';
import { CardContent, Button, Box, Chip, Paper } from '@mui/material';
import { uploadImageToS3 } from '../utils/s3Upload';

export const ImageUploadForm = () => {
  const { setCurrentUser, currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [imageS3Key, setImageS3Key] = useState("");

  const [status, setStatus] = useState("");
  const [finalGrade, setFinalGrade] = useState(null);

  const [step, setStep] = useState(0);
  const [gradingData, setGradingData] = useState(null);

  const [contourPreview, setContourPreview] = useState(null);
  const [contourMask, setContourMask] = useState(null);
  const [lambdaInputImage, setLambdaInputImage] = useState(null);
  const [contourDebug, setContourDebug] = useState({});
  const [contourMetadata, setContourMetadata] = useState(null);

  useEffect(() => {
    if (!currentUser || !currentUser.email) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const stepInstructions = [
    "Upload your climbing wall image.",
    "Set wall boundaries, pick color, choose start/end holds.",
    "Review your selections and submit for grading.",
  ];

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setStep(1);
    setFinalGrade(null);
    setGradingData(null);
    setStatus("");
    setContourPreview(null);
    setContourMetadata(null);

    setStatus("Uploading image to S3...");
    try {
      const s3Key = await uploadImageToS3(file);
      setImageS3Key(s3Key);
      setStatus("Image uploaded. Proceed to annotation.");
    } catch (err) {
      setStatus("Image upload failed.");
      setStep(0);
      return;
    }
  };

  // After canvas review (gradingData includes hold crop images as base64)
  const handleGradingData = (data) => {
    setGradingData(data);
    setStep(2);
  };

  // Final submit to backend
  const handleFinalSubmit = async () => {
    if (!gradingData) {
      setStatus("No grading data to submit.");
      return;
    }
    setStatus("Running hold grading...");
    try {
      // Step 1: Grade individual holds
      const gradeHoldRes = await fetch(`${API_URL}/grade/hold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metadata: contourMetadata,             // Holds from contour step
          images: gradingData.images,            // { filename: base64 }
        }),
      });
      const holdData = await gradeHoldRes.json();
      const gradedMetadata = holdData.updated_metadata;

      setStatus("Calculating route grade...");
      // Step 2: Grade route as a whole
      const gradeRouteRes = await fetch(`${API_URL}/grade/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metadata: gradedMetadata,                     // MUST HAVE hold_type/hold_grade
          wall_angle: 20,
          start_hold: gradingData.start_hold,
          end_hold: gradingData.end_hold,
          full_image_s3_key: imageS3Key,                // Wall image (S3 key)
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
    <div className='homepageBackground' style={{
      minHeight: "100vh",
      fontFamily: "'Quicksand', 'Segoe UI', sans-serif",
    }}>
      <PageLayout user={currentUser} setUser={setCurrentUser} />
      <Box display="flex" flexDirection="column" alignItems="center" mt={8} className='homepageBackground'>
        <CardContent>
          <Typography variant="h4" fontWeight={800} align="center" gutterBottom style={{
            letterSpacing: ".02em", color: "#003d59"
          }}>
            🧗 CLIMB IQ: Route Grader
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
            <Chip
              label={`Step ${step + 1}: ${stepInstructions[step]}`}
              color="primary"
              style={{ fontWeight: 600, fontSize: 18, background: "#528779", color: "#FEFAE0", borderRadius: "18px", padding: "8px 20px" }}
            />
          </Box>

          {step === 0 && (
            <Paper elevation={3} sx={{ p: 2, borderRadius: 4, textAlign: "center", background: "#fffbe9" }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                id="upload-img"
              />
              <label htmlFor="upload-img">
                <Button
                  component="span"
                  variant="contained"
                  color="primary"
                  size="large"
                  style={{
                    borderRadius: 24,
                    background: "linear-gradient(90deg,#49b7f6,#5be2c4 120%)",
                    boxShadow: "0 4px 16px 2px #bef3fc55",
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                >
                  Upload Image
                </Button>
              </label>
            </Paper>
          )}

          {step === 1 && imagePreviewUrl && imageS3Key && (
            <GradingCanvas
              imageFile={imageFile}
              imagePreviewUrl={imagePreviewUrl}
              s3Key={imageS3Key}
              onPreviewReady={(previewBase64, metadata) => {
                setContourPreview(previewBase64);
                setContourMetadata(metadata);
              }}
              contourPreview={contourPreview}
              contourMetadata={contourMetadata}
              onReview={handleGradingData}
              setStatus={setStatus}
              setContourMask={setContourMask}
              setLambdaInputImage={setLambdaInputImage}
              setContourDebug={setContourDebug}
            />
          )}

          {step === 2 && gradingData && (
            <Paper elevation={2} sx={{
              p: 2, mt: 2, borderRadius: 4, background: "#528779"
            }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Review your selections:
              </Typography>
              <ul style={{ fontSize: 17, marginBottom: 18 }}>
                <li><b>Start Hold:</b> {gradingData.start_hold}</li>
                <li><b>End Hold:</b> {gradingData.end_hold}</li>
                <li>
                  <b>Hold Points:</b> {gradingData.hold_points.map((p, i) =>
                    <Chip key={i} label={`(${p.x},${p.y})`} style={{ margin: "0 4px", background: "#003d59", color: "#FEFAE0" }} />
                  )}
                </li>
              </ul>
              <Button
                onClick={handleFinalSubmit}
                variant="contained"
                size="large"
                style={{
                  borderRadius: 18,
                  background: "#528779",
                  fontWeight: 700,
                  fontSize: 17,
                  marginBottom: 12,
                  color: "#FEFAE0",
                }}
              >
                Submit for Grading
              </Button>
            </Paper>
          )}

          {finalGrade && (
            <Paper elevation={3} sx={{
              mt: 3,
              borderRadius: 5,
              background: "linear-gradient(120deg,#def7e7 60%,#fff7ea 100%)",
              p: 2,
              textAlign: "center"
            }}>
              <Typography variant="h5" fontWeight={900} sx={{ color: "#298c50" }}>
                🧗 Final Route Grade: <span style={{ color: "#005b5e", background: "#edfff8", padding: "2px 16px", borderRadius: 14 }}>{finalGrade}</span>
              </Typography>
            </Paper>
          )}
          <Box sx={{ mt: 2, mb: 0 }}>
            {status && (
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#1786a2" }}>
                  Status: {status}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Box>
    </div>
  );
};
