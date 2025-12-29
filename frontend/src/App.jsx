import { Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import Auth from './pages/auth';

function App() {

  return (
    <>
      <Routes>
        <Route path="" element={<LandingPage />} />
        <Route path='/auth' element={<Auth />} />
      </Routes>
    </>
  );
}

export default App
