import { useState, useEffect } from 'react';
import { baptismAPI } from '../../services/api.js';
import { Droplets, Check, X as XIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BaptismManage() {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { setRegistrations(await baptismAPI.getAll()); } catch { } finally { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        try {
            await baptismAPI.update(id, { status });
            toast.success(`Registration ${status}`);
            load();
        } catch { toast.error('Failed to update'); }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Baptism / Kwakirwa</h1>
                    <p className="page-subtitle">Manage baptism and kwakirwa registrations</p>
                </div>
            </div>

            {loading ? <div className="loading-page"><div className="spinner" /></div> : registrations.length === 0 ? (
                <div className="empty-state"><Droplets size={64} /><h3>No registrations</h3><p>Baptism and kwakirwa registrations will appear here.</p></div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead><tr><th>Name</th><th>Type</th><th>National ID</th><th>Family Details</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>{registrations.map(r => (
                            <tr key={r.id}>
                                <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{r.full_name}</td>
                                <td><span className={`badge ${r.registration_type === 'baptism' ? 'badge-info' : 'badge-primary'}`}>{r.registration_type === 'baptism' ? 'Baptism' : 'Kwakirwa'}</span></td>
                                <td>{r.national_id}</td>
                                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.family_details}</td>
                                <td><span className={`badge ${r.status === 'approved' ? 'badge-success' : r.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>{r.status}</span></td>
                                <td>
                                    {r.status === 'pending' && (
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button className="btn btn-sm btn-primary" onClick={() => updateStatus(r.id, 'approved')}><Check size={14} /></button>
                                            <button className="btn btn-sm btn-danger" onClick={() => updateStatus(r.id, 'rejected')}><XIcon size={14} /></button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
