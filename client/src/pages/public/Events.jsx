import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Church, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../../services/api.js';
import eventsHero from '../../assets/events_hero.png';
import eventPlaceholder from '../../assets/event_placeholder.png';
import annHero from '../../assets/announcements_hero.png';
import churchHero from '../../assets/church_hero.png';

export default function Events() {
    const [events, setEvents] = useState([]);
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
        loadEvents();
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

        initObserver();
        const timer = setTimeout(initObserver, 500);
        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, [events, loading]);

    const loadEvents = async () => {
        try {
            const data = await eventsAPI.getAll();
            setEvents(data);
        } catch {
            // Sample events
            setEvents([
                { id: 1, title: 'Inama y\'umwaka', event_date: '2026-02-19', location: 'Gasharu - Kicukiro', description: 'Join us for our annual meeting where we discuss our vision and plans for the year ahead.', time: '09:00 AM - 05:00 PM' },
                { id: 2, title: 'La veillée de prière', event_date: '2025-12-31', location: 'Main Sanctuary', description: 'All churches of the community are invited to join us for a powerful time of prayer and transition into the new year.', time: '08:30 PM - 03:00 AM' },
                { id: 3, title: 'Youth Fellowship Night', event_date: '2026-03-12', location: 'Youth Center', description: 'An evening of fellowship, games, and faith discussions for our young members.', time: '06:00 PM - 09:00 PM' },
                { id: 4, title: 'Church Building Dedication', event_date: '2026-04-15', location: 'New Branch - Kagarama', description: 'Celebrating the completion of our new sanctuary. A day of praise and thanksgiving for God\'s faithfulness.', time: '10:00 AM - 01:00 PM' },
                { id: 5, title: 'Community Outreach Day', event_date: '2026-05-20', location: 'Kigali Suburbs', description: 'Reaching out to our neighbors with food supplies, medical checkups, and the Word of God.', time: '08:00 AM - 04:00 PM' },
                { id: 6, title: 'Worship Leaders Workshop', event_date: '2026-06-05', location: 'Main Sanctuary', description: 'Equipping the next generation of worship leaders with theological and musical excellence.', time: '02:00 PM - 06:00 PM' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'numeric', day: 'numeric',
        });
    };

    return (
        <div className="events-page">
            <style>{`
        .events-hero {
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
        .events-hero h1 {
          font-size: 3.5rem; line-height: 1.15; margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #ffffff 40%, var(--color-primary));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; color: white;
          font-weight: 800; font-family: var(--font-heading);
          letter-spacing: -0.02em;
        }
        .events-hero p {
          font-size: 1.15rem; color: rgba(255,255,255,0.9); max-width: 600px; margin: 0 auto 2.5rem;
          line-height: 1.7;
        }
        .hero-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        
        .events-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem 6rem;
        }
        
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 2.5rem;
        }
        
        .event-card {
          background: var(--color-bg-card);
          display: flex;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }
        
        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 45px rgba(0,0,0,0.12);
        }
        
        .event-card-image {
          width: 40%;
          min-height: 280px;
          background-image: url(${eventPlaceholder});
          background-size: cover;
          background-position: center;
        }
        
        .event-card-content {
          width: 60%;
          padding: 0;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        
        .event-time-badge {
          background: #2563eb;
          color: white;
          padding: 0.6rem 1.2rem;
          font-weight: 600;
          font-size: 0.9rem;
          width: 100%;
          text-align: center;
        }
        
        .event-info-padding {
          padding: 1.5rem 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .event-card-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #222;
        }
        
        .event-meta-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          color: #888;
          font-size: 0.9rem;
          margin-bottom: 0.6rem;
        }
        
        .event-card-desc {
          font-size: 0.85rem;
          color: #666;
          line-height: 1.6;
          margin-top: 0.8rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .btn-join {
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.7rem 1.8rem;
          border-radius: 30px;
          font-weight: 600;
          font-size: 0.85rem;
          margin-top: 1.5rem;
          width: fit-content;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .btn-join:hover {
          background: #1d4ed8;
        }
        
        @media (max-width: 900px) {
          .events-grid { grid-template-columns: 1fr; }
        }
        
        @media (max-width: 600px) {
          .event-card { flex-direction: column; }
          .event-card-image { width: 100%; height: 200px; min-height: 200px; }
          .event-card-content { width: 100%; }
          .events-hero h1 { font-size: 2.5rem; }
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

            <section className="events-hero">
                <div className="hero-bg-layer" style={{ backgroundImage: `url(${backgroundImages[bgIdx]})` }}></div>
                <div className="hero-overlay"></div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="hero-badge"><Church size={16} /> Welcome to Kagarama Church</div>
                    <h1>Upcoming Events</h1>
                    <p>Stay updated with our upcoming services, fellowships, and special community programs.</p>
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

            <div className="events-container">
                {loading ? (
                    <div className="loading-page"><div className="spinner" /><p>Loading events...</p></div>
                ) : events.length === 0 ? (
                    <div className="empty-state">
                        <Calendar size={64} />
                        <h3>No upcoming events</h3>
                        <p>Check back soon for new events and activities.</p>
                    </div>
                ) : (
                    <div className="events-grid">
                        {events.map((event, i) => (
                            <div key={event.id} className="event-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                                <div className="event-card-image" />
                                <div className="event-card-content">
                                    <div className="event-time-badge">{event.time || 'TBA'}</div>
                                    <div className="event-info-padding">
                                        <div className="event-card-title">{event.title}</div>
                                        <div className="event-meta-item">
                                            <Calendar size={16} />
                                            <span>{formatDate(event.event_date)}</span>
                                        </div>
                                        <div className="event-meta-item">
                                            <MapPin size={16} />
                                            <span>{event.location}</span>
                                        </div>
                                        <p className="event-card-desc">{event.description}</p>
                                        <button className="btn-join">Join Us</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
