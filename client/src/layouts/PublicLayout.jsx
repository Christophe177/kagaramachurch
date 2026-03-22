import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Menu, X, Instagram } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/logo.png';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/pastors', label: 'Pastors' },
  { path: '/events', label: 'Events' },
  { path: '/announcements', label: 'Announcements' },
  { path: '/contact', label: 'Contact' },
];

export default function PublicLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="public-layout">
      <style>{`
        .public-layout { min-height: 100vh; display: flex; flex-direction: column; }
        .pub-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: var(--color-bg-glass);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(37, 99, 235, 0.1);
          padding: 0 2rem;
        }
        .pub-nav-inner {
          max-width: 1200px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 72px;
        }
        .pub-logo {
          display: flex; align-items: center; gap: 0.75rem;
          font-family: var(--font-heading); font-size: 1.3rem;
          color: var(--color-primary); font-weight: 600; text-decoration: none;
        }
        .pub-links {
          display: flex; align-items: center; gap: 0.25rem; list-style: none;
        }
        .pub-links a {
          padding: 0.5rem 1rem; border-radius: var(--radius-md);
          font-size: 0.9rem; font-weight: 500; color: var(--color-text-secondary);
          transition: all var(--transition-fast); text-decoration: none;
        }
        .pub-links a:hover, .pub-links a.active {
          color: var(--color-primary); background: var(--color-primary-subtle);
        }
        .pub-auth { display: flex; gap: 0.5rem; }
        .pub-main { flex: 1; margin-top: 72px; }
        .pub-mobile-btn { display: none; background: none; color: var(--color-text); }
        .pub-footer {
          background: linear-gradient(135deg, #1e40af 0%, var(--color-primary) 50%, #1e40af 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3.5rem 2rem 1.5rem;
          color: white;
        }
        .pub-footer-inner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 3rem;
        }
        .pub-footer h4 {
          color: white; font-size: 1.25rem; margin-bottom: 1.25rem;
          letter-spacing: 0.02em; font-weight: 700;
        }
        .pub-footer p, .pub-footer a {
          color: rgba(255, 255, 255, 0.85); font-size: 0.95rem; line-height: 1.8;
          text-decoration: none; transition: color 0.2s ease;
        }
        .pub-footer a:hover { color: white; text-decoration: underline; }
        .pub-footer-bottom {
          max-width: 1200px; margin: 0 auto; padding-top: 2rem; margin-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center; color: rgba(226, 232, 240, 0.4); font-size: 0.85rem;
        }
        .social-links { display: flex; gap: 1rem; margin-top: 1.5rem; }
        .social-icon {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.1); display: flex;
          align-items: center; justify-content: center;
          color: white; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1);
        }
        .social-icon:hover {
          background: white; color: var(--color-primary); transform: translateY(-3px);
        }
        @media (max-width: 768px) {
          .pub-links { display: none; }
          .pub-links.open {
            display: flex; flex-direction: column;
            position: absolute; top: 72px; left: 0; right: 0;
            background: var(--color-bg-secondary); padding: 1rem;
            border-bottom: 1px solid var(--color-border);
          }
          .pub-mobile-btn { display: flex; }
          .pub-auth { display: none; }
          .pub-footer-inner { grid-template-columns: 1fr; gap: 2rem; }
        }
      `}</style>

      <nav className="pub-nav">
        <div className="pub-nav-inner">
          <Link to="/" className="pub-logo">
            <img src={logo} alt="Kagarama CMS" style={{ height: '50px', width: 'auto' }} /> Kagarama CMS
          </Link>

          <ul className={`pub-links ${mobileOpen ? 'open' : ''}`}>
            {navLinks.map(l => (
              <li key={l.path}>
                <Link
                  to={l.path}
                  className={location.pathname === l.path ? 'active' : ''}
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="pub-auth">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-sm">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Join Us</Link>
              </>
            )}
          </div>

          <button className="pub-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <main className="pub-main">
        <Outlet />
      </main>

      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <div>
            <h4>Kagarama Church</h4>
            <p>A community of faith, love, and service. Join us as we grow together in worship and fellowship.</p>
            <div className="social-links">
              <a href="https://www.instagram.com/eear_kagarama/" target="_blank" rel="noopener noreferrer" className="social-icon" title="Follow us on Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            {navLinks.map(l => (
              <div key={l.path}><Link to={l.path}>{l.label}</Link></div>
            ))}
          </div>
          <div>
            <p>Kagarama, Kigali<br />Rwanda<br />eearkagarama@gmail.com</p>
          </div>
        </div>
        <div className="pub-footer-bottom">
          © {new Date().getFullYear()} Kagarama Church Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
