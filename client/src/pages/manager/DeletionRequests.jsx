import { useState, useEffect } from 'react';
import { familiesAPI } from '../../services/api.js';
import { Trash2, Check, X as XIcon, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DeletionRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);
    const load = async () => { try { setRequests(await familiesAPI.getDeletionRequests()); } catch { setRequests([]); } finally { setLoading(false); } };

    const review = async (id, status) => {
        try {
            await familiesAPI.reviewDeletion(id, { status });
            toast.success(status === 'approved' ? 'Deletion approved' : 'Request rejected');
            load();
        } catch { toast.error('Failed to process'); }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Deletion Requests</h1>
                    <p className="page-subtitle">Review requests from parents to remove children from families</p>
                </div>
            </div>

            {loading ? <div className="loading-page"><div className="spinner" /></div> : requests.length === 0 ? (
                <div className="empty-state"><Trash2 size={64} /><h3>No deletion requests</h3><p>When parents request to remove children from families, they'll appear here.</p></div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {requests.map(r => (
                        <div key={r.id} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-body)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <AlertTriangle size={18} color="var(--color-warning)" />
                                        Deletion Request for: {r.members?.full_name || 'Unknown'}
                                    </h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                        Family: {r.families?.name || 'Unknown'} • Submitted: {new Date(r.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`badge ${r.status === 'approved' ? 'badge-success' : r.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>{r.status}</span>
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '1rem' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Reason for Deletion</div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{r.reason}</p>
                            </div>
                            {r.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-sm btn-primary" onClick={() => review(r.id, 'approved')}><Check size={14} /> Approve Deletion</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => review(r.id, 'rejected')}><XIcon size={14} /> Reject</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
