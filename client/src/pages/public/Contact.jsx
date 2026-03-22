import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Send, Clock, Church, ArrowRight, Loader } from 'lucide-react';
import { ministryAPI } from '../../services/api';
import toast from 'react-hot-toast';
import churchHero from '../../assets/church_hero.png';
import eventsHero from '../../assets/events_hero.png';
import annHero from '../../assets/announcements_hero.png';

export default function Contact() {
    const backgroundImages = [
        churchHero,
        eventsHero,
        annHero
    ];
    const [bgIdx, setBgIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIdx((prev) => (prev + 1) % backgroundImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await ministryAPI.sendContact(form);
            toast.success('Message sent! We will get back to you soon.');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -20px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const scrollElements = document.querySelectorAll('.reveal');
        scrollElements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="contact-page">
            <style>{`
        .contact-hero {
          min-height: 90vh; display: flex; align-items: center; justify-content: center;
          text-align: center; padding: 6rem 2rem;
          position: relative; color: white; overflow: hidden; background: #000;
        }
        .hero-bg-layer {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          transition: background-image 1.5s ease-in-out, opacity 1.5s ease-in-out;
          z-index: 0;
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5));
          z-index: 1;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 1.25rem; border-radius: var(--radius-full);
          background: var(--color-primary-subtle); color: var(--color-primary);
          font-size: 0.82rem; font-weight: 600; margin-bottom: 2rem;
          text-transform: uppercase; letter-spacing: 0.1em;
        }
        .contact-hero h1 {
          font-size: 3.5rem; line-height: 1.15; margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #ffffff 40%, var(--color-primary));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; color: white; font-weight: 800;
        }
        .contact-hero p { color: rgba(255,255,255,0.9); max-width: 700px; margin: 0 auto 2.5rem; font-size: 1.2rem; line-height: 1.7; }
        .hero-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .contact-content {
          max-width: 1100px; margin: 0 auto; padding: 3rem 2rem 6rem;
          display: grid; grid-template-columns: 1fr 1.2fr; gap: 3rem;
        }
        .contact-info-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .contact-info-item {
          display: flex; gap: 1rem; padding: 1.5rem;
          background: var(--color-bg-card); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); transition: all var(--transition-base);
        }
        .contact-info-item:hover { border-color: rgba(37, 99, 235, 0.2); }
        .contact-info-icon {
          width: 48px; height: 48px; border-radius: var(--radius-md);
          background: var(--color-primary-subtle); color: var(--color-primary);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .contact-info-item h4 { font-size: 1rem; margin-bottom: 0.25rem; font-family: var(--font-body); font-weight: 600; }
        .contact-info-item p { color: var(--color-text-secondary); font-size: 0.9rem; }
        .contact-form {
          background: var(--color-bg-card); border: 1px solid var(--color-border);
          border-radius: var(--radius-xl); padding: 2.5rem;
        }
        .contact-form h3 { font-size: 1.4rem; margin-bottom: 1.5rem; font-family: var(--font-body); font-weight: 600; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; }
        }

        /* Scroll Animations */
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

            <section className="contact-hero">
                <div className="hero-bg-layer" style={{ backgroundImage: `url(${backgroundImages[bgIdx]})` }}></div>
                <div className="hero-overlay"></div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="hero-badge"><Church size={16} /> Welcome to Kagarama Church</div>
                    <h1>Contact Us</h1>
                    <p>We'd love to hear from you. Reach out with questions, prayer requests, or just to say hello.</p>
                    <div className="hero-buttons">
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Join Our Church <ArrowRight size={18} />
                        </Link>
                        <Link to="/about" className="btn btn-secondary btn-lg">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            <div className="contact-content">
                <div className="contact-info-list reveal">
                    <div className="contact-info-item">
                        <div className="contact-info-icon"><MapPin size={22} /></div>
                        <div>
                            <h4>Our Location</h4>
                            <p>Kagarama, Kicukiro District<br />Kigali, Rwanda</p>
                        </div>
                    </div>
                    <div className="contact-info-item">
                        <div className="contact-info-icon"><Phone size={22} /></div>
                        <div>
                            <h4>Phone</h4>
                            <p>0781737380</p>
                        </div>
                    </div>
                    <div className="contact-info-item">
                        <div className="contact-info-icon"><Mail size={22} /></div>
                        <div>
                            <h4>Email</h4>
                            <p>eearkagarama@gmail.com</p>
                        </div>
                    </div>
                    <div className="contact-info-item">
                        <div className="contact-info-icon"><Clock size={22} /></div>
                        <div>
                            <h4>Service Hours</h4>
                            <p>Sunday: 8:00 AM – 12:00 PM<br />Wednesday: 6:00 PM – 8:00 PM</p>
                        </div>
                    </div>
                </div>

                <form className="contact-form reveal" style={{ transitionDelay: '0.2s' }} onSubmit={handleSubmit}>
                    <h3>Send a Message</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Your Name</label>
                            <input className="form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input className="form-input" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email address" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Subject</label>
                        <input className="form-input" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Message</label>
                        <textarea className="form-input" required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Your message..." rows={5} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
                        {submitting ? <Loader className="animate-spin" size={18} /> : <Send size={18} />}
                        {submitting ? ' Sending...' : ' Send Message'}
                    </button>
                </form>
            </div>

            {/* Map Section */}
            <div className="reveal" style={{
                maxWidth: '1100px', margin: '0 auto', padding: '0 2rem 4rem',
            }}>
                <div style={{
                    textAlign: 'center', marginBottom: '2rem',
                }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Find Us</h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                        Kagarama, Kicukiro District – Des Amis, Kigali, Rwanda
                    </p>
                </div>
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem',
                    borderRadius: '16px', overflow: 'hidden',
                    border: '2px solid rgba(37, 99, 235, 0.2)',
                    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
                }}>
                    <div style={{ position: 'relative' }}>
                        <img 
                            src="https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=OzJD60LVaOy0Bhw7l4Hg9A&cb_client=search.gws-prod.gps&yaw=97.33907&pitch=0&thumbfov=100&w=600&h=400" 
                            alt="ADEPR Kagarama Street View" 
                            style={{ width: '100%', height: '400px', objectFit: 'cover', display: 'block' }}
                        />
                        <div style={{
                            position: 'absolute', bottom: '1rem', left: '1rem',
                            background: 'rgba(0,0,0,0.6)', color: 'white',
                            padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
                            fontSize: '0.8rem', backdropFilter: 'blur(4px)'
                        }}>
                            Street View Preview
                        </div>
                    </div>
                    <iframe
                        title="Kagarama Church Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1993.7449!2d30.0988!3d-1.9961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca6823c965b0b%3A0xe744e27f9188d3e9!2sADEPR%20Kagarama!5e0!3m2!1sen!2srw!4v1710890000000"
                        width="100%"
                        height="400"
                        style={{ border: 0, display: 'block' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </div>
    );
}
