import { Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import Auth from './pages/auth';
import { AuthProvider } from './contexts/AuthContext';

function App() {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="" element={<LandingPage />} />
          <Route path='/auth' element={<Auth />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App
