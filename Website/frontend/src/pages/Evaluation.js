import React, { useState } from "react";
import FaceRecognition from "./Face";

const Evaluation = () => {
  const [currentTest, setCurrentTest] = useState(null);
  const [completedTests, setCompletedTests] = useState({
    "Face Recognition": false,
    "Speech Test": false,
    "Handwriting Analysis": false,
    "EEG Data": false,
  });

  const handlePanelClick = (title) => {
    if (completedTests[title]) return; // Prevent click on completed test
    if (title === "Face Recognition") {
      setCurrentTest("Face Recognition");
    } else {
      alert(`${title} test functionality not implemented yet.`);
    }
  };

  const handleFaceRecognitionComplete = (success) => {
    if (success) {
      setCompletedTests((prev) => ({
        ...prev,
        "Face Recognition": true,
      }));
      setCurrentTest(null); // Navigate back to Evaluation page
    }
  };

  if (currentTest === "Face Recognition") {
    return <FaceRecognition onComplete={handleFaceRecognitionComplete} />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        backgroundColor: "#f5f5f5",
      }}
    >
      {["Face Recognition", "Speech Test", "Handwriting Analysis", "EEG Data"].map(
        (title, index) => (
          <div
            key={index}
            onClick={() => handlePanelClick(title)}
            style={{
              width: "20%",
              height: "70%",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              backgroundColor: completedTests[title] ? "#ccc" : "#fff",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              cursor: completedTests[title] ? "not-allowed" : "pointer", // Disable cursor
              transition: "transform 0.3s ease",
            }}
          >
            {completedTests[title] && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "20px",
                  height: "20px",
                  backgroundColor: "green",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                ✓
              </div>
            )}
            <h2 style={{ fontSize: "1.5rem", color: "#333", marginBottom: "10px" }}>
              {title}
            </h2>
            <p style={{ color: "#555" }}>Click to start the {title} test.</p>
          </div>
        )
      )}
    </div>
  );
};

export default Evaluation;
