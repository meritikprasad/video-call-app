import { Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import Auth from './pages/auth';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeet from './pages/VideoMeet';

function App() {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="" element={<LandingPage />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/:url' element={<VideoMeet />} />  {/* call it as slugs */}
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App
