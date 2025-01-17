import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HandwritingUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const { jobId, type } = useLocation().state || {};
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      setMessage("Please upload a Handwriting file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("jobId", jobId);
      formData.append("type", type);  // Add type to the form data

      const response = await fetch("http://localhost:4000/api/jobs/EMO-WRITING/uploadwriting", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
        
      if (data.success) {
        setMessage(`File uploaded successfully! File path: ${data.filePath}`);
        navigate('/add-job', { state: { jobId, type } });
      } else {
        setMessage("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Failed to process the file. Try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Upload Handwriting File</h2>
      <input type="file" onChange={handleFileChange} style={styles.input} />
      <button onClick={handleSubmit} style={styles.button}>Submit Handwriting File</button>
      <div style={styles.message}>{message}</div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  input: {
    marginBottom: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "10px",
    color: "#555",
  },
};

export default HandwritingUpload;
