import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Church, ArrowRight, Send, CheckCircle, Mail, Phone, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ministryAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function JoinMinistry() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const ministryFromUrl = searchParams.get('ministry');

    const [form, setForm] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        ministry_name: ministryFromUrl || '',
        message: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const ministries = [
        'Worship Ministry',
        'Intercession Ministry',
        'Ushering Ministry',
        'Youth Ministry',
        'Media Ministry',
        'Men\'s Ministry',
        'Women\'s Ministry'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = { ...form, user_id: user?.id };
            await ministryAPI.join(data);
            setSuccess(true);
            toast.success('Application submitted successfully!');
            setTimeout(() => navigate('/'), 5000);
        } catch (err) {
            console.error('Submission failed:', err);
            toast.error(err.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="join-ministry-page">
                <style>{`
                    .success-container {
                        min-height: 80vh;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        padding: 2rem;
                    }
                    .success-card {
                        background: white;
                        padding: 4rem 2rem;
                        border-radius: 2rem;
                        box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                        max-width: 500px;
                        width: 100%;
                    }
                    .success-icon {
                        color: #10b981;
                        margin-bottom: 2rem;
                    }
                    .success-card h2 { font-size: 2rem; margin-bottom: 1rem; color: #1e293b; }
                    .success-card p { color: #64748b; margin-bottom: 2rem; line-height: 1.6; }
                `}</style>
                <div className="success-container">
                    <div className="success-card">
                        <CheckCircle size={80} className="success-icon" />
                        <h2>Application Received!</h2>
                        <p>Thank you for your interest in the {form.ministry_name}. Your request has been sent to our leaders, and we will contact you soon.</p>
                        <Link to="/" className="btn btn-primary">Back to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="join-ministry-page">
            <style>{`
                .join-hero {
                    min-height: 40vh;
                    background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80');
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    text-align: center;
                    padding: 2rem;
                }
                .join-hero h1 { font-size: 3rem; margin-bottom: 1rem; }
                .join-container {
                    max-width: 800px;
                    margin: -5rem auto 6rem;
                    padding: 0 2rem;
                    position: relative;
                    z-index: 2;
                }
                .join-form-card {
                    background: white;
                    padding: 3.5rem;
                    border-radius: 2rem;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.15);
                }
                .form-header { margin-bottom: 3rem; text-align: center; }
                .form-header h2 { font-size: 1.8rem; color: #1e293b; margin-bottom: 0.5rem; }
                .form-header p { color: #64748b; }
                
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
                .form-group { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }
                .form-group label { font-size: 0.9rem; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 0.5rem; }
                .form-group input, .form-group select, .form-group textarea {
                    padding: 0.9rem 1.2rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    outline: none;
                    transition: all 0.2s;
                    background: #f8fafc;
                }
                .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
                    border-color: var(--color-primary);
                    background: white;
                    box-shadow: 0 0 0 4px var(--color-primary-subtle);
                }
                .btn-submit {
                    width: 100%;
                    padding: 1.1rem;
                    border-radius: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                @media (max-width: 640px) {
                    .form-grid { grid-template-columns: 1fr; }
                    .join-form-card { padding: 2rem 1.5rem; }
                }
            `}</style>

            <header className="join-hero">
                <div>
                    <h1>Serve the Lord</h1>
                    <p>Dedicated to building God's Kingdom through active ministry service.</p>
                </div>
            </header>

            <div className="join-container">
                <div className="join-form-card">
                    <div className="form-header">
                        <h2>Ministry Application</h2>
                        <p>Tell us a bit about yourself and why you'd like to join.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label><User size={16} /> Full Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={form.full_name}
                                    onChange={e => setForm({...form, full_name: e.target.value})}
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div className="form-group">
                                <label><Mail size={16} /> Email Address</label>
                                <input 
                                    type="email" 
                                    required 
                                    value={form.email}
                                    onChange={e => setForm({...form, email: e.target.value})}
                                    placeholder="yourname@gmail.com"
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label><Phone size={16} /> Phone Number</label>
                                <input 
                                    type="tel" 
                                    value={form.phone}
                                    onChange={e => setForm({...form, phone: e.target.value})}
                                    placeholder="+250 ..."
                                />
                            </div>
                            <div className="form-group">
                                <label><Church size={16} /> Select Ministry</label>
                                <select 
                                    required 
                                    value={form.ministry_name}
                                    onChange={e => setForm({...form, ministry_name: e.target.value})}
                                >
                                    <option value="">-- Choose a Ministry --</option>
                                    {ministries.map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label><MessageSquare size={16} /> Why do you want to join this ministry?</label>
                            <textarea 
                                rows="4"
                                value={form.message}
                                onChange={e => setForm({...form, message: e.target.value})}
                                placeholder="Tell us about your motivation or any special skills you have."
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            className="btn btn-primary btn-submit"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                    Submit Application <Send size={18} />
                                </span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
