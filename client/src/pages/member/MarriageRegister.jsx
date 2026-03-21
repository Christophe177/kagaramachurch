import { useState } from 'react';
import { marriageAPI } from '../../services/api.js';
import { Gem, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MarriageRegister() {
    const [form, setForm] = useState({
        spouse1_name: '', spouse1_id: '', spouse2_name: '', spouse2_id: '',
        marriage_date: '', recommendation_url: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await marriageAPI.register(form);
            toast.success('Marriage registration submitted!');
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
                <h3>Marriage Registration Submitted!</h3>
                <p>Your marriage registration is pending review. Once approved, a new family will be created for your household.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Marriage Registration</h1>
                    <p className="page-subtitle">Submit your marriage details for church records</p>
                </div>
            </div>

            <style>{`
        .marriage-form { max-width: 700px; }
        .spouse-section { padding: 1.5rem; border-radius: var(--radius-lg); background: var(--color-bg-secondary); margin-bottom: 1.5rem; border: 1px solid var(--color-border); }
        .spouse-section h3 { font-size: 1rem; font-family: var(--font-body); font-weight: 600; margin-bottom: 1rem; color: var(--color-primary); }
        .spouse-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 600px) { .spouse-row { grid-template-columns: 1fr; } }
      `}</style>

            <div className="card marriage-form">
                <form onSubmit={handleSubmit}>
                    <div className="spouse-section">
                        <h3>Spouse 1 Details</h3>
                        <div className="spouse-row">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input className="form-input" required value={form.spouse1_name} onChange={update('spouse1_name')} placeholder="Full name" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">National ID</label>
                                <input className="form-input" required value={form.spouse1_id} onChange={update('spouse1_id')} placeholder="ID number" />
                            </div>
                        </div>
                    </div>

                    <div className="spouse-section">
                        <h3>Spouse 2 Details</h3>
                        <div className="spouse-row">
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input className="form-input" required value={form.spouse2_name} onChange={update('spouse2_name')} placeholder="Full name" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">National ID</label>
                                <input className="form-input" required value={form.spouse2_id} onChange={update('spouse2_id')} placeholder="ID number" />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Marriage Date</label>
                        <input className="form-input" type="date" required value={form.marriage_date} onChange={update('marriage_date')} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Family Recommendation (URL)</label>
                        <input className="form-input" value={form.recommendation_url} onChange={update('recommendation_url')} placeholder="Link to uploaded recommendation document" />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                        {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><Gem size={18} /> Submit Registration</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
