import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import the AuthContext

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Access the user from the context
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:4000/api/jobs/getuserjobs?email=${user.email}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setJobs(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]); // Re-run the effect if the user context changes

  const deleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/jobs/deletejob/${jobId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setJobs(jobs.filter((job) => job._id !== jobId)); // Remove the deleted job from the state
        alert('Job deleted successfully.');
      } else {
        alert(`Failed to delete job: ${data.message}`);
      }
    } catch (err) {
      alert('Failed to delete job.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Home</h1>
      <button
        onClick={() => navigate('/add-job')}
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
        ADD
      </button>

      {loading && <p>Loading jobs...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && jobs.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'left' }}>
          <h2>Your Jobs</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {jobs.map((job) => (
              <li
                key={job._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  margin: '10px 0',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                }}
              >
                <div onClick={() => navigate(`/job/${job._id}`)} style={{ cursor: 'pointer' }}>
                  <strong>{job.name}</strong> <br />
                  <span>Type: {job.type}</span> <br />
                  <span>Status: {job.status}</span> <br />
                  <span>Created: {new Date(job.createdAt).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => deleteJob(job._id)}
                  style={{
                    padding: '5px 10px',
                    fontSize: '14px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && <p>No jobs found.</p>}
    </div>
  );
};

export default Home;
