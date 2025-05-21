// src/utils/s3Upload.js
import { API_URL } from '../utils';

export async function getPresignedUploadUrl(filename) {
  const res = await fetch(`${API_URL}/generate-upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename }),
  });
  if (!res.ok) throw new Error("Failed to get presigned S3 URL");
  return await res.json(); // { uploadUrl, key }
}

export async function uploadImageToS3(file) {
  const { uploadUrl, key } = await getPresignedUploadUrl(file.name);
  await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  return key; // Return this to use in your grading calls!
}
