import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';
import bgImage from '../../assets/auth-bg.png';

export default function Register() {
    const [form, setForm] = useState({ full_name: '', email: '', password: '', confirmPassword: '', role: 'member' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (form.password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }
        setLoading(true);
        try {
            await register({ full_name: form.full_name, email: form.email, password: form.password, role: form.role });
            toast.success('Registration successful! Please sign in.');
            navigate('/login');
        } catch (err) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    return (
        <div className="auth-page">
            <style>{`
        .auth-page {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 2rem;
          background: linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.25)),
                      url(${bgImage});
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }
        .auth-card {
          width: 100%; max-width: 480px;
          background: var(--color-bg-card); border: 1px solid var(--color-border);
          border-radius: var(--radius-xl); padding: 2.5rem;
          animation: fadeInUp 0.5s ease;
        }
        .auth-logo {
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          font-family: var(--font-heading); font-size: 1.5rem; color: var(--color-primary);
          margin-bottom: 2rem; text-decoration: none;
        }
        .auth-title { text-align: center; font-size: 1.6rem; margin-bottom: 0.5rem; }
        .auth-subtitle { text-align: center; color: var(--color-text-secondary); margin-bottom: 2rem; font-size: 0.9rem; }
        .password-wrapper { position: relative; }
        .password-toggle {
          position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
          background: none; color: var(--color-text-muted); padding: 0.25rem;
        }
        .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: var(--color-text-secondary); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .role-info { 
          font-size: 0.78rem; color: var(--color-text-muted); margin-top: 0.35rem;
          font-style: italic;
        }
      `}</style>

            <div className="auth-card">
                <Link to="/" className="auth-logo">
                    <img src={logo} alt="Kagarama CMS" style={{ height: '40px', width: 'auto' }} /> Kagarama CMS
                </Link>
                <h1 className="auth-title">Create Account</h1>
                <p className="auth-subtitle">Join our church community</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input className="form-input" required value={form.full_name} onChange={update('full_name')} placeholder="Your full name" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input className="form-input" type="email" required value={form.email} onChange={update('email')} placeholder="your@email.com" />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="password-wrapper">
                                <input className="form-input" type={showPass ? 'text' : 'password'} required value={form.password} onChange={update('password')} placeholder="Min 6 characters" />
                                <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input className="form-input" type="password" required value={form.confirmPassword} onChange={update('confirmPassword')} placeholder="Repeat password" />
                        </div>
                    </div>
                    {/* Role is forced to 'member' in the initial state and hidden from the UI */}
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
                        {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><UserPlus size={18} /> Create Account</>}
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
