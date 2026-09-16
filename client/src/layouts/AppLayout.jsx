import { Menu, Bell, Search, LogOut, X } from 'lucide-react';
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { normalizeRole, roleNavigation, roleTitles } from '../routes/roleConfig';

export default function AppLayout() {
  const navigate = useNavigate();
  const { role } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentRole = normalizeRole(role || user.role);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = roleNavigation[currentRole] || [];

  useEffect(() => {
    if (role && currentRole !== normalizeRole(user.role)) navigate('/403', { replace: true });
  }, [currentRole, navigate, role, user.role]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="app-brand"><span className="brand-mark">CP</span><div><strong>CarePulse</strong><small>Hospital system</small></div><button className="icon-button mobile-only" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}><X size={18} /></button></div>
        <div className="role-context"><span>Workspace</span><strong>{roleTitles[currentRole] || 'Hospital workspace'}</strong></div>
        <nav className="app-nav" aria-label="Primary navigation">
          {navigation.map((item) => <NavLink key={item.to} to={`/workspace/${currentRole.toLowerCase()}/${item.to}`} onClick={() => setSidebarOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>{item.label}</NavLink>)}
        </nav>
        <button className="sidebar-logout" onClick={logout}><LogOut size={16} /> Sign out</button>
      </aside>
      <div className="app-content">
        <header className="app-header">
          <button className="icon-button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <div className="header-search"><Search size={17} /><input aria-label="Search hospital records" placeholder="Search records, patients, or invoices" /></div>
          <div className="header-actions"><button className="icon-button" aria-label="Notifications" onClick={() => navigate(`/workspace/${currentRole.toLowerCase()}/notifications`)}><Bell size={18} /></button><button className="profile-button" onClick={() => navigate(`/workspace/${currentRole.toLowerCase()}/profile`)}><span>{(user.username || 'U').slice(0, 1).toUpperCase()}</span><strong>{user.username || 'User'}</strong></button></div>
        </header>
        <main className="app-main"><Outlet /></main>
      </div>
    </div>
  );
}
