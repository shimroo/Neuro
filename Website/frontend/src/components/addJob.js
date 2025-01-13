import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AddJob = () => {
  const [jobSelected, setJobSelected] = useState(false);
  const [jobId, setJobId] = useState(null); 
  const [tasksCreated, setTasksCreated] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation(); // Access location state

  // Check if the jobId and type are passed via navigation
  const { jobId: navJobId, type: navType } = location.state || {};

  useEffect(() => {
    if (navJobId && navType) {
      setJobId(navJobId);
      setJobSelected(true);
      setTasksCreated(true);  
    }
  }, [navJobId, navType]);

  const handleJobSelection = async (event) => {
    const selectedJob = event.target.value;
    if (selectedJob === 'EMOTION-DETECTION') {
      setJobSelected(true);
      setTasksCreated(false);
    } else {
      setJobSelected(false);
    }
  };

  const handleCreateJob = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/jobs/addjob', {
        type: 'EMOTION-DETECTION', 
        email: user.email,
      });
      const newJobId = response.data.jobId; 
      setJobId(newJobId);
      setTasksCreated(true); // Create tasks once the job is created
    } catch (error) {
      console.error('Error creating job or tasks:', error);
      alert('Failed to create job or tasks');
    }
  };

  const handleFaceUpload = () => {
    navigate('/Face', { state: { jobId, type: 'EMO-FACIAL' } });
  };

  const handleVoiceUpload = () => {
    navigate('/audio', { state: { jobId, type: 'EMO-VOICE' } });
  };

  const handleHandwritingUpload = () => {
    alert('Opening file upload dialog for handwriting!');
  };

  const handleEEGUpload = () => {
    alert('Upload EEG data!');
  };

  const handleTextUpload = () => {
    navigate('/text', { state: { jobId, type: 'EMO-TEXT' } });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Add Job</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <label htmlFor="job-select" style={{ marginRight: '10px' }}>Job:</label>
        <select
          id="job-select"
          onChange={handleJobSelection}
          style={{ padding: '5px' }}
          value={jobSelected ? 'EMOTION-DETECTION' : ''}
        >
          <option value="">Select Job</option>
          <option value="EMOTION-DETECTION">Emotion Detection</option>
        </select>

        {jobSelected && !navJobId && (
          <button
            onClick={handleCreateJob}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
          >
            Create
          </button>
        )}
      </div>

      {tasksCreated && (
        <div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '20px',
              textAlign: 'left',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#ccc' }}>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Task</th>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Type</th>
                <th style={{ border: '1px solid #ddd', padding: '10px' }}>Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  <button
                    onClick={handleFaceUpload}
                    style={{
                      padding: '10px',
                      border: '1px solid #ccc',
                      backgroundColor: '#eee',
                      cursor: 'pointer',
                    }}
                  >
                    Upload Face
                  </button>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>LIE-FACIAL</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>&lt;Pending&gt;</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  <button
                    onClick={handleVoiceUpload}
                    style={{
                      padding: '10px',
                      border: '1px solid #ccc',
                      backgroundColor: '#eee',
                      cursor: 'pointer',
                    }}
                  >
                    Upload MP3
                  </button>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>LIE-VOICE</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>&lt;Draft&gt;</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  <button
                    onClick={handleHandwritingUpload}
                    style={{
                      padding: '10px',
                      border: '1px solid #ccc',
                      backgroundColor: '#eee',
                      cursor: 'pointer',
                    }}
                  >
                    Upload Handwriting
                  </button>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>HANDWRITING</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>&lt;Pending&gt;</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  <button
                    onClick={handleEEGUpload}
                    style={{
                      padding: '10px',
                      border: '1px solid #ccc',
                      backgroundColor: '#eee',
                      cursor: 'pointer',
                    }}
                  >
                    Upload EEG
                  </button>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>EEG</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>&lt;Pending&gt;</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                  <button
                    onClick={handleTextUpload}
                    style={{
                      padding: '10px',
                      border: '1px solid #ccc',
                      backgroundColor: '#eee',
                      cursor: 'pointer',
                    }}
                  >
                    Upload Text
                  </button>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>TEXT</td>
                <td style={{ border: '1px solid #ddd', padding: '10px' }}>&lt;Draft&gt;</td>
              </tr>
            </tbody>
          </table>
          <button
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            EXECUTE
          </button>
        </div>
      )}
    </div>
  );
};

export default AddJob;
