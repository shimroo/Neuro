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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
