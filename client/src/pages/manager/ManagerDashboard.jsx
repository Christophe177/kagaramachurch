import { Calendar, Megaphone, Users, Trash2, Image, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManagerDashboard() {
    const stats = [
        { icon: Calendar, label: 'Events', value: '—', color: 'var(--color-primary)', to: '/manager/events' },
        { icon: Megaphone, label: 'Announcements', value: '—', color: 'var(--color-info)', to: '/manager/announcements' },
        { icon: Users, label: 'Families', value: '—', color: 'var(--color-accent)', to: '/manager/families' },
        { icon: Trash2, label: 'Deletion Requests', value: '—', color: 'var(--color-danger)', to: '/manager/deletion-requests' },
        { icon: Image, label: 'Photo of the Day', value: '—', color: 'var(--color-success)', to: '/manager/photos' },
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Communication Manager</h1>
                    <p className="page-subtitle">Manage events, announcements, families, and church content</p>
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((s, i) => (
                    <Link to={s.to} key={i} className="stat-card animate-in" style={{ animationDelay: `${i * 0.1}s`, textDecoration: 'none', color: 'inherit' }}>
                        <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}><s.icon size={24} /></div>
                        <div>
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <TrendingUp size={48} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '0.5rem' }}>Communication Hub</h3>
                <p style={{ color: 'var(--color-text-secondary)', maxWidth: 500, margin: '0 auto' }}>
                    Navigate using the sidebar to manage events, post announcements, handle family records, review deletion requests, and post daily photos.
                </p>
            </div>
        </div>
    );
}
