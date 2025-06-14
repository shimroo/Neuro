import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// pages & components
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Consent from './pages/Consent' 
import AddJob from './components/addJob'
import Evaluation from './pages/Evaluation'
import FaceRecognition from './pages/Face'
import Audio from './pages/Audio'
import Text from './pages/Text'
import JobDetails from './components/jobdetails';
import EEGUpload from './pages/Eeg';
import HandwritingUpload from './pages/Handwriting';

function App() {
  const { user } = useAuthContext()

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Home /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <Signup /> : <Navigate to="/" />} 
            />
            <Route 
              path="/consent" 
              element={user ? <Consent /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/evaluation" 
              element={user ? <Evaluation /> : <Navigate to="/login" />} 
            />
            <Route path="/add-job" element={<AddJob />} />
            <Route path="/face" element={<FaceRecognition />} />
            <Route path="/audio" element={<Audio />} />
            <Route path="/text" element={<Text />} />
            <Route path="/eeg" element={<EEGUpload />} />
            <Route path="/handwriting" element={<HandwritingUpload />} />
            <Route path="/job/:id" element={<JobDetails />} />

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
