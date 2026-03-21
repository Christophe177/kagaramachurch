import { useState, useEffect } from 'react';
import { photosAPI } from '../../services/api.js';
import { Image, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PhotoOfDay() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ title: '', media: null, caption: '' });

    useEffect(() => { load(); }, []);
    const load = async () => { try { setPhotos(await photosAPI.getAll()); } catch { setPhotos([]); } finally { setLoading(false); } };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!form.media) return toast.error('Please select a photo or video');
        
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('caption', form.caption);
        formData.append('media', form.media);

        try { 
            await photosAPI.create(formData); 
            toast.success('Media posted!'); 
            setShowModal(false); 
            setForm({ title: '', media: null, caption: '' }); 
            load(); 
        }
        catch (err) { toast.error(err.message); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        try { await photosAPI.delete(id); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Media of the Day</h1>
                    <p className="page-subtitle">Post daily photos or videos for the congregation</p>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}><Plus size={16} /> Post Media</button>
            </div>

            <style>{`
        .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }
        .photo-card { overflow: hidden; }
        .photo-card img, .photo-card video { width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 1rem; }
        .photo-placeholder {
          width: 100%; height: 200px; border-radius: var(--radius-md);
          background: var(--color-bg-secondary); display: flex; align-items: center;
          justify-content: center; margin-bottom: 1rem; color: var(--color-text-muted);
        }
      `}</style>

            {loading ? <div className="loading-page"><div className="spinner" /></div> : photos.length === 0 ? (
                <div className="empty-state"><Image size={64} /><h3>No media posted</h3><p>Post your first media of the day.</p></div>
            ) : (
                <div className="photo-grid">
                    {photos.map(p => (
                        <div key={p.id} className="card photo-card">
                            {p.media_type === 'video' ? (
                                <video src={p.file_path} />
                            ) : (
                                <img src={p.file_path || p.image_url} alt={p.title} />
                            )}
                            <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-body)', fontWeight: 600, marginBottom: '0.25rem' }}>{p.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem' }}>{p.caption}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                                    {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Just posted'}
                                </span>
                                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }} onClick={() => handleDelete(p.id)}><Trash2 size={15} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h2>Post Media of the Day</h2><button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button></div>
                        <div className="modal-body">
                            <form onSubmit={handlePost}>
                                <div className="form-group"><label className="form-label">Title</label><input className="form-input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                                <div className="form-group">
                                    <label className="form-label">Media File (Photo or Video)</label>
                                    <input type="file" className="form-input" accept="image/*,video/*" required onChange={e => setForm({ ...form, media: e.target.files[0] })} />
                                </div>
                                <div className="form-group"><label className="form-label">Caption</label><textarea className="form-input" rows={3} value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} /></div>
                                <div className="modal-footer" style={{ padding: 0, marginTop: '1rem' }}>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Post Media</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
