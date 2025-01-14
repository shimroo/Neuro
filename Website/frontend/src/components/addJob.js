import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AddJob = () => {
  const [jobSelected, setJobSelected] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [tasksCreated, setTasksCreated] = useState(false);
  const [taskStatuses, setTaskStatuses] = useState({});
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const { jobId: navJobId, type: navType } = location.state || {};

  useEffect(() => {
    if (navJobId && navType) {
      setJobId(navJobId);
      setJobSelected(true);
      setTasksCreated(true);
      fetchTaskStatuses(navJobId); // Fetch task statuses
    }
  }, [navJobId, navType]);

  const fetchTaskStatuses = async (id) => {
    try {
      const response = await axios.get('http://localhost:4000/api/task/status', {
        params: { jobId: id },
      });
      if (response.data.success) {
        setTaskStatuses(response.data.data); // Store the task statuses
      } else {
        alert('Failed to fetch task statuses');
      }
    } catch (error) {
      console.error('Error fetching task statuses:', error);
      alert('Error fetching task statuses');
    }
  };

  const handleJobSelection = (event) => {
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
      setTasksCreated(true);
      fetchTaskStatuses(newJobId); // Fetch task statuses for the new job
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job');
    }
  };

  const handleTaskAction = (type) => {
    const routes = {
      'EMO-FACIAL': '/Face',
      'EMO-VOICE': '/audio',
      'EMO-TEXT': '/text',
    };
    if (routes[type]) {
      navigate(routes[type], { state: { jobId, type } });
    } else {
      alert(`No action defined for ${type}`);
    }
  };

  const tasks = [
    { label: 'Upload Face', type: 'EMO-FACIAL' },
    { label: 'Upload MP3', type: 'EMO-VOICE' },
    { label: 'Upload Handwriting', type: 'HANDWRITING' },
    { label: 'Upload EEG', type: 'EEG' },
    { label: 'Upload Text', type: 'EMO-TEXT' },
  ];

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
              {tasks.map((task) => {
                // Check task status using the task's type in taskStatuses
                const isPending = taskStatuses[task.type] === 'PENDING';
                return (
                  <tr
                    key={task.type}
                    style={{
                      backgroundColor: isPending ? '#f0f0f0' : 'white',
                      color: isPending ? '#aaa' : 'black',
                    }}
                  >
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                      <button
                        onClick={() => handleTaskAction(task.type)}
                        style={{
                          padding: '10px',
                          border: '1px solid #ccc',
                          backgroundColor: isPending ? '#eee' : '#fff',
                          cursor: isPending ? 'not-allowed' : 'pointer',
                        }}
                        disabled={isPending}
                      >
                        {task.label}
                      </button>
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{task.type}</td>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                      {taskStatuses[task.type] || '<Unknown>'}
                    </td>
                  </tr>
                );
              })}
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
