import { useState, useEffect } from 'react';
import { eventsAPI } from '../../services/api.js';
import { Calendar, Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', event_date: '', location: '', image_url: '' });

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { setEvents(await eventsAPI.getAll()); } catch { setEvents([]); } finally { setLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await eventsAPI.update(editing.id, form); toast.success('Event updated'); }
            else { await eventsAPI.create(form); toast.success('Event created'); }
            setShowModal(false); setEditing(null);
            setForm({ title: '', description: '', event_date: '', location: '', image_url: '' });
            load();
        } catch (err) { toast.error(err.message || 'Failed to save'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this event?')) return;
        try { await eventsAPI.delete(id); toast.success('Event deleted'); load(); }
        catch { toast.error('Failed to delete'); }
    };

    const openEdit = (e) => {
        setEditing(e);
        setForm({ title: e.title, description: e.description, event_date: e.event_date, location: e.location, image_url: e.image_url || '' });
        setShowModal(true);
    };

    const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Manage Events</h1>
                    <p className="page-subtitle">Create, update, and manage church events</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setForm({ title: '', description: '', event_date: '', location: '', image_url: '' }); setShowModal(true); }}>
                    <Plus size={16} /> New Event
                </button>
            </div>

            {loading ? <div className="loading-page"><div className="spinner" /></div> : events.length === 0 ? (
                <div className="empty-state"><Calendar size={64} /><h3>No events yet</h3><p>Create your first church event.</p></div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {events.map(e => (
                        <div key={e.id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>{e.title}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{e.event_date} • {e.location}</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>{e.description}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(e)}><Edit2 size={15} /></button>
                                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(e.id)}><Trash2 size={15} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editing ? 'Edit Event' : 'Create Event'}</h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSave}>
                                <div className="form-group"><label className="form-label">Title</label><input className="form-input" required value={form.title} onChange={update('title')} /></div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" required value={form.event_date} onChange={update('event_date')} /></div>
                                    <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={form.location} onChange={update('location')} /></div>
                                </div>
                                <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={3} value={form.description} onChange={update('description')} /></div>
                                <div className="modal-footer" style={{ padding: 0, marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Event</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
