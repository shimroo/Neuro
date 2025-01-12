import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
const Consent = () => {
  const [consent, setConsent] = useState(false); 
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setConsent(!consent);
  };

  const handleStartConsent = () => {
    if (consent) {
      navigate("/evaluation");
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          textAlign: 'center',
          background: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ fontSize: '2rem', color: '#333', marginBottom: '20px' }}>
          Mental Health Evaluation
        </h1>
        <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
          Answer the following questions honestly to receive personalized insights about your mental well-being.
        </p>
        <div style={{ margin: '20px 0', textAlign: 'left' }}>
          <label style={{ fontSize: '1rem', color: '#555' }}>
            <input
              type="checkbox"
              checked={consent}
              onChange={handleCheckboxChange}
              style={{ marginRight: '10px' }}
            />
            I consent to the following:
            <ul style={{ marginTop: '10px', paddingLeft: '20px', color: '#777' }}>
              <li>My audio and video recordings may be used for evaluation purposes.</li>
              <li>This Evaluation is completely anonymous.</li>
              <li>I agree to participate voluntarily.</li>
            </ul>
          </label>
        </div>
        <button
          onClick={handleStartConsent}
          disabled={!consent} 
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: consent ? '#4CAF50' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: consent ? 'pointer' : 'not-allowed',
            marginTop: '20px',
            transition: 'background-color 0.3s ease',
          }}
        >
          Start evaluation
        </button>
      </div>
    </div>
  );
};

export default Consent;
