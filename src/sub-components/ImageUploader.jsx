import React, { useState, useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";

export const ImageUploader = ({ userEmail }) => {
  // Log when the component renders
  console.log("ImageUploader - Component is rendering");
  console.log("ImageUploader - userEmail prop:", userEmail);

  const [selectedFile, setSelectedFile] = useState(null);
  const [tags, setTags] = useState("");
  const [wallAngle, setWallAngle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [vGrade, setVGrade] = useState("");
  const [routeImageUrl, setRouteImageUrl] = useState("");
  const [requestId, setRequestId] = useState("");

  const apiBaseUrl =
    "https://g6cwxw4zrh.execute-api.us-east-1.amazonaws.com/prod";

  // Log the state of the form
  console.log("ImageUploader - Form state:", {
    selectedFile: !!selectedFile,
    wallAngle,
    loading,
    error: !!error,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setMessage("");
      setError(null);
      setVGrade("");
      setRouteImageUrl("");
      setRequestId("");
      console.log("ImageUploader - File selected:", file.name);
    }
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
    console.log("ImageUploader - Tags updated:", event.target.value);
  };

  const handleWallAngleChange = (event) => {
    const value = event.target.value;
    if (value < 0 || value > 90) {
      setError("Wall angle must be between 0 and 90 degrees.");
      setWallAngle(value);
    } else {
      setError(null);
      setWallAngle(value);
    }
    console.log("ImageUploader - Wall angle updated:", value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("ImageUploader - handleSubmit called");
    console.log("handleSubmit - userEmail:", userEmail);

    if (!selectedFile) {
      setError("Please select an image to upload.");
      console.log("ImageUploader - Error: No file selected");
      return;
    }

    if (!wallAngle) {
      setError("Please enter the estimated wall angle.");
      console.log("ImageUploader - Error: Wall angle missing");
      return;
    }

    if (!userEmail) {
      setError("User email is missing. Please log in.");
      console.log("ImageUploader - Error: userEmail missing");
      return;
    }

    if (error) {
      console.log("ImageUploader - Error exists, cannot submit:", error);
      return;
    }

    setLoading(true);
    setMessage("");
    setError(null);
    setVGrade("");
    setRouteImageUrl("");
    setRequestId("");

    try {
      // Step 1: Get pre-signed URL for S3 upload
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      if (!tagsArray.includes("climb_iq")) {
        tagsArray.push("climb_iq");
      }

      const uploadUrl = `${apiBaseUrl}/upload?userId=${encodeURIComponent(
        userEmail
      )}`;
      console.log("ImageUploader - Sending request to:", uploadUrl);

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: selectedFile.name,
          wallAngle: parseFloat(wallAngle),
          tags: tagsArray.length > 0 ? tagsArray : ["default"],
        }),
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || "Failed to get upload URL");
      }

      const uploadData = await uploadResponse.json();
      const { uploadURL, s3Key, imageId } = uploadData;
      console.log("ImageUploader - Upload response:", {
        uploadURL,
        s3Key,
        imageId,
      });

      // Step 2: Upload the image to S3
      await fetch(uploadURL, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": "image/jpeg",
        },
      });
      console.log("ImageUploader - Image uploaded to S3");

      // Step 3: Trigger the processing pipeline
      const processResponse = await fetch(`${apiBaseUrl}/process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          s3Key,
          wallAngle: parseFloat(wallAngle),
          userId: userEmail,
          tags: tagsArray,
        }),
      });

      if (!processResponse.ok) {
        const errorData = await processResponse.json();
        throw new Error(errorData.message || "Failed to start processing");
      }

      const processData = await processResponse.json();
      setRequestId(imageId);
      setMessage("Image uploaded successfully! Processing...");
      console.log("ImageUploader - Processing started, requestId:", imageId);

      // Step 4: Poll for results
      let result = null;
      let attempts = 0;
      const maxAttempts = 12;

      while (!result && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        attempts++;

        const statusResponse = await fetch(
          `${apiBaseUrl}/status/${imageId}?userId=${encodeURIComponent(
            userEmail
          )}`
        );
        if (!statusResponse.ok) {
          throw new Error("Failed to check status");
        }

        const statusData = await statusResponse.json();
        console.log("ImageUploader - Status check:", statusData);
        if (statusData.status === "completed") {
          result = statusData;
          setVGrade(result.vGrade);
          setRouteImageUrl(result.routeImageUrl);
          setMessage(
            `Climb graded successfully! V-Scale Grade: ${result.vGrade}`
          );
        } else if (statusData.status === "failed") {
          throw new Error(statusData.error || "Processing failed");
        }
      }

      if (!result) {
        throw new Error("Processing timed out. Please try again later.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while processing the image.");
      console.log("ImageUploader - Error during submission:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        margin: "20px",
        padding: "10px",
        borderRadius: "10px",
        backgroundColor: `#FEFAE0`,
        paddingTop: "90px",
        position: `relative`,
      }}
    >
      <h2><img src="upload-image.png" width='30%'/></h2>
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
              Selected: {selectedFile.name} (
              {(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <TextField
            sx={{
              // "& .MuiInputLabel-root": {
              //   fontSize: 14, // Increase the font size of the label
              //   fontWeight: 100, // Make the label bold
              // },
              "& .MuiOutlinedInput-root": {
                borderRadius: 10,
                "&.Mui-focused fieldset": {
                  borderColor: "#095043", // Change this to your desired focus color
                },
              },
              "& input:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0 1000px #D9D6C0 inset",
                WebkitTextFillColor: "#002A22", // Change this to your desired color
              },
            }}
            type="number"
            id="wallAngleInput"
            value={wallAngle}
            onChange={handleWallAngleChange}
            placeholder="e.g., 30"
            disabled={loading}
            label="Wall Angle (degrees)"
            style={{ width: "100%", padding: "0px" }}
            min="0"
            max="90"
            step="1"
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          {/* <label htmlFor="tagsInput">Tags (comma-separated, optional): </label> */}
          <TextField
            sx={{
              // "& .MuiInputLabel-root": {
              //   fontSize: 14,
              //   fontWeight: 100,
              // },
              "& .MuiOutlinedInput-root": {
                borderRadius: 10,
                "&.Mui-focused fieldset": {
                  borderColor: "#095043",
                },
              },
              "& input:-webkit-autofill": {
                WebkitBoxShadow: "0 0 0 1000px #D9D6C0 inset",
                WebkitTextFillColor: "#002A22",
              },
            }}
            type="text"
            id="tagsInput"
            label="Tags (comma-separated, optional)"
            value={tags}
            onChange={handleTagsChange}
            placeholder="e.g., nature, climbing"
            disabled={loading}
            style={{ width: "100%", padding: "5px" }}
          />
          <p style={{ fontSize: "12px", color: "#666" }}>
            Note: The "climb_iq" tag will be automatically added to process this
            image as a climbing wall.
          </p>
        </div>

        <LoadingButton
          type="submit"
          disabled={loading || !selectedFile || !wallAngle || !!error}
        >
          {loading ? "Processing..." : "Grade Climb"}
        </LoadingButton>
      </form>

      {message && (
        <p style={{ color: "green", marginTop: "10px" }}>{message}</p>
      )}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {(vGrade || routeImageUrl) && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <h3>Result</h3>
          {vGrade && (
            <p>
              <strong>V-Scale Grade:</strong> {vGrade}
            </p>
          )}
          {routeImageUrl && (
            <div>
              <p>
                <strong>Route Visualization:</strong>
              </p>
              <img
                src={routeImageUrl}
                alt="Climb Route"
                style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
              />
            </div>
          )}
          {tags && (
            <p>
              <strong>Tags:</strong>{" "}
              {tags
                .split(",")
                .map((tag) => tag.trim())
                .join(", ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
