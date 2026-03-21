import { useState, useEffect } from 'react';
import { prayerAPI } from '../../services/api.js';
import { Heart, Check, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PrayerRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { setRequests(await prayerAPI.getAll()); } catch { } finally { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        try {
            await prayerAPI.update(id, { status });
            toast.success(`Marked as ${status}`);
            load();
        } catch (err) { toast.error('Failed to update'); }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Prayer Requests</h1>
                    <p className="page-subtitle">Review and respond to prayer requests from members</p>
                </div>
            </div>

            {loading ? <div className="loading-page"><div className="spinner" /></div> : requests.length === 0 ? (
                <div className="empty-state"><Heart size={64} /><h3>No prayer requests</h3><p>Prayer requests from members will appear here.</p></div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {requests.map(r => (
                        <div key={r.id} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>{r.title}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                                        {r.is_anonymous ? 'Anonymous' : r.profiles?.full_name || 'Member'} • {new Date(r.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <span className={`badge ${r.status === 'reviewed' ? 'badge-success' : r.status === 'praying' ? 'badge-primary' : 'badge-warning'}`}>{r.status}</span>
                            </div>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>{r.description}</p>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-sm btn-secondary" onClick={() => updateStatus(r.id, 'praying')}><Heart size={14} /> Praying</button>
                                <button className="btn btn-sm btn-primary" onClick={() => updateStatus(r.id, 'reviewed')}><Check size={14} /> Reviewed</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
