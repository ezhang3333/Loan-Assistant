import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Users from './pages/Users';
import Loans from './pages/Loans';
import Banks from './pages/Banks';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/users" element={<Users />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/banks" element={<Banks />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}
