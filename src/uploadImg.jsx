import { useState } from "react";
import { supabase } from "./supabaseClient";

const UploadImg = ({ user }) => {
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!imageFile) {
      alert("Select an image");
      return;
    }

    setUploading(true);

    const fileName = `${user.id}/${Date.now()}-${imageFile.name}`;

    // Upload to Supabase
    const { error } = await supabase.storage
      .from("retina-images")
      .upload(fileName, imageFile);

    if (error) {
      alert(error.message);
      setUploading(false);
      return;
    }

    // Get public URL
    const { data } = supabase.storage
      .from("retina-images")
      .getPublicUrl(fileName);

    const imageUrl = data.publicUrl;

    // Call ML backend
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: user.id,
          image_url: imageUrl
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const prediction = await response.json();
      setResult(prediction);
    } catch (error) {
      console.error("ML Backend Error:", error);
      alert("ML Backend is not running. Please start the backend server at localhost:8000");
      setResult({
        error: "Backend connection failed",
        message: "Please ensure the ML backend is running on port 8000"
      });
    }

    setUploading(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3 style={{ color: "#da70d6", marginBottom: "20px" }}>
        Upload Retina Image
      </h3>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "10px", color: "#ccc" }}>
          Select Image File
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#2a2a2a",
            color: "#fff",
            fontSize: "1rem"
          }}
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: uploading ? "#666" : "#8a2be2",
          color: "#fff",
          fontSize: "1rem",
          fontWeight: "bold",
          border: "none",
          borderRadius: "8px",
          cursor: uploading ? "not-allowed" : "pointer"
        }}
      >
        {uploading ? "Processing..." : "Upload & Predict"}
      </button>

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#2a2a2a",
            borderRadius: "8px",
            border: "1px solid #da70d6"
          }}
        >
          <h4 style={{ color: "#da70d6", marginBottom: "10px" }}>
            Result
          </h4>

          {result.error ? (
            <div style={{ color: "#ff6b6b" }}>
              <p><b>Error:</b> {result.error}</p>
              <p>{result.message}</p>
            </div>
          ) : (
            <div>
              <p style={{ color: "#fff" }}>
                <b>Class:</b> {result.class}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadImg;
