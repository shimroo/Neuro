import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Text = () => {
  const [textInput, setTextInput] = useState("");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { jobId, type } = location.state || {};

  const handleSubmit = async () => {
    if (!textInput.trim()) {
      setMessage("Please enter some text.");
      return;
    }

    if (!jobId || !type) {
      setMessage("Missing jobId or type. Cannot submit.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/jobs/${type}/uploadtext`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          text: textInput,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Text submitted successfully!");
        navigate("/add-job", { state: { jobId, type } });
      } else {
        setMessage(data.error || "Failed to submit text.");
      }
    } catch (error) {
      console.error("Error submitting text:", error);
      setMessage("Failed to process the text. Try again.");
    }
  };

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
      <textarea
        style={{
          width: "300px",
          height: "150px",
          marginBottom: "20px",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          resize: "none",
        }}
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Write your text here..."
      />
      <div style={{ marginBottom: "10px", color: "#555" }}>{message}</div>
      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          color: "#fff",
          backgroundColor: "#007bff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Submit Text
      </button>
    </div>
  );
};

export default Text;
