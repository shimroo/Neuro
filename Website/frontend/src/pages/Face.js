import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

const FaceRecognition = ({  }) => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [videoStream, setVideoStream] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); 
  const { jobId, type } = location.state || {};

  const handleCapture = () => {
    const video = document.getElementById("video");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setImage(canvas.toDataURL("image/png"));
  };

  const handleSubmit = async () => {
    if (!image) {
      setMessage("Please capture an image first.");
      return;
    }

    try {
      const blob = await fetch(image).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "captured-image.png");
      formData.append("jobId", jobId); // Ensure the job ID is passed along

      const response = await fetch("http://localhost:4000/api/jobs/EMO-FACIAL/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setMessage(`Image uploaded successfully! File path: ${data.filePath}`);
        stopCamera();
        // onComplete(true);

        navigate('/add-job', { state: { jobId, type } }); 
      } else {
        setMessage("Failed to save image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Failed to process the image. Try again.");
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
  };

  useEffect(() => {
    const video = document.getElementById("video");
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        video.srcObject = stream;

        video.onloadeddata = () => {
          video.play();
        };
      } catch (error) {
        console.error("Camera access denied:", error);
        setMessage("Unable to access camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      stopCamera(); 
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "400px",
          height: "300px",
          border: "2px solid #ddd",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <video
          id="video"
          autoPlay
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)", 
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            height: "80%",
            border: "2px dashed red",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
      </div>
      {image && (
        <img
          src={image}
          alt="Captured"
          style={{
            width: "200px",
            height: "150px",
            border: "2px solid green",
            borderRadius: "10px",
            marginBottom: "20px",
            transform: "scaleX(-1)",
          }}
        />
      )}
      <div style={{ marginBottom: "10px", color: "#555" }}>{message}</div>
      <button onClick={handleCapture} style={{ marginBottom: "10px" }}>
        Capture Image
      </button>
      <button onClick={handleSubmit}>Submit Image</button>
    </div>
  );
};

export default FaceRecognition;
