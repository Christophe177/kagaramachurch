import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Church, Users, Calendar, Heart, ArrowRight, Star, BookOpen, Gem, Image, PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { photosAPI } from '../../services/api.js';
import churchHero from '../../assets/church_hero.png';
import eventsHero from '../../assets/events_hero.png';
import annHero from '../../assets/announcements_hero.png';

export default function Home() {
    const [latestMedia, setLatestMedia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [minIdx, setMinIdx] = useState(0);
    const [visibleCards, setVisibleCards] = useState(3);

    const ministries = [
        { title: 'Education Department', img: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80', description: 'Managing George Fox Schools and Rwanda Friends Theological College.' },
        { title: 'Worship & Choirs', img: 'https://images.unsplash.com/photo-1599422314077-f4dfdaa4cd09?auto=format&fit=crop&q=80', description: 'Featuring Shalom Choir, Joy of God, and Les Amis du Salut.' },
        { title: 'Youth fellowship', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80', description: 'Partnering with Teens for Christ and Gideons for young believers.' },
        { title: 'Socio-Economic Dev', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80', description: 'Building houses and roads for community transformation.' },
        { title: 'Evangelism Pillar', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80', description: 'Coordinating mission across 76 local churches nationwide.' },
    ];

    const nextMin = useCallback(() => setMinIdx((prev) => (prev + 1) >= (ministries.length - visibleCards + 1) ? 0 : prev + 1), [ministries.length, visibleCards]);
    const prevMin = useCallback(() => setMinIdx((prev) => (prev - 1) < 0 ? ministries.length - visibleCards : prev - 1), [ministries.length, visibleCards]);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -20px 0px'
        };

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

        // Re-check for new elements when latestMedia or loading changes
        const timer = setTimeout(initObserver, 500); 

        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, [latestMedia, loading]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) setVisibleCards(1);
            else if (window.innerWidth <= 1024) setVisibleCards(2);
            else setVisibleCards(3);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const photos = await photosAPI.getAll();
                if (photos && photos.length > 0) {
                    setLatestMedia(photos[0]);
                }
            } catch (err) {
                console.error('Failed to fetch media:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMedia();
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Recently Posted';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return 'Recently Posted';
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const features = [
        { icon: Users, title: 'Member Management', desc: 'Register and manage church members with complete profiles and records.' },
        { icon: BookOpen, title: 'Baptism & Kwakirwa', desc: 'Track spiritual milestones with organized baptism and kwakirwa registration.' },
        { icon: Gem, title: 'Marriage Registry', desc: 'Manage marriage registrations and family creation for couples.' },
        { icon: Calendar, title: 'Events & Activities', desc: 'Stay updated with upcoming church events, services, and programs.' },
        { icon: Heart, title: 'Prayer Requests', desc: 'Submit prayer requests directly to church leadership.' },
        { icon: Star, title: 'Family Groups', desc: 'Organize members into family groups for better fellowship.' },
    ];

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
        const interval = setInterval(() => {
            nextMin();
        }, 2000);
        return () => clearInterval(interval);
    }, [nextMin]);

    return (
        <div className="home-page">
            <style>{`
        .hero {
          min-height: 90vh; display: flex; align-items: center; justify-content: center;
          text-align: center; padding: 4rem 2rem;
          position: relative; overflow: hidden; background: #000;
        }
        .hero-bg-layer {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          transition: background-image 1.5s ease-in-out, opacity 1.5s ease-in-out;
          z-index: 0;
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7));
          z-index: 1;
        }
        .hero::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at center, rgba(37, 99, 235, 0.15) 0%, transparent 75%);
          pointer-events: none; z-index: 2;
        }
        .hero-content { position: relative; z-index: 3; max-width: 800px; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.5rem 1.25rem; border-radius: var(--radius-full);
          background: var(--color-primary-subtle); color: var(--color-primary);
          font-size: 0.82rem; font-weight: 600; margin-bottom: 2rem;
          text-transform: uppercase; letter-spacing: 0.1em;
          animation: fadeInUp 0.6s ease;
        }
        .hero h1 {
          font-size: 3rem; line-height: 1.15; margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #ffffff 40%, var(--color-primary));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; color: white;
          animation: fadeInUp 0.6s ease 0.1s backwards;
        }
        .hero p {
          font-size: 1.15rem; color: rgba(255,255,255,0.9); max-width: 600px; margin: 0 auto 2.5rem;
          line-height: 1.7; animation: fadeInUp 0.6s ease 0.2s backwards;
        }
        .hero-buttons {
          display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
          animation: fadeInUp 0.6s ease 0.3s backwards;
        }

        .media-of-day { 
          padding: 6rem 2rem; 
          background: var(--color-bg);
          position: relative;
        }
        .media-container {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 4rem;
          align-items: center;
        }
        .media-visual {
          position: relative; border-radius: var(--radius-xl); overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          background: #000; aspect-ratio: 16/9;
          display: flex; align-items: center; justify-content: center;
        }
        .media-visual img, .media-visual video {
          width: 100%; height: 100%; object-fit: cover;
        }
        .media-badge {
          position: absolute; top: 1.5rem; left: 1.5rem;
          padding: 0.5rem 1.25rem; border-radius: var(--radius-full);
          background: rgba(37, 99, 235, 0.9); color: white;
          font-size: 0.75rem; font-weight: 600; text-transform: uppercase;
          backdrop-filter: blur(10px); z-index: 2;
        }
        .media-info h2 { font-size: 2.5rem; line-height: 1.2; margin-bottom: 1.5rem; }
        .media-info p { font-size: 1.1rem; color: var(--color-text-secondary); line-height: 1.8; margin-bottom: 2rem; }
        .media-date { font-size: 0.9rem; color: var(--color-primary); font-weight: 600; margin-bottom: 0.5rem; display: block; }
        
        .mission-vision { padding: 6rem 2rem; background: var(--color-bg); }
        .mvv-grid {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;
        }
        .mvv-card {
          background: var(--color-bg-card); border-radius: var(--radius-xl); padding: 3rem 2rem;
          text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          transition: all var(--transition-base); border: 1px solid rgba(0,0,0,0.02);
        }
        .mvv-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(37, 99, 235, 0.08); border-color: var(--color-primary-subtle); }
        .mvv-icon {
          width: 64px; height: 64px; border-radius: 1.25rem;
          background: var(--color-primary-subtle); color: var(--color-primary);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .mvv-card h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 1rem; color: #1e293b; }
        .mvv-card p { font-size: 0.95rem; color: var(--color-text-secondary); line-height: 1.7; }

        .features { padding: 6rem 2rem; background: var(--color-bg-secondary); }
        .features-inner { max-width: 1200px; margin: 0 auto; }
        .features-header { text-align: center; margin-bottom: 4rem; }
        .features-header h2 { font-size: 2.2rem; margin-bottom: 1rem; }
        .features-header p { color: var(--color-text-secondary); max-width: 600px; margin: 0 auto; font-size: 1.05rem; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; }
        .feature-card {
          background: var(--color-bg-card); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); padding: 2rem;
          transition: all var(--transition-base);
        }
        .feature-card:hover {
          border-color: rgba(37, 99, 235, 0.35); transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.15);
        }
        .feature-icon {
          width: 52px; height: 52px; border-radius: var(--radius-md);
          background: var(--color-primary-subtle); display: flex;
          align-items: center; justify-content: center; margin-bottom: 1.25rem;
          color: var(--color-primary);
        }
        .feature-card h3 { font-size: 1.15rem; margin-bottom: 0.75rem; font-family: var(--font-body); font-weight: 600; }
        .feature-card p { color: var(--color-text-secondary); font-size: 0.9rem; line-height: 1.6; }
        .cta {
          padding: 6rem 2rem; text-align: center;
          background: radial-gradient(ellipse at center, rgba(37, 99, 235, 0.08), transparent 70%);
        }
        .cta h2 { font-size: 2.2rem; margin-bottom: 1rem; }
        .cta p { color: var(--color-text-secondary); margin-bottom: 2rem; font-size: 1.05rem; }
        @media (max-width: 992px) {
          .media-container { grid-template-columns: 1fr; gap: 2.5rem; text-align: center; }
          .media-info h2 { font-size: 2rem; }
        }
        @media (max-width: 768px) {
          .hero h1 { font-size: 2.2rem; }
          .features-grid { grid-template-columns: 1fr; }
          .min-track { gap: 1rem; }
          .min-card { min-width: 100%; }
        }
        
        .ministries { padding: 6rem 2rem; background: var(--color-bg-secondary); overflow: hidden; }
        .min-viewport { max-width: 1200px; margin: 0 auto; overflow: visible; position: relative; }
        .min-track-container { overflow: hidden; padding: 1rem 0 3rem; margin: 0 -1rem; }
        .min-track {
          display: flex; gap: 2rem;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          padding: 1rem 0;
        }
        .min-card {
          min-width: calc((100% / var(--min-visible, ${visibleCards})) - 1.35rem);
          background: white; border-radius: 2rem; padding: 1.5rem;
          text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.04);
          transition: all var(--transition-base); 
        }
        .min-card:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
        .min-img {
          width: 100%; height: 240px; border-radius: 1.5rem;
          object-fit: cover; margin-bottom: 1.5rem;
        }
        .min-card h3 { font-size: 1.5rem; margin-bottom: 1.5rem; color: #1e293b; font-family: var(--font-heading); }
        .btn-green {
          background: var(--color-primary); color: white; border: none;
          padding: 0.75rem 2rem; border-radius: 0.5rem; font-weight: 700;
          text-transform: uppercase; font-size: 0.9rem; letter-spacing: 0.05em;
          transition: all 0.2s ease; cursor: pointer;
        }
        .btn-green:hover { background: #1d4ed8; transform: scale(1.02); }
        .min-controls { display: flex; justify-content: center; gap: 0.75rem; margin-top: 3rem; }
        .min-dot { width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; cursor: pointer; border: none; }
        .min-dot.active { background: var(--color-primary); width: 28px; border-radius: 5px; transition: all 0.3s ease; }
        .min-relative { position: relative; max-width: 1200px; margin: 0 auto; }
        .min-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: white; border: 1px solid var(--color-border);
          width: 44px; height: 44px; border-radius: 50%; display: flex;
          align-items: center; justify-content: center; color: var(--color-primary);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05); cursor: pointer; z-index: 10;
          transition: all 0.2s ease;
        }
        .min-arrow:hover { background: #065f46; color: white; border-color: #065f46; }
        .min-arrow.left { left: -60px; }
        .min-arrow.right { right: -60px; }
        @media (max-width: 1300px) {
          .min-arrow.left { left: 1rem; }
          .min-arrow.right { right: 1rem; }
        }

        /* Scroll Animations */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal.delay-1 { transition-delay: 0.2s; }
        .reveal.delay-2 { transition-delay: 0.4s; }
        .reveal.delay-3 { transition-delay: 0.6s; }

        .evangelism { padding: 6rem 2rem; background: var(--color-bg); }
        .evangelism-header { text-align: center; max-width: 900px; margin: 0 auto 4rem; }
        .evangelism-header h2 { font-size: 3rem; font-weight: 800; color: #1e293b; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .evangelism-header p { color: #64748b; font-size: 1.15rem; line-height: 1.8; }
        .ev-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
        .ev-card {
          position: relative; border-radius: 1.5rem; overflow: hidden; height: 500px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          background: #000; color: white;
        }
        .ev-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.65; transition: transform 0.6s ease; }
        .ev-card:hover .ev-img { transform: scale(1.1); }
        .ev-overlay {
          position: absolute; inset: 0; padding: 3rem 2rem;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%);
        }
        .ev-overlay h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .ev-overlay p { font-size: 1.05rem; line-height: 1.7; color: rgba(255,255,255,0.9); margin-bottom: 2.5rem; max-width: 300px; }
        .ev-actions { display: flex; gap: 1rem; }
        .ev-btn {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 1.25rem; border-radius: 0.25rem; border: 1px solid rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.05); color: white; text-transform: uppercase;
          font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
        }
        .ev-btn:hover { background: white; color: var(--color-primary); border-color: white; }
        @media (max-width: 768px) { .ev-header h2 { font-size: 2.2rem; } .ev-card { height: 450px; } }
      `}</style>

            <section className="hero">
                <div className="hero-bg-layer" style={{ backgroundImage: `url(${backgroundImages[bgIdx]})` }}></div>
                <div className="hero-overlay"></div>
                <div className="hero-content reveal">
                    <div className="hero-badge"><Church size={16} /> Welcome to Kagarama Church</div>
                    <h1>Empowering Faith Through Digital Ministry</h1>
                    <p>A comprehensive church management system designed to bring our community closer together through organized worship, fellowship, and spiritual growth.</p>
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

            <section className="mission-vision">
                <div className="mvv-grid">
                    <div className="mvv-card reveal delay-1">
                        <div className="mvv-icon"><Star size={28} /></div>
                        <h3>Our Mission</h3>
                        <p>Shining the Light of Christ across Rwanda and throughout the world to fulfill the Great Commission, transforming lives spiritually and socially through worship, outreach, and discipleship.</p>
                    </div>
                    <div className="mvv-card reveal delay-2">
                        <div className="mvv-icon"><ArrowRight size={28} /></div>
                        <h3>Our Vision</h3>
                        <p>To see the kingdom of God growing among Rwandans, being transformed through the Gospel of Jesus Christ. Shining his light on all nations and developing holistically.</p>
                    </div>
                    <div className="mvv-card reveal delay-3">
                        <div className="mvv-icon"><Heart size={28} /></div>
                        <h3>Our Values</h3>
                        <p>We believe in the Power to Live (character), the Power to Do (abilities), and the Power to Think (problem-solving) for self, community, and society.</p>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="features-inner">
                    <div className="features-header reveal">
                        <h2>Everything You Need</h2>
                        <p>Our church management system provides powerful tools to strengthen our community and simplify administration.</p>
                    </div>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div key={i} className="feature-card reveal" style={{ transitionDelay: `${(i % 3) * 0.15}s` }}>
                                <div className="feature-icon"><f.icon size={24} /></div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="ministries">
                <div className="min-viewport reveal">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#0f172a' }}>Church Ministries</h2>
                    </div>
                    
                    <button className="min-arrow left" onClick={prevMin} aria-label="Previous"><ChevronLeft size={24} /></button>
                    <button className="min-arrow right" onClick={nextMin} aria-label="Next"><ChevronRight size={24} /></button>

                    <div className="min-track-container">
                        <div className="min-track" style={{ transform: `translateX(calc(-${minIdx * (100 / visibleCards)}%))` }}>
                            {ministries.map((m, i) => (
                                <div key={i} className="min-card">
                                    <img src={m.img} alt={m.title} className="min-img" />
                                    <h3>{m.title}</h3>
                                    <Link to={`/join-ministry?ministry=${encodeURIComponent(m.title)}`} className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                                        Join Ministry
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="min-controls">
                        {ministries.map((_, i) => (
                            <button 
                                key={i} 
                                className={`min-dot ${minIdx === i ? 'active' : ''}`}
                                onClick={() => setMinIdx(i)}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>
            {latestMedia && (
                <section className="media-of-day reveal">
                    <div className="media-container">
                        <div className="media-visual">
                            <span className="media-badge">
                                {latestMedia.media_type === 'video' ? 'Video of the Day' : 'Photo of the Day'}
                            </span>
                            {latestMedia.media_type === 'video' ? (
                                <video src={latestMedia.file_path} controls autoPlay muted loop />
                            ) : (
                                <img src={latestMedia.file_path || latestMedia.image_url} alt={latestMedia.title} />
                            )}
                        </div>
                        <div className="media-info">
                            <span className="media-date">{formatDate(latestMedia.created_at)}</span>
                            <h2>{latestMedia.title}</h2>
                            <p>{latestMedia.caption}</p>
                            <Link to="/about" className="btn btn-primary">
                                Explore Our Church <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            <section className="evangelism">
                <div className="evangelism-header reveal">
                    <h2>Evangelism</h2>
                    <p>The Evangelical Friends Church of Rwanda has 76 local churches with more than 7,000 dedicated members committed to spreading the Gospel of God to Rwanda’s 14 million people. We operate in all provinces across the country.</p>
                </div>
                
                <div className="ev-grid">
                    <div className="ev-card reveal delay-1">
                        <img src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80" alt="Church Project" className="ev-img" />
                        <div className="ev-overlay">
                            <h3>Our Activity</h3>
                            <p>We are in the process of constructing a new church that will stand as a beacon of faith and community for generations to come.</p>
                        </div>
                    </div>

                    <div className="ev-card reveal delay-2">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80" alt="Bible Study" className="ev-img" />
                        <div className="ev-overlay">
                            <h3>Bible & Discipleship</h3>
                            <p>Deepening our faith through the dedicated study of God's Word and transformative discipleship.</p>
                        </div>
                    </div>

                    <div className="ev-card reveal delay-3">
                        <img src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80" alt="Worship Activity" className="ev-img" />
                        <div className="ev-overlay">
                            <h3>Our Activity</h3>
                            <p>We are in the process of constructing a new church that will stand as a beacon of faith and community for generations to come.</p>
                        </div>
                    </div>
                </div>
            </section>


            <section className="cta reveal">
                <h2>Ready to Get Started?</h2>
                <p>Join our church community and experience faith, fellowship, and growth.</p>
                <Link to="/register" className="btn btn-primary btn-lg">
                    Register Now <ArrowRight size={18} />
                </Link>
            </section>
        </div>
    );
}

