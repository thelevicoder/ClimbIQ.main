import React, { useRef, useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Chip } from "@mui/material";
import { API_URL } from '../utils';

export const GradingCanvas = ({
  image,
  imageFile,
  imagePreviewUrl,
  onPreviewReady,
  contourPreview,
  contourMetadata,
  onReview,
  setStatus,
  setContourMask,
  setLambdaInputImage,
  setContourDebug,
}) => {
  const canvasRef = useRef(null);
  const [img, setImg] = useState(null);

  const [step, setStep] = useState(0);

  const [leftLine, setLeftLine] = useState(null);
  const [rightLine, setRightLine] = useState(null);

  const [holds, setHolds] = useState([]);
  const [startHold, setStartHold] = useState(null);
  const [endHold, setEndHold] = useState(null);

  useEffect(() => {
    if (!imagePreviewUrl && !image) return;
    const newImg = new window.Image();
    newImg.onload = () => setImg(newImg);
    newImg.src = imagePreviewUrl ? imagePreviewUrl : `data:image/jpeg;base64,${image}`;
  }, [image, imagePreviewUrl]);

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    drawAnnotations(ctx);
  }, [img, leftLine, rightLine, holds, startHold, endHold, step]);

  const drawAnnotations = (ctx) => {
    if (leftLine !== null) {
      ctx.beginPath();
      ctx.strokeStyle = "#ff3e7a";
      ctx.lineWidth = 4;
      ctx.moveTo(leftLine, 0);
      ctx.lineTo(leftLine, ctx.canvas.height);
      ctx.stroke();
    }
    if (rightLine !== null) {
      ctx.beginPath();
      ctx.strokeStyle = "#3effa2";
      ctx.lineWidth = 4;
      ctx.moveTo(rightLine, 0);
      ctx.lineTo(rightLine, ctx.canvas.height);
      ctx.stroke();
    }
    holds.forEach((pt, i) => {
      ctx.beginPath();
      ctx.fillStyle = i === startHold ? "#2a84f6" : i === endHold ? "#b041ff" : "#fcb95b";
      ctx.arc(pt.x, pt.y, 10, 0, 2 * Math.PI);
      ctx.shadowColor = "#8be8ff";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.font = "bold 15px Segoe UI";
      ctx.fillStyle = "#154970";
      ctx.fillText(i + 1, pt.x + 13, pt.y + 4);
    });
  };

  const handleClick = async (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.round(clickX * scaleX);
    const y = Math.round(clickY * scaleY);

    if (step === 0) {
      if (leftLine === null) setLeftLine(x);
      else if (rightLine === null) {
        setRightLine(x);
        setStep(1);
      }
      return;
    }

    if (step === 1) {
      if (!imageFile) {
        alert("No file!");
        return;
      }
      setStatus && setStatus("Detecting contours...");
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("left_line", leftLine);
      formData.append("right_line", rightLine);
      formData.append("color_click_x", x);
      formData.append("color_click_y", y);

      const response = await fetch(`${API_URL}/grade/contour`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (onPreviewReady && result.annotated_image)
        onPreviewReady("data:image/jpeg;base64," + result.annotated_image, result.contour_metadata);

      if (setContourMask && result.mask_image)
        setContourMask("data:image/jpeg;base64," + result.mask_image);
      if (setLambdaInputImage && result.lambda_input_image)
        setLambdaInputImage("data:image/jpeg;base64," + result.lambda_input_image);
      if (setContourDebug)
        setContourDebug({
          reference_color_hsv: result.reference_color_hsv,
          left_line: result.left_line,
          right_line: result.right_line,
          contour_count: result.contour_count,
          error: result.error,
        });

      setStatus && setStatus("Contours detected. Review preview and confirm.");
      setStep(2);
      return;
    }

    if (step === 3) {
      const newHolds = [...holds, { x, y }];
      setHolds(newHolds);
      setStartHold(newHolds.length - 1);
      setStep(4);
      return;
    }

    if (step === 4) {
      const newHolds = [...holds, { x, y }];
      setHolds(newHolds);
      setEndHold(newHolds.length - 1);
      setStep(5);
      return;
    }
  };

  const handleConfirmPreview = () => {
    setStep(3);
  };

  const handleReview = () => {
    if (
      leftLine === null ||
      rightLine === null ||
      startHold === null ||
      endHold === null
    ) {
      alert("Please complete all selections first.");
      return;
    }
    const images = {};
    if (contourMetadata) {
      Object.keys(contourMetadata).forEach((filename) => {
        images[filename] = image;
      });
    }
    onReview &&
      onReview({
        imageBase64: image,
        left_line: Math.min(leftLine, rightLine),
        right_line: Math.max(leftLine, rightLine),
        start_hold: `contour_${startHold}.jpg`,
        end_hold: `contour_${endHold}.jpg`,
        hold_points: holds,
        images,
      });
  };

  const stepInstructions = [
    "Click to set the left and then right wall boundaries.",
    "Click a hold to pick the reference color(main hold color).",
    "Preview the detected contours and confirm.",
    "Click a hold to set the start hold(blue).",
    "Click a hold to set the end hold(purple).",
    "Review and confirm your selections."
  ];

  const handleReset = () => {
    setLeftLine(null);
    setRightLine(null);
    setHolds([]);
    setStartHold(null);
    setEndHold(null);
    setStep(0);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    
      p={2}
      mt={3}
      sx={{
        background: "#FEFAE0",
        borderRadius: "4",
        boxShadow: "0 2px 18px #d8f8ff66",
      }}
    >
      <Paper elevation={2} sx={{
        borderRadius: '16%',
        p: 5,
        mb: 0,
        background: "#528771",
      }}>
        <Typography
          variant="h6"
          align="center"
          fontWeight={750}
          sx={{ color: "#FEFAE0", mb: 2 }}
          dangerouslySetInnerHTML={{ __html: stepInstructions[step] }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
          <canvas
            ref={canvasRef}
            onClick={step !== 2 && step < 5 ? handleClick : undefined}
            style={{
              border: "3px solid #abdef6",
              borderRadius: 20,
              cursor: step !== 2 && step < 5 ? "crosshair" : "not-allowed",
              boxShadow: "0 1px 12px #5fe6f966",
              maxWidth: "90vw",
              maxHeight: "50vh"
            }}
          />
        </Box>
        <Box sx={{ mt: 2, mb: 1, textAlign: "center" }}>
          <Button onClick={handleReset}
                  variant="outlined"
                  color="white"
                  style={{
                    borderRadius: 16,
                    fontWeight: 700,
                    fontSize: 16,
                    background: "maroon"
                  }}>
            Reset
          </Button>
          {step === 2 && contourPreview && (
            <Button style={{ marginLeft: 20, borderRadius: 16, fontWeight: 700, fontSize: 16, background: "#193c59" }}
                    onClick={handleConfirmPreview}
                    variant="contained"
                    color="success"
            >
              Confirm Contour Preview
            </Button>
          )}
          {step === 5 && (
            <Button style={{ marginLeft: 20, borderRadius: 16, fontWeight: 700, fontSize: 16, background: "#193c59" }}
                    onClick={handleReview}
                    variant="contained"
                    color="white"
            >
              Review &amp; Confirm
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
