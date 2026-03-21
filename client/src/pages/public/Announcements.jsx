import { useState, useEffect } from 'react';
import { announcementsAPI } from '../../services/api';
import { Megaphone, Calendar, Info, AlertCircle, AlertTriangle, Church, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import annPlaceholder from '../../assets/announcement_placeholder.png';
import churchHero from '../../assets/church_hero.png';
import eventsHero from '../../assets/events_hero.png';
import annHero from '../../assets/announcements_hero.png';

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

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

        const initObserver = () => {
            const scrollElements = document.querySelectorAll('.reveal:not(.revealed)');
            scrollElements.forEach(el => observer.observe(el));
        };

        const timer = setTimeout(initObserver, 500); 
        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, [announcements, loading]);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const data = await announcementsAPI.getAll();
            setAnnouncements(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
            console.error('Failed to fetch announcements:', err);
            setAnnouncements([
                { id: 1, title: 'Welcome New Regional Overseers', content: 'Join us in welcoming our new regional overseers who will be visiting all branches this month. Let us show them the love of the Kagarama community.', priority: 'important', created_at: new Date().toISOString() },
                { id: 2, title: 'Sunday School Registration Open', content: 'Registration is now open for children aged 5-12 for the upcoming semester. Please visit the admin office for details.', priority: 'normal', created_at: new Date(Date.now() - 86400000).toISOString() },
                { id: 3, title: 'Urgent: Choir Rehearsal Update', content: 'The choir rehearsal for this Friday has been moved to Saturday at 4 PM due to the upcoming youth conference.', priority: 'urgent', created_at: new Date(Date.now() - 172800000).toISOString() },
                { id: 4, title: 'Community Health Guidelines', content: 'We are updating our weekly service safety measures. Hand sanitizers will be provided at all entrances. Stay safe and blessed.', priority: 'normal', created_at: new Date(Date.now() - 259200000).toISOString() },
            ]);
            toast.error('Using sample announcements (Server connection failed)');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return '#ef4444';
            case 'important': return '#60a5fa';
            default: return '#3b82f6';
        }
    };

    if (loading) {
        return (
            <div className="loading-page">
                <div className="spinner"></div>
                <p>Loading announcements...</p>
            </div>
        );
    }

    return (
        <div className="announcements-page">
            <style>{`
        .ann-hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
          padding: 6rem 2rem;
          overflow: hidden; background: #000;
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
        .ann-hero h1 {
          font-size: 3.5rem; line-height: 1.15; margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #ffffff 40%, var(--color-primary));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; color: white;
          font-weight: 800; font-family: var(--font-heading);
          letter-spacing: -0.01em;
        }
        .ann-hero p {
          font-size: 1.15rem; color: rgba(255,255,255,0.9); max-width: 600px; margin: 0 auto 2.5rem;
          line-height: 1.7;
        }
        .hero-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

        .ann-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem 6rem;
        }

        .ann-list {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .ann-card {
          background: var(--color-bg-card);
          display: flex;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }

        .ann-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 45px rgba(0,0,0,0.1);
        }

        .ann-card-image {
          width: 30%;
          min-height: 220px;
          background-image: url(${annPlaceholder});
          background-size: cover;
          background-position: center;
        }

        .ann-card-content {
          width: 70%;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .ann-card-priority {
          position: absolute;
          top: 0;
          right: 0;
          padding: 0.5rem 1rem;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: white;
          border-bottom-left-radius: 4px;
        }

        .ann-card-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
          color: #222;
        }

        .ann-card-date {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #888;
          font-size: 0.85rem;
          margin-bottom: 1.2rem;
        }

        .ann-card-text {
          font-size: 0.95rem;
          color: #555;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        @media (max-width: 800px) {
          .ann-card-content { width: 100%; }
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

            <header className="ann-hero">
                <div className="hero-bg-layer" style={{ backgroundImage: `url(${backgroundImages[bgIdx]})` }}></div>
                <div className="hero-overlay"></div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="hero-badge"><Church size={16} /> Welcome to Kagarama Church</div>
                    <h1>Church Announcements</h1>
                    <p>Get the latest news, updates, and important notices from our church community.</p>
                    <div className="hero-buttons">
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Join Our Church <ArrowRight size={18} />
                        </Link>
                        <Link to="/about" className="btn btn-secondary btn-lg">
                            Learn More
                        </Link>
                    </div>
                </div>
            </header>

            <div className="ann-container">
                {announcements.length > 0 ? (
                    <div className="ann-list">
                        {announcements.map((ann, i) => (
                            <article key={ann.id} className="ann-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                                <div className="ann-card-image" />
                                <div className="ann-card-content">
                                    <div 
                                      className="ann-card-priority" 
                                      style={{ background: getPriorityColor(ann.priority) }}
                                    >
                                        {ann.priority}
                                    </div>
                                    <div className="ann-card-date">
                                        <Calendar size={14} />
                                        {new Date(ann.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </div>
                                    <h2 className="ann-card-title">{ann.title}</h2>
                                    <p className="ann-card-text">{ann.content}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="no-ann">
                        <Megaphone size={48} className="text-muted" style={{ margin: '0 auto', opacity: 0.3 }} />
                        <h3>No announcements at this time.</h3>
                        <p>Check back later for updates!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
