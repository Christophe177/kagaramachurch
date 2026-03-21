import { useState, useEffect } from 'react';
import { prayerAPI } from '../../services/api.js';
import { Heart, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PrayerRequest() {
    const [form, setForm] = useState({ title: '', description: '', is_anonymous: false });
    const [myRequests, setMyRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadMyRequests();
    }, []);

    const loadMyRequests = async () => {
        try {
            const data = await prayerAPI.getMine();
            setMyRequests(data);
        } catch { }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await prayerAPI.submit(form);
            toast.success('Prayer request submitted!');
            setForm({ title: '', description: '', is_anonymous: false });
            loadMyRequests();
        } catch (err) {
            toast.error(err.message || 'Failed to submit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Prayer Requests</h1>
                    <p className="page-subtitle">Share your prayer needs with the pastor</p>
                </div>
            </div>

            <style>{`
        .prayer-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .prayer-list-card { max-height: 500px; overflow-y: auto; }
        .prayer-item { padding: 1rem; border-bottom: 1px solid var(--color-border); }
        .prayer-item:last-child { border-bottom: none; }
        .prayer-item h4 { font-size: 0.95rem; font-family: var(--font-body); font-weight: 600; margin-bottom: 0.25rem; }
        .prayer-item p { font-size: 0.85rem; color: var(--color-text-secondary); }
        .prayer-item-meta { font-size: 0.75rem; color: var(--color-text-muted); margin-top: 0.5rem; display: flex; justify-content: space-between; }
        @media (max-width: 768px) { .prayer-layout { grid-template-columns: 1fr; } }
      `}</style>

            <div className="prayer-layout">
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>New Prayer Request</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input className="form-input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Brief title for your request" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Prayer Request</label>
                            <textarea className="form-input" required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Share your prayer need..." rows={5} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                <input type="checkbox" checked={form.is_anonymous} onChange={e => setForm({ ...form, is_anonymous: e.target.checked })} />
                                Submit anonymously
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><Send size={16} /> Submit Request</>}
                        </button>
                    </form>
                </div>

                <div className="card prayer-list-card">
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>My Requests</h3>
                    {myRequests.length === 0 ? (
                        <div className="empty-state" style={{ padding: '2rem 0' }}>
                            <Heart size={40} />
                            <p>No prayer requests yet</p>
                        </div>
                    ) : (
                        myRequests.map(r => (
                            <div key={r.id} className="prayer-item">
                                <h4>{r.title}</h4>
                                <p>{r.description}</p>
                                <div className="prayer-item-meta">
                                    <span className={`badge ${r.status === 'reviewed' ? 'badge-success' : r.status === 'praying' ? 'badge-primary' : 'badge-warning'}`}>{r.status}</span>
                                    <span>{new Date(r.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
