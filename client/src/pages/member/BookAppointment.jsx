import { useState, useEffect } from 'react';
import { appointmentsAPI } from '../../services/api.js';
import { Clock, Send, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BookAppointment() {
    const [form, setForm] = useState({ title: '', description: '', preferred_date: '', preferred_time: '' });
    const [myAppointments, setMyAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadMine();
    }, []);

    const loadMine = async () => {
        try {
            const data = await appointmentsAPI.getMine();
            setMyAppointments(data);
        } catch { }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await appointmentsAPI.book(form);
            toast.success('Appointment booked!');
            setForm({ title: '', description: '', preferred_date: '', preferred_time: '' });
            loadMine();
        } catch (err) {
            toast.error(err.message || 'Failed to book');
        } finally {
            setLoading(false);
        }
    };

    const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Book an Appointment</h1>
                    <p className="page-subtitle">Schedule a meeting with the pastor</p>
                </div>
            </div>

            <style>{`
        .appt-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .appt-item { padding: 1rem; border-bottom: 1px solid var(--color-border); }
        .appt-item:last-child { border-bottom: none; }
        .appt-item h4 { font-size: 0.95rem; font-family: var(--font-body); font-weight: 600; margin-bottom: 0.25rem; }
        .appt-item-meta { font-size: 0.8rem; color: var(--color-text-muted); display: flex; gap: 1rem; margin-top: 0.5rem; }
        .time-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 768px) { .appt-layout { grid-template-columns: 1fr; } .time-row { grid-template-columns: 1fr; } }
      `}</style>

            <div className="appt-layout">
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>New Appointment</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Subject</label>
                            <input className="form-input" required value={form.title} onChange={update('title')} placeholder="Reason for appointment" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Details</label>
                            <textarea className="form-input" value={form.description} onChange={update('description')} placeholder="Additional details..." rows={3} />
                        </div>
                        <div className="time-row">
                            <div className="form-group">
                                <label className="form-label">Preferred Date</label>
                                <input className="form-input" type="date" required value={form.preferred_date} onChange={update('preferred_date')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Preferred Time</label>
                                <input className="form-input" type="time" required value={form.preferred_time} onChange={update('preferred_time')} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><Send size={16} /> Book Appointment</>}
                        </button>
                    </form>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>My Appointments</h3>
                    {myAppointments.length === 0 ? (
                        <div className="empty-state" style={{ padding: '2rem 0' }}>
                            <Calendar size={40} />
                            <p>No appointments booked</p>
                        </div>
                    ) : (
                        myAppointments.map(a => (
                            <div key={a.id} className="appt-item">
                                <h4>{a.title}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{a.description}</p>
                                <div className="appt-item-meta">
                                    <span className={`badge ${a.status === 'confirmed' ? 'badge-success' : a.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>{a.status}</span>
                                    <span>{a.preferred_date} at {a.preferred_time}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
