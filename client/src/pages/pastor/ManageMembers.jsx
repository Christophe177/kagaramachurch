import { useState, useEffect } from 'react';
import { membersAPI } from '../../services/api.js';
import { Users, Plus, Edit2, Trash2, Printer, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ full_name: '', national_id: '', education_level: '', phone: '', home_location: '', hobbies: '' });

    useEffect(() => { loadMembers(); }, []);

    const loadMembers = async () => {
        try {
            const data = await membersAPI.getAll();
            setMembers(data);
        } catch { setMembers([]); } finally { setLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await membersAPI.update(editing.id, form);
                toast.success('Member updated');
            } else {
                await membersAPI.create(form);
                toast.success('Member added');
            }
            setShowModal(false);
            setEditing(null);
            setForm({ full_name: '', national_id: '', education_level: '', phone: '', home_location: '', hobbies: '' });
            loadMembers();
        } catch (err) {
            toast.error(err.message || 'Failed to save');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this member?')) return;
        try {
            await membersAPI.delete(id);
            toast.success('Member deleted');
            loadMembers();
        } catch (err) {
            toast.error(err.message || 'Failed to delete');
        }
    };

    const openEdit = (m) => {
        setEditing(m);
        setForm({ full_name: m.full_name, national_id: m.national_id, education_level: m.education_level, phone: m.phone, home_location: m.home_location, hobbies: m.hobbies });
        setShowModal(true);
    };

    const printMembers = () => {
        const printContent = `
      <html><head><title>Church Members List</title>
      <style>body{font-family:Arial;padding:2rem}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f4f4f4}h1{color:#333}</style></head>
      <body><h1>Kagarama Church – Members List</h1><p>Total: ${filtered.length} members</p>
      <table><tr><th>#</th><th>Name</th><th>ID</th><th>Phone</th><th>Location</th><th>Education</th></tr>
      ${filtered.map((m, i) => `<tr><td>${i + 1}</td><td>${m.full_name}</td><td>${m.national_id}</td><td>${m.phone}</td><td>${m.home_location}</td><td>${m.education_level}</td></tr>`).join('')}
      </table></body></html>`;
        const win = window.open('', '_blank');
        win.document.write(printContent);
        win.document.close();
        win.print();
    };

    const filtered = members.filter(m =>
        m.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        m.phone?.includes(search) ||
        m.national_id?.includes(search)
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Church Members</h1>
                    <p className="page-subtitle">Manage all registered church members</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={printMembers}><Printer size={16} /> Print List</button>
                    <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setForm({ full_name: '', national_id: '', education_level: '', phone: '', home_location: '', hobbies: '' }); setShowModal(true); }}>
                        <Plus size={16} /> Add Member
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem', position: 'relative', maxWidth: 400 }}>
                <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="Search members..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {loading ? (
                <div className="loading-page"><div className="spinner" /></div>
            ) : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead><tr><th>Name</th><th>National ID</th><th>Phone</th><th>Location</th><th>Education</th><th>Actions</th></tr></thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={6}><div className="empty-state"><Users size={40} /><p>No members found</p></div></td></tr>
                            ) : filtered.map(m => (
                                <tr key={m.id}>
                                    <td style={{ fontWeight: 600, color: 'var(--color-text)' }}>{m.full_name}</td>
                                    <td>{m.national_id}</td>
                                    <td>{m.phone}</td>
                                    <td>{m.home_location}</td>
                                    <td><span className="badge badge-primary">{m.education_level}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(m)}><Edit2 size={15} /></button>
                                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(m.id)}><Trash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editing ? 'Edit Member' : 'Add New Member'}</h2>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSave}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input className="form-input" required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">National ID</label>
                                        <input className="form-input" required value={form.national_id} onChange={e => setForm({ ...form, national_id: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone</label>
                                        <input className="form-input" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Home Location</label>
                                    <input className="form-input" value={form.home_location} onChange={e => setForm({ ...form, home_location: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Education Level</label>
                                    <select className="form-select" value={form.education_level} onChange={e => setForm({ ...form, education_level: e.target.value })}>
                                        <option value="">Select</option><option value="primary">Primary</option><option value="secondary">Secondary</option>
                                        <option value="university">University</option><option value="masters">Master's</option><option value="doctorate">Doctorate</option>
                                    </select>
                                </div>
                                <div className="modal-footer" style={{ padding: 0, marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'} Member</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
