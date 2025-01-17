import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const JobDetails = () => {
  const { id } = useParams(); // Extract the job ID from the URL
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [tasks, setTasks] = useState([]); // State for tasks
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/jobs/getJobDetails/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          setJob(data.data.job); // Assuming job is nested under `data.job`
          setTasks(data.data.tasks); // Assuming tasks are nested under `data.tasks`
        } else {
          setError(data.message); 
        }
      } catch (err) {
        setError('Failed to fetch job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) {
    return <p>Loading job details...</p>;
  }

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: '10px' }}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Job Details</h1>
      {job && (
        <div
          style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'left',
          }}
        >
          <h2>{job.name}</h2>
          <p>
            <strong>Type:</strong> {job.type}
          </p>
          <p>
            <strong>Output:</strong> {job.output}
          </p>
          <p>
            <strong>Created At:</strong> {new Date(job.createdAt).toLocaleString()}
          </p>
          {/* <p>
            <strong>Description:</strong> {job.description || 'No description available.'}
          </p> */}
        </div>
      )}

      {tasks.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h2>Tasks</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {tasks.map((task) => (
              <li
                key={task._id}
                style={{
                  padding: '10px',
                  margin: '10px 0',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                }}
              >
                {/* <strong>Task Name:</strong> {task.name} <br /> */}
                <strong>Task Type:</strong> {task.type} <br />
                <strong>Version:</strong> {task.version} <br />
                <strong>Output:</strong> {task.output || 'No output yet'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Go Back
      </button>
    </div>
  );
};

export default JobDetails;
