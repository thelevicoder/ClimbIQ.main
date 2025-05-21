import React, { useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";

export const ImageUploader = ({ userEmail }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [wallAngle, setWallAngle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [vGrade, setVGrade] = useState("");
  const [routeImageUrl, setRouteImageUrl] = useState("");

  const apiBaseUrl = "https://g6cwxw4zrh.execute-api.us-east-1.amazonaws.com/prod";

  // Utility: Upload image to S3 via presigned URL, return S3 key.
  const uploadImageToS3 = async (file) => {
    // 1. Ask backend for a presigned URL (send contentType)
    const presignRes = await fetch(`${apiBaseUrl}/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type, // <-- KEY: tell Lambda actual file type
      }),
    });
    if (!presignRes.ok) throw new Error("Failed to get upload URL");
    const { uploadUrl, key } = await presignRes.json();

    // 2. Upload to S3 with proper headers
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "image/jpeg",
      },
      body: file,
    });
    if (!putRes.ok) throw new Error("S3 upload failed");
    return key;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage("");
      setError(null);
      setVGrade("");
      setRouteImageUrl("");
    }
  };

  const handleWallAngleChange = (event) => {
    setWallAngle(event.target.value);
    setError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return setError("Please select an image.");
    if (!wallAngle) return setError("Please enter the wall angle.");
    if (!userEmail) return setError("Missing user email.");

    setLoading(true);
    setMessage("");
    setError(null);

    try {
      // 1. Upload to S3 and get s3Key
      const s3Key = await uploadImageToS3(selectedFile);

      // 2. Call backend to process/grade climb by S3 key
      const processRes = await fetch(`${apiBaseUrl}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          s3Key,
          wallAngle: parseFloat(wallAngle),
          userId: userEmail,
          tags: ["climb_iq"],
        }),
      });
      if (!processRes.ok) throw new Error("Failed to process climb");

      const data = await processRes.json();
      setMessage("Grading complete!");
      setVGrade(data.vGrade);
      setRouteImageUrl(data.routeImageUrl);
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      margin: "20px",
      padding: "10px",
      borderRadius: "10px",
      backgroundColor: `#FEFAE0`,
      paddingTop: "90px",
      position: `relative`,
    }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="fileInput">Select Image: </label>
          <input
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
          {selectedFile && (
            <p>
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <TextField
            type="number"
            id="wallAngleInput"
            value={wallAngle}
            onChange={handleWallAngleChange}
            placeholder="e.g., 30"
            disabled={loading}
            label="Wall Angle (degrees)"
            style={{ width: "100%" }}
            min="0"
            max="90"
            step="1"
            required
          />
        </div>
        <LoadingButton
          type="submit"
          disabled={loading || !selectedFile || !wallAngle || !!error}
        >
          {loading ? "Processing..." : "Grade Climb"}
        </LoadingButton>
      </form>
      {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {(vGrade || routeImageUrl) && (
        <div style={{
          marginTop: "20px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}>
          <h3>Result</h3>
          {vGrade && <p><strong>V-Scale Grade:</strong> {vGrade}</p>}
          {routeImageUrl && (
            <div>
              <p><strong>Route Visualization:</strong></p>
              <img
                src={routeImageUrl}
                alt="Climb Route"
                style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
