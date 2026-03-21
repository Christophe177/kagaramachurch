import { Users, Heart, Droplets, Gem, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PastorDashboard() {
    const stats = [
        { icon: Users, label: 'Total Members', value: '—', color: 'var(--color-primary)', to: '/pastor/members' },
        { icon: Heart, label: 'Prayer Requests', value: '—', color: 'var(--color-danger)', to: '/pastor/prayer-requests' },
        { icon: Droplets, label: 'Baptism / Kwakirwa', value: '—', color: 'var(--color-info)', to: '/pastor/baptism' },
        { icon: Gem, label: 'Marriage Registrations', value: '—', color: 'var(--color-accent)', to: '/pastor/marriage' },
        { icon: Clock, label: 'Appointments', value: '—', color: 'var(--color-success)', to: '/pastor/appointments' },
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Pastor Dashboard</h1>
                    <p className="page-subtitle">Manage church members, spiritual activities, and pastoral duties</p>
                </div>
            </div>

            <div className="stats-grid">
                {stats.map((s, i) => (
                    <Link to={s.to} key={i} className="stat-card animate-in" style={{ animationDelay: `${i * 0.1}s`, textDecoration: 'none', color: 'inherit' }}>
                        <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>
                            <s.icon size={24} />
                        </div>
                        <div>
                            <div className="stat-value">{s.value}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <TrendingUp size={48} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '0.5rem' }}>Welcome Pastor</h3>
                <p style={{ color: 'var(--color-text-secondary)', maxWidth: 500, margin: '0 auto' }}>
                    Use the sidebar navigation to manage members, review prayer requests, handle baptism and marriage registrations, and manage your appointments.
                    Stats will populate once connected to the database.
                </p>
            </div>
        </div>
    );
}
