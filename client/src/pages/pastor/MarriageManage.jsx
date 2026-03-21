import { useState, useEffect } from 'react';
import { marriageAPI } from '../../services/api.js';
import { Gem, Check, X as XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MarriageManage() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { setRegistrations(await marriageAPI.getAll()); } catch { } finally { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        try {
            await marriageAPI.update(id, { status });
            toast.success(status === 'approved' ? 'Approved! New family created.' : `Registration ${status}`);
            load();
        } catch { toast.error('Failed to update'); }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Marriage Registrations</h1>
                    <p className="page-subtitle">Review and manage marriage registrations. Approved marriages auto-create a new family.</p>
                </div>
            </div>

            {loading ? <div className="loading-page"><div className="spinner" /></div> : registrations.length === 0 ? (
                <div className="empty-state"><Gem size={64} /><h3>No registrations</h3><p>Marriage registrations will appear here.</p></div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {registrations.map(r => (
                        <div key={r.id} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                                        {r.spouse1_name} & {r.spouse2_name}
                                    </h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                                        Marriage Date: {r.marriage_date} • Submitted: {new Date(r.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`badge ${r.status === 'approved' ? 'badge-success' : r.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>{r.status}</span>
                            </div>
                            <div style={{
                                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0',
                                padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Spouse 1 ID</div>
                                    <div style={{ fontSize: '0.9rem' }}>{r.spouse1_id}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Spouse 2 ID</div>
                                    <div style={{ fontSize: '0.9rem' }}>{r.spouse2_id}</div>
                                </div>
                            </div>
                            {r.recommendation_url && (
                                <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                                    📎 <a href={r.recommendation_url} target="_blank" rel="noreferrer">View Recommendation</a>
                                </p>
                            )}
                            {r.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-sm btn-primary" onClick={() => updateStatus(r.id, 'approved')}><Check size={14} /> Approve & Create Family</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => updateStatus(r.id, 'rejected')}><XIcon size={14} /> Reject</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
