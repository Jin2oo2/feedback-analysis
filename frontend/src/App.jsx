import { Routes, Route, Navigate } from 'react-router-dom';
import Feedback from './pages/Feedback';
import Results from './pages/Results';
import NoPage from './pages/NoPage';

export default function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to="/feedback" replace />} />
        <Route path='feedback' element={<Feedback />} />
        <Route path='results' element={<Results />}/>
        <Route path='*' element={<NoPage />}/>
      </Routes>

    </>
  )
}