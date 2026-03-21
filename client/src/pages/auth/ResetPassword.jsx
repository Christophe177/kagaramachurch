import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api.js';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import logo from '../../assets/logo.png';
import bgImage from '../../assets/auth-bg.png';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return toast.error('Passwords do not match');
        
        setLoading(true);
        try {
            await authAPI.resetPassword(token, password);
            toast.success('Password reset successfully!');
            setSuccess(true);
        } catch (err) {
            toast.error(err.message || 'Failed to reset password');
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
      `}</style>

            <div className="auth-container">
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src={logo} alt="Logo" style={{ height: 40, marginBottom: '1rem' }} />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Set New Password</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        Please choose a strong password for your account.
                    </p>
                </div>

                {!success ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <div className="password-wrapper">
                                <input className="form-input" type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 characters" minLength={6} />
                                <button type="button" className="password-toggle" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <div className="password-wrapper">
                                <input className="form-input" type={showPass ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm your new password" />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                            {loading ? <div className="spinner" style={{ width: 22, height: 22 }} /> : <><Lock size={18} /> Reset Password</>}
                        </button>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ padding: '2rem', background: '#ecfdf5', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem' }}>
                            <CheckCircle size={48} color="#10b981" />
                        </div>
                        <h3 style={{ marginBottom: '1rem' }}>All Set!</h3>
                        <p style={{ marginBottom: '2rem', color: 'var(--color-text-secondary)' }}>
                            Your password has been successfully updated. You can now sign in with your new credentials.
                        </p>
                        <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => navigate('/login')}>
                            Go to Login
                        </button>
                    </div>
                )}

                {!success && (
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
