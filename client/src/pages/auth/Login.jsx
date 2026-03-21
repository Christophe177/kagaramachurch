import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';
import bgImage from '../../assets/auth-bg.png';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(email, password);
            toast.success('Welcome back!');
            const role = user.role || user.profile?.role;
            navigate(role === 'pastor' ? '/pastor' : role === 'manager' ? '/manager' : '/member');
        } catch (err) {
            toast.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

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
          width: 100%; max-width: 440px;
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
      `}</style>

            <div className="auth-card">
                <Link to="/" className="auth-logo">
                    <img src={logo} alt="Kagarama CMS" style={{ height: '40px', width: 'auto' }} /> Kagarama CMS
                </Link>
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">Sign in to access your dashboard</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input className="form-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="password-wrapper">
                            <input className="form-input" type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
                            <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)}>
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
                        <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                            Forgot password?
                        </Link>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                        {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><LogIn size={18} /> Sign In</>}
                    </button>
                </form>
                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}
