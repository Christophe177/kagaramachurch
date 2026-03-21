import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
    Church, LayoutDashboard, Users, Heart, Droplets, Gem,
    Calendar, Megaphone, Image, UserPlus, Trash2, LogOut,
    Menu, X, ChevronRight, BookOpen, Clock
} from 'lucide-react';
import { useState } from 'react';

const menuItems = {
    member: [
        { path: '/member', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/member/join', icon: UserPlus, label: 'Join Church' },
        { path: '/member/baptism', icon: Droplets, label: 'Baptism / Kwakirwa' },
        { path: '/member/marriage', icon: Gem, label: 'Marriage' },
        { path: '/member/prayer', icon: Heart, label: 'Prayer Requests' },
        { path: '/member/appointment', icon: Clock, label: 'Book Appointment' },
    ],
    pastor: [
        { path: '/pastor', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/pastor/members', icon: Users, label: 'Members' },
        { path: '/pastor/prayer-requests', icon: Heart, label: 'Prayer Requests' },
        { path: '/pastor/baptism', icon: Droplets, label: 'Baptism / Kwakirwa' },
        { path: '/pastor/marriage', icon: Gem, label: 'Marriage' },
        { path: '/pastor/appointments', icon: Clock, label: 'Appointments' },
    ],
    manager: [
        { path: '/manager', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/manager/events', icon: Calendar, label: 'Events' },
        { path: '/manager/announcements', icon: Megaphone, label: 'Announcements' },
        { path: '/manager/families', icon: Users, label: 'Families' },
        { path: '/manager/deletion-requests', icon: Trash2, label: 'Deletion Requests' },
        { path: '/manager/photos', icon: Image, label: 'Photo of the Day' },
    ],
};

const roleLabels = {
    member: 'Member Dashboard',
    pastor: 'Pastor Dashboard',
    manager: 'Communication Manager',
};

export default function DashboardLayout({ role }) {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const items = menuItems[role] || [];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (item) => {
        if (item.exact) return location.pathname === item.path;
        return location.pathname.startsWith(item.path);
    };

    return (
        <div className="dash-layout">
            <style>{`
        .dash-layout { display: flex; min-height: 100vh; }
        .dash-sidebar {
          width: ${collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'};
          background: var(--color-bg-secondary);
          border-right: 1px solid var(--color-border);
          display: flex; flex-direction: column;
          transition: width var(--transition-base);
          position: fixed; top: 0; bottom: 0; left: 0; z-index: 50;
          overflow: hidden;
        }
        .dash-sidebar-header {
          padding: 1.25rem; display: flex; align-items: center; gap: 0.75rem;
          border-bottom: 1px solid var(--color-border); min-height: 72px;
        }
        .dash-sidebar-logo {
          color: var(--color-primary); font-family: var(--font-heading);
          font-size: 1.15rem; font-weight: 600; white-space: nowrap;
        }
        .dash-sidebar-role {
          font-size: 0.7rem; color: var(--color-text-muted);
          text-transform: uppercase; letter-spacing: 0.1em;
          padding: 0.75rem 1.25rem 0.25rem; white-space: nowrap;
        }
        .dash-nav { flex: 1; padding: 0.5rem; overflow-y: auto; }
        .dash-nav-item {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.7rem 1rem; border-radius: var(--radius-md);
          color: var(--color-text-secondary); font-size: 0.9rem; font-weight: 500;
          text-decoration: none; transition: all var(--transition-fast);
          margin-bottom: 2px; white-space: nowrap;
        }
        .dash-nav-item:hover { background: var(--color-primary-subtle); color: var(--color-text); }
        .dash-nav-item.active {
          background: var(--color-primary-subtle); color: var(--color-primary);
          font-weight: 600;
        }
        .dash-nav-item svg { flex-shrink: 0; }
        .dash-sidebar-footer {
          padding: 1rem; border-top: 1px solid var(--color-border);
        }
        .dash-user-info {
          display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;
          padding: 0.5rem; white-space: nowrap; overflow: hidden;
        }
        .dash-avatar {
          width: 36px; height: 36px; border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.85rem; color: #0a0e1a; flex-shrink: 0;
        }
        .dash-user-name { font-size: 0.85rem; font-weight: 600; }
        .dash-user-email { font-size: 0.72rem; color: var(--color-text-muted); }
        .dash-logout {
          width: 100%; display: flex; align-items: center; gap: 0.75rem;
          padding: 0.6rem 1rem; border-radius: var(--radius-md);
          background: none; color: var(--color-text-secondary); font-size: 0.85rem;
          border: 1px solid var(--color-border); transition: all var(--transition-fast);
          white-space: nowrap;
        }
        .dash-logout:hover { background: var(--color-danger-subtle); color: var(--color-danger); border-color: var(--color-danger); }
        .dash-main {
          flex: 1; margin-left: ${collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)'};
          transition: margin-left var(--transition-base);
        }
        .dash-topbar {
          height: 64px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem; border-bottom: 1px solid var(--color-border);
          background: var(--color-bg-secondary);
        }
        .dash-toggle {
          background: none; color: var(--color-text-secondary);
          padding: 0.5rem; border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }
        .dash-toggle:hover { background: var(--color-primary-subtle); color: var(--color-text); }
        .dash-content { padding: 2rem; max-width: 1400px; }
        .dash-mobile-overlay {
          display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          z-index: 40;
        }
        @media (max-width: 768px) {
          .dash-sidebar {
            transform: translateX(${mobileOpen ? '0' : '-100%'});
            width: var(--sidebar-width);
          }
          .dash-main { margin-left: 0; }
          .dash-mobile-overlay { display: ${mobileOpen ? 'block' : 'none'}; }
        }
      `}</style>

            {/* Mobile overlay */}
            <div className="dash-mobile-overlay" onClick={() => setMobileOpen(false)} />

            {/* Sidebar */}
            <aside className="dash-sidebar">
                <div className="dash-sidebar-header">
                    <Church size={24} color="var(--color-primary)" />
                    {!collapsed && <span className="dash-sidebar-logo">Kagarama CMS</span>}
                </div>

                {!collapsed && <div className="dash-sidebar-role">{roleLabels[role]}</div>}

                <nav className="dash-nav">
                    {items.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`dash-nav-item ${isActive(item) ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <item.icon size={20} />
                            {!collapsed && item.label}
                        </Link>
                    ))}
                </nav>

                <div className="dash-sidebar-footer">
                    {!collapsed && (
                        <div className="dash-user-info">
                            <div className="dash-avatar">
                                {user?.profile?.full_name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div>
                                <div className="dash-user-name">{user?.profile?.full_name || 'User'}</div>
                                <div className="dash-user-email">{user?.email || ''}</div>
                            </div>
                        </div>
                    )}
                    <button className="dash-logout" onClick={handleLogout}>
                        <LogOut size={18} /> {!collapsed && 'Sign Out'}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="dash-main">
                <div className="dash-topbar">
                    <button className="dash-toggle" onClick={() => {
                        if (window.innerWidth <= 768) setMobileOpen(!mobileOpen);
                        else setCollapsed(!collapsed);
                    }}>
                        <Menu size={22} />
                    </button>
                    <Link to="/" className="btn btn-ghost btn-sm">
                        <Church size={16} /> View Website
                    </Link>
                </div>
                <div className="dash-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
