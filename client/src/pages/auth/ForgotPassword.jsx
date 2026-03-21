import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api.js';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';
import bgImage from '../../assets/auth-bg.png';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [debugToken, setDebugToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authAPI.forgotPassword(email);
            toast.success('Reset request sent!');
            setSubmitted(true);
            if (res.debug_token) {
                setDebugToken(res.debug_token);
            }
        } catch (err) {
            toast.error(err.message || 'Failed to send request');
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
        .auth-container { width: 100%; max-width: 440px; background: var(--color-bg-card); border-radius: var(--radius-xl); padding: 2.5rem; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .debug-info { margin-top: 1.5rem; padding: 1rem; background: #fef9c3; border-radius: var(--radius-md); border: 1px solid #fde047; font-size: 0.85rem; }
      `}</style>
            
            <div className="auth-container">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src={logo} alt="Logo" style={{ height: 40, marginBottom: '1rem' }} />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Forgot Password?</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        Enter your email and we'll help you reset your password.
                    </p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="password-wrapper">
                                <input className="form-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                            {loading ? <div className="spinner" style={{ width: 22, height: 22 }} /> : <><Send size={18} /> Send Reset Link</>}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ padding: '2rem', background: 'var(--color-primary-subtle)', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
                            <Mail size={48} color="var(--color-primary)" />
                        </div>
                        <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
                            If an account exists, a reset link will be available below. (Simulation)
                        </p>
                        {debugToken && (
                            <div className="debug-info">
                                <strong>Simulation Mode:</strong><br/>
                                Click below to proceed to the reset page:<br/>
                                <Link to={`/reset-password/${debugToken}`} style={{ color: 'var(--color-primary)', fontWeight: 600, display: 'block', marginTop: '0.5rem' }}>
                                    Reset Password Now
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
