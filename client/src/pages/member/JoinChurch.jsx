import { useState } from 'react';
import { membersAPI } from '../../services/api.js';
import { UserPlus, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JoinChurch() {
    const [form, setForm] = useState({
        full_name: '', national_id: '', education_level: '', phone: '', home_location: '', hobbies: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await membersAPI.create(form);
            toast.success('Welcome to the church!');
            setSubmitted(true);
        } catch (err) {
            toast.error(err.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    if (submitted) {
        return (
            <div className="empty-state" style={{ paddingTop: '4rem' }}>
                <CheckCircle size={64} color="var(--color-success)" />
                <h3>Registration Complete!</h3>
                <p>You have been registered as a church member. Welcome to the family!</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Join the Church</h1>
                    <p className="page-subtitle">Provide your details to register as a church member</p>
                </div>
            </div>

            <style>{`
        .join-form { max-width: 700px; }
        .join-form .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 600px) { .join-form .form-row { grid-template-columns: 1fr; } }
      `}</style>

            <div className="card join-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input className="form-input" required value={form.full_name} onChange={update('full_name')} placeholder="Your full name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">National ID</label>
                            <input className="form-input" required value={form.national_id} onChange={update('national_id')} placeholder="National ID number" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Education Level</label>
                            <select className="form-select" value={form.education_level} onChange={update('education_level')}>
                                <option value="">Select level</option>
                                <option value="primary">Primary</option>
                                <option value="secondary">Secondary</option>
                                <option value="university">University</option>
                                <option value="masters">Master's Degree</option>
                                <option value="doctorate">Doctorate</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input className="form-input" required value={form.phone} onChange={update('phone')} placeholder="+250 7XX XXX XXX" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Home Location</label>
                        <input className="form-input" required value={form.home_location} onChange={update('home_location')} placeholder="Your home address or area" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Hobbies & Interests</label>
                        <textarea className="form-input" value={form.hobbies} onChange={update('hobbies')} placeholder="Tell us about your hobbies and interests..." rows={3} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><UserPlus size={18} /> Register as Member</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
