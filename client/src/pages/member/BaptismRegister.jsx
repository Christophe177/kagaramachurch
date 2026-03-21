import { useState } from 'react';
import { baptismAPI } from '../../services/api.js';
import { Droplets, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BaptismRegister() {
    const [form, setForm] = useState({
        full_name: '', national_id: '', family_details: '', registration_type: 'baptism',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await baptismAPI.register(form);
            toast.success('Registration submitted successfully!');
            setSubmitted(true);
        } catch (err) {
            toast.error(err.message || 'Failed to submit');
        } finally {
            setLoading(false);
        }
    };

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    if (submitted) {
        return (
            <div className="empty-state" style={{ paddingTop: '4rem' }}>
                <CheckCircle size={64} color="var(--color-success)" />
                <h3>Registration Submitted!</h3>
                <p>Your {form.registration_type === 'baptism' ? 'Baptism (Iz Baptiised)' : 'Kwakirwa'} registration has been submitted. The pastor will review it.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Baptism / Kwakirwa Registration</h1>
                    <p className="page-subtitle">Register for Baptism (Iz Baptiised) or Kwakirwa</p>
                </div>
            </div>

            <div className="card" style={{ maxWidth: 700 }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Registration Type</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {['baptism', 'kwakirwa'].map(type => (
                                <label key={type} style={{
                                    flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    padding: '1rem', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                                    border: `2px solid ${form.registration_type === type ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                    background: form.registration_type === type ? 'var(--color-primary-subtle)' : 'transparent',
                                    transition: 'all 0.2s',
                                }}>
                                    <input type="radio" name="type" value={type} checked={form.registration_type === type}
                                        onChange={() => setForm({ ...form, registration_type: type })} style={{ display: 'none' }} />
                                    <Droplets size={20} color={form.registration_type === type ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                                    <span style={{ fontWeight: 600, color: form.registration_type === type ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                                        {type === 'baptism' ? 'Baptism (Iz Baptiised)' : 'Kwakirwa'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input className="form-input" required value={form.full_name} onChange={update('full_name')} placeholder="Your full name" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">National ID</label>
                        <input className="form-input" required value={form.national_id} onChange={update('national_id')} placeholder="National ID number" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Family Details</label>
                        <textarea className="form-input" required value={form.family_details} onChange={update('family_details')}
                            placeholder="Describe your family details (parents' names, family group, etc.)" rows={4} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><Droplets size={18} /> Submit Registration</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
