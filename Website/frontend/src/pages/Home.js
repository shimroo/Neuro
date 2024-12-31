import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  const handleBeginEvaluation = () => {
    // console.log("Begin Evaluation clicked");
    navigate('/evaluation');
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
        backgroundColor: '#f9f9f9',
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
          Welcome to Your Mental Health Companion
        </h1>
        <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6' }}>
          Take the first step toward better mental well-being. Begin your personalized evaluation to understand and improve your mental health.
        </p>
        <button
          onClick={handleBeginEvaluation}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '20px',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#45a049')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#4CAF50')}
        >
          Begin Evaluation
        </button>
      </div>
    </div>
  );
};

export default Home;
