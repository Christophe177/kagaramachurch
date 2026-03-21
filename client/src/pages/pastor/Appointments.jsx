import { useState, useEffect } from 'react';
import { appointmentsAPI } from '../../services/api.js';
import { Clock, Check, X as XIcon, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { setAppointments(await appointmentsAPI.getAll()); } catch { } finally { setLoading(false); }
    };

    const updateStatus = async (id, status) => {
        try {
            await appointmentsAPI.update(id, { status });
            toast.success(`Appointment ${status}`);
            load();
        } catch { toast.error('Failed to update'); }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Appointments</h1>
                    <p className="page-subtitle">View and manage booked appointments from members</p>
                </div>
            </div>

            {loading ? <div className="loading-page"><div className="spinner" /></div> : appointments.length === 0 ? (
                <div className="empty-state"><Calendar size={64} /><h3>No appointments</h3><p>Booked appointments will appear here.</p></div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead><tr><th>Member</th><th>Subject</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>{appointments.map(a => (
                            <tr key={a.id}>
                                <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{a.profiles?.full_name || 'Member'}</td>
                                <td>{a.title}</td>
                                <td>{a.preferred_date}</td>
                                <td>{a.preferred_time}</td>
                                <td><span className={`badge ${a.status === 'confirmed' ? 'badge-success' : a.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>{a.status}</span></td>
                                <td>
                                    {a.status === 'pending' && (
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button className="btn btn-sm btn-primary" onClick={() => updateStatus(a.id, 'confirmed')}><Check size={14} /></button>
                                            <button className="btn btn-sm btn-danger" onClick={() => updateStatus(a.id, 'cancelled')}><XIcon size={14} /></button>
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
