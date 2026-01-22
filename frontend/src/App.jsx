import { Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import Auth from './pages/Auth';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeet from './pages/VideoMeet';
import HomeComponent from './pages/Home';
import History from './pages/History';

function App() {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="" element={<LandingPage />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/home' element={<HomeComponent />} />
          <Route path='/:url' element={<VideoMeet />} />  {/* call it as slugs */}
          <Route path='/history' element={<History />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App
