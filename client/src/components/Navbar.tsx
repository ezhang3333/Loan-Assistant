import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, Lightbulb, SlidersHorizontal, LogOut } from 'lucide-react';
import '../css/navbar.css';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="app-nav">
      <div className="app-nav-brand">LOAN MATCH</div>

      <div className="app-nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>
        <NavLink to="/heatmap" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <Map size={16} />
          Heatmap
        </NavLink>
        <NavLink to="/assistant" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <Lightbulb size={16} />
          Loan Assistant
        </NavLink>
        <NavLink to="/simulator" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <SlidersHorizontal size={16} />
          What-If Simulator
        </NavLink>
      </div>

      <button className="nav-logout" onClick={() => navigate('/')}>
        <LogOut size={14} />
        Logout
      </button>
    </nav>
  );
}
