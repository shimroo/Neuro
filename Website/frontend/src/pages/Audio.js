import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

const Audio = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { jobId, type } = location.state || {};

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      const chunks = [];
      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = () => setAudioBlob(new Blob(chunks, { type: "audio/wav" }));

      recorder.start();
      setIsRecording(true);
      setMessage("Recording...");
    } catch (error) {
      console.error("Microphone access denied:", error);
      setMessage("Unable to access microphone. Please check permissions.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      setMessage("Recording stopped. You can now submit.");
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) {
      setMessage("Please record audio first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recorded-audio.wav");
      formData.append("jobId", jobId);

      const response = await fetch("http://localhost:4000/api/jobs/EMO-VOICE/uploadvoice", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.success) {
        setMessage(`Audio uploaded successfully! File path: ${data.filePath}`);
        navigate('/add-job', { state: { jobId, type } });
      } else {
        setMessage("Failed to save audio.");
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
      setMessage("Failed to process the audio. Try again.");
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
      <div
        style={{
          position: "relative",
          width: "300px",
          height: "50px",
          marginBottom: "20px",
        }}
      >
        {isRecording ? (
          <div style={{ color: "red", fontWeight: "bold" }}>Recording...</div>
        ) : (
          <div style={{ color: "green", fontWeight: "bold" }}>
            {audioBlob ? "Audio Ready" : "Press Record to Start"}
          </div>
        )}
      </div>

      <div style={{ marginBottom: "10px", color: "#555" }}>{message}</div>
      {!isRecording && (
        <button onClick={handleStartRecording} style={{ marginBottom: "10px" }}>
          Start Recording
        </button>
      )}
      {isRecording && (
        <button onClick={handleStopRecording} style={{ marginBottom: "10px" }}>
          Stop Recording
        </button>
      )}
      <button onClick={handleSubmit} disabled={!audioBlob}>
        Submit Audio
      </button>
    </div>
  );
};

export default Audio;
