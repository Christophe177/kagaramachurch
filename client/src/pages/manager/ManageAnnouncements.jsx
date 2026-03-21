import { useState, useEffect } from 'react';
import { announcementsAPI } from '../../services/api.js';
import { Megaphone, Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageAnnouncements() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ title: '', content: '', priority: 'normal' });

    useEffect(() => { load(); }, []);
    const load = async () => { try { setItems(await announcementsAPI.getAll()); } catch { setItems([]); } finally { setLoading(false); } };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editing) { await announcementsAPI.update(editing.id, form); toast.success('Updated'); }
            else { await announcementsAPI.create(form); toast.success('Published'); }
            setShowModal(false); setEditing(null); setForm({ title: '', content: '', priority: 'normal' }); load();
        } catch (err) { toast.error(err.message); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this announcement?')) return;
        try { await announcementsAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
    };

    const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Announcements</h1>
                    <p className="page-subtitle">Publish announcements to church members</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setForm({ title: '', content: '', priority: 'normal' }); setShowModal(true); }}>
                    <Plus size={16} /> New Announcement
                </button>
            </div>

            {loading ? <div className="loading-page"><div className="spinner" /></div> : items.length === 0 ? (
                <div className="empty-state"><Megaphone size={64} /><h3>No announcements</h3></div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {items.map(a => (
                        <div key={a.id} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>{a.title}</h3>
                                        <span className={`badge ${a.priority === 'urgent' ? 'badge-danger' : a.priority === 'important' ? 'badge-warning' : 'badge-info'}`}>{a.priority}</span>
                                    </div>
                                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{a.content}</p>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{new Date(a.created_at).toLocaleDateString()}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(a); setForm({ title: a.title, content: a.content, priority: a.priority }); setShowModal(true); }}><Edit2 size={15} /></button>
                                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(a.id)}><Trash2 size={15} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h2>{editing ? 'Edit' : 'New'} Announcement</h2><button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button></div>
                        <div className="modal-body">
                            <form onSubmit={handleSave}>
                                <div className="form-group"><label className="form-label">Title</label><input className="form-input" required value={form.title} onChange={update('title')} /></div>
                                <div className="form-group"><label className="form-label">Content</label><textarea className="form-input" required rows={4} value={form.content} onChange={update('content')} /></div>
                                <div className="form-group">
                                    <label className="form-label">Priority</label>
                                    <select className="form-select" value={form.priority} onChange={update('priority')}>
                                        <option value="normal">Normal</option><option value="important">Important</option><option value="urgent">Urgent</option>
                                    </select>
                                </div>
                                <div className="modal-footer" style={{ padding: 0, marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Publish'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
