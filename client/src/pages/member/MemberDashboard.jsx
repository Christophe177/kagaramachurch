import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { UserPlus, Droplets, Gem, Heart, Clock, ArrowRight } from 'lucide-react';

export default function MemberDashboard() {
    const { user } = useAuth();

    const actions = [
        { to: '/member/join', icon: UserPlus, title: 'Join Church', desc: 'Register as a church member', color: 'var(--color-primary)' },
        { to: '/member/baptism', icon: Droplets, title: 'Baptism / Kwakirwa', desc: 'Register for baptism or kwakirwa', color: 'var(--color-info)' },
        { to: '/member/marriage', icon: Gem, title: 'Marriage', desc: 'Submit marriage registration', color: 'var(--color-accent)' },
        { to: '/member/prayer', icon: Heart, title: 'Prayer Request', desc: 'Submit a prayer request', color: 'var(--color-danger)' },
        { to: '/member/appointment', icon: Clock, title: 'Book Appointment', desc: 'Schedule with the pastor', color: 'var(--color-success)' },
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Welcome, {user?.profile?.full_name || 'Member'}</h1>
                    <p className="page-subtitle">What would you like to do today?</p>
                </div>
            </div>

            <style>{`
        .action-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; }
        .action-card {
          display: flex; align-items: center; gap: 1.25rem;
          padding: 1.5rem; background: var(--color-bg-card);
          border: 1px solid var(--color-border); border-radius: var(--radius-lg);
          text-decoration: none; color: var(--color-text);
          transition: all var(--transition-base);
        }
        .action-card:hover {
          border-color: rgba(212,175,55,0.3); transform: translateY(-3px);
          box-shadow: var(--shadow-md); color: var(--color-text);
        }
        .action-icon {
          width: 52px; height: 52px; border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .action-card h3 { font-size: 1.05rem; font-family: var(--font-body); font-weight: 600; margin-bottom: 0.25rem; }
        .action-card p { font-size: 0.85rem; color: var(--color-text-secondary); }
        .action-arrow { margin-left: auto; color: var(--color-text-muted); transition: all var(--transition-fast); }
        .action-card:hover .action-arrow { color: var(--color-primary); transform: translateX(4px); }
      `}</style>

            <div className="action-grid">
                {actions.map((a, i) => (
                    <Link key={a.to} to={a.to} className="action-card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="action-icon" style={{ background: `${a.color}20`, color: a.color }}>
                            <a.icon size={24} />
                        </div>
                        <div>
                            <h3>{a.title}</h3>
                            <p>{a.desc}</p>
                        </div>
                        <ArrowRight size={18} className="action-arrow" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
