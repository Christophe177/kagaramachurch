import { useState, useEffect } from 'react';
import { Target, Eye, Heart, BookOpen, Check, Church, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import churchHero from '../../assets/church_hero.png';
import eventsHero from '../../assets/events_hero.png';
import annHero from '../../assets/announcements_hero.png';

export default function About() {
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
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

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
        <div className="about-page">
            <style>{`
        .about-hero {
          min-height: 90vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 4rem 2rem; text-align: center;
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
        .about-hero h1 {
          font-size: 3.5rem; line-height: 1.15; margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #ffffff 40%, var(--color-primary));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; color: white;
          font-weight: 800;
        }
        .about-hero p { color: rgba(255,255,255,0.9); max-width: 700px; margin: 0 auto 2.5rem; font-size: 1.2rem; line-height: 1.7; }
        .hero-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .about-content { max-width: 1000px; margin: 0 auto; padding: 3rem 2rem 6rem; }
        .about-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 2rem; margin-bottom: 4rem; }
        .about-card {
          background: var(--color-bg-card); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); padding: 2rem; text-align: center;
          transition: all var(--transition-base);
        }
        .about-card:hover { transform: translateY(-4px); border-color: rgba(212,175,55,0.25); box-shadow: var(--shadow-md); }
        .about-card-icon {
          width: 60px; height: 60px; border-radius: var(--radius-lg);
          background: var(--color-primary-subtle); color: var(--color-primary);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .about-card h3 { font-size: 1.2rem; margin-bottom: 0.75rem; font-family: var(--font-body); font-weight: 600; }
        .about-card p { color: var(--color-text-secondary); font-size: 0.9rem; line-height: 1.7; }
        .about-story { background: var(--color-bg-card); border-radius: var(--radius-xl); padding: 3rem; border: 1px solid var(--color-border); }
        .about-story h2 { font-size: 1.8rem; margin-bottom: 1.5rem; color: var(--color-primary); }
        .about-story p { color: var(--color-text-secondary); line-height: 1.8; margin-bottom: 1rem; font-size: 0.95rem; }
        
        .purpose-section { padding: 6rem 2rem; background: var(--color-bg); }
        .purpose-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1.2fr; gap: 4rem; align-items: center;
        }
        .purpose-image {
          border-radius: 1.5rem; overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          height: 500px;
        }
        .purpose-image img { width: 100%; height: 100%; object-fit: cover; }
        .purpose-text h2 { font-size: 2.5rem; color: #1e293b; margin-bottom: 1rem; font-weight: 800; }
        .purpose-line { width: 60px; height: 4px; background: var(--color-primary); margin-bottom: 2.5rem; border-radius: 2px; }
        .purpose-list { list-style: none; display: flex; flex-direction: column; gap: 1.25rem; }
        .purpose-item { display: flex; gap: 1rem; color: #475569; line-height: 1.6; font-size: 1.05rem; }
        .purpose-item::before { content: '•'; color: var(--color-primary); font-weight: 800; font-size: 1.2rem; }
        @media (max-width: 992px) {
          .purpose-inner { grid-template-columns: 1fr; gap: 3rem; }
          .purpose-image { height: 400px; }
        }
        
        .unique-section { 
          background: var(--color-primary); color: white; border-radius: 2rem; 
          margin: 4rem 2rem; overflow: hidden;
        }
        .unique-inner { display: flex; align-items: stretch; }
        .unique-content { flex: 1.2; padding: 4rem 3rem; }
        .unique-content h2 { font-size: 2.5rem; margin-bottom: 2rem; font-weight: 800; color: white; }
        .unique-line { width: 80px; height: 4px; background: white; margin-bottom: 3rem; opacity: 0.3; }
        
        .unique-list { list-style: none; display: flex; flex-direction: column; gap: 1.5rem; }
        .unique-item { display: flex; gap: 1.25rem; align-items: flex-start; font-size: 1.05rem; line-height: 1.5; }
        .unique-check { 
          min-width: 24px; height: 24px; border-radius: 50%; 
          background: rgba(255,255,255,0.1); display: flex; 
          align-items: center; justify-content: center; 
          border: 1px solid rgba(255,255,255,0.2);
        }
        
        .unique-visual { flex: 0.8; position: relative; min-height: 500px; }
        .unique-visual img { 
          width: 100%; height: 100%; object-fit: cover; 
          border-radius: 0 2rem 2rem 0;
        }
        
        @media (max-width: 992px) {
          .unique-inner { flex-direction: column; }
          .unique-visual { min-height: 350px; }
          .unique-visual img { border-radius: 0 0 2rem 2rem; }
          .unique-content { padding: 3rem 2rem; }
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

        .locations-section { padding: 6rem 2rem; background: var(--color-bg-secondary); }
        .locations-grid {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;
        }
        .location-card {
          background: white; border-radius: 2rem; padding: 2.5rem;
          text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.05);
          border: 1px solid var(--color-border); transition: all 0.3s ease;
        }
        .location-card:hover { transform: translateY(-5px); border-color: var(--color-primary-subtle); box-shadow: 0 20px 60px rgba(0,0,0,0.08); }
        .location-icon {
          width: 56px; height: 56px; border-radius: 50%;
          background: #fffbeb; color: #f59e0b;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem; font-size: 1.5rem;
        }
        .location-card h3 { font-size: 1.25rem; margin-bottom: 1.5rem; color: #1e293b; line-height: 1.4; }
        .service-times { text-align: left; }
        .service-time-item { margin-bottom: 1.25rem; }
        .service-time-item h4 { font-size: 0.85rem; text-transform: uppercase; color: var(--color-primary); letter-spacing: 0.05em; margin-bottom: 0.25rem; }
        .service-time-item p { color: #64748b; font-size: 0.95rem; line-height: 1.5; }
      `}</style>

            <section className="about-hero">
                <div className="hero-bg-layer" style={{ backgroundImage: `url(${backgroundImages[bgIdx]})` }}></div>
                <div className="hero-overlay"></div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="hero-badge"><Church size={16} /> Welcome to Evangelical Friends Church of Rwanda - Kagarama</div>
                    <h1>About Our Church</h1>
                    <p>Shining the Light of Christ across Rwanda since 1986, fulfilling the Great Commission through worship, outreach, and holistic transformation.</p>
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

            <div className="about-content">
                <div className="about-grid">
                    <div className="about-card reveal delay-1">
                        <div className="about-card-icon"><Target size={28} /></div>
                        <h3>Our Mission</h3>
                        <p>Shining the Light of Christ across Rwanda and regardless of the world to fulfill the Great Commission, transforming lives spiritually and socially through worship, outreach, and discipleship.</p>
                    </div>
                    <div className="about-card reveal delay-2">
                        <div className="about-card-icon"><Eye size={28} /></div>
                        <h3>Our Vision</h3>
                        <p>To see the kingdom of God growing among Rwandans, being transformed through the Gospel of Jesus Christ. Shining his light on all nations and developing holistically.</p>
                    </div>
                    <div className="about-card reveal delay-3">
                        <div className="about-card-icon"><Heart size={28} /></div>
                        <h3>Our Values</h3>
                        <p>We believe in the Power to Live (character), the Power to Do (abilities), and the Power to Think (problem-solving) for self, community, and society.</p>
                    </div>
                </div>

                <div className="about-story reveal">
                    <h2>Our Story</h2>
                    <p>The Evangelical Friends Church of Rwanda ministry began in 1986 and was officially incorporated in 1987 in Kigali. Founded through the faithful efforts of American missionaries Willard and Doris Ferguson alongside dedicated Rwandan believers, we have been a beacon of faith for decades.</p>
                    <p>From humble beginnings, our church has expanded significantly to include 76 local churches across all regions of Rwanda, with over 7,000 members and 51 dedicated pastors serving our communities.</p>
                    <p>Beyond spiritual growth, we are deeply committed to the reconciliation of Rwandan society and holistic transformation. Through our network of schools, Bible colleges like the Rwanda Friends Theological College (RFTC), and socio-economic programs, we shine the light of Christ in every corner of the nation.</p>
                </div>
            </div>

            <section className="locations-section">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="reveal">
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b' }}>Our Locations & Service Times</h2>
                    <p style={{ color: '#64748b', marginTop: '1rem' }}>Come worship with us on weekdays and Sundays anywhere in Rwanda</p>
                </div>
                
                <div className="locations-grid">
                    <div className="location-card reveal delay-1">
                        <div className="location-icon">🙏</div>
                        <h3>Evangelical Friends Church of Rwanda Headquarters Kagarama</h3>
                        <div className="service-times">
                            <div className="service-time-item">
                                <h4>Sunday Service</h4>
                                <p>Sundays From 8:00 am to 10:30 am</p>
                            </div>
                            <div className="service-time-item">
                                <h4>Weekday Services</h4>
                                <p>Tuesday from 5:00 pm to 7:00 pm</p>
                            </div>
                        </div>
                    </div>

                    <div className="location-card reveal delay-2">
                        <div className="location-icon">🙏</div>
                        <h3>Evangelical Friends Church of Rwanda Kanombe (Quarterly meeting, Kigali City)</h3>
                        <div className="service-times">
                            <div className="service-time-item">
                                <h4>Sunday Services</h4>
                                <p>Morning: 08:00 am to 10:00 am<br/>Noon: 11:30 am to 01:30 pm</p>
                            </div>
                            <div className="service-time-item">
                                <h4>Weekday Services</h4>
                                <p>Contact branch for mid-week schedule</p>
                            </div>
                        </div>
                    </div>

                    <div className="location-card reveal delay-3">
                        <div className="location-icon">🙏</div>
                        <h3>Evangelical Friends Church of Rwanda Gisenyi (Quarterly meeting, West region)</h3>
                        <div className="service-times">
                            <div className="service-time-item">
                                <h4>Sunday Service</h4>
                                <p>Sundays From 09:00 am to 12:00 o'clock</p>
                            </div>
                            <div className="service-time-item">
                                <h4>Weekday Services</h4>
                                <p>Tuesday From 05:00 pm to 06:00 pm</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="purpose-section reveal">
                <div className="purpose-inner">
                    <div className="purpose-image">
                        <img src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80" alt="African Church Leadership" />
                    </div>
                    <div className="purpose-text">
                        <h2>A Church With Purpose</h2>
                        <div className="purpose-line"></div>
                        <ul className="purpose-list">
                            <li className="purpose-item">A Church With Purpose The purpose of the church is to worship God (Luke 4:8; John 4:23; Rev.4:10).</li>
                            <li className="purpose-item">Study His Word (2 Tim. 2:15; 1 Cor. 4:6).</li>
                            <li className="purpose-item">Pray (Acts 2:42).</li>
                            <li className="purpose-item">Love one another (John 13:35; Phil. 1:1-4).</li>
                            <li className="purpose-item">To be unified in Christ, Gal. 3:28</li>
                            <li className="purpose-item">Help each other (Gal. 6:2).</li>
                            <li className="purpose-item">To learn how to live as Godly people (Titus 2:11-12).</li>
                            <li className="purpose-item">And to be equipped to evangelize to the world (Eph. 4:12; Matt. 28:18- 20).</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="unique-section reveal animate-in">
                <div className="unique-inner">
                    <div className="unique-content">
                        <h2>Our Uniqueness</h2>
                        <div className="unique-line"></div>
                        <ul className="unique-list">
                            <li className="unique-item">
                                <div className="unique-check"><Check size={14} /></div>
                                A Church where the ignored by society are welcomed, made champions and leaders
                            </li>
                            <li className="unique-item">
                                <div className="unique-check"><Check size={14} /></div>
                                A Church for those that are serious about the study of the word and prayer
                            </li>
                            <li className="unique-item">
                                <div className="unique-check"><Check size={14} /></div>
                                A Church where evangelism and social concern are combined
                            </li>
                            <li className="unique-item">
                                <div className="unique-check"><Check size={14} /></div>
                                A Church where God is worshiped in truth and power. Worship must be dynamic
                            </li>
                            <li className="unique-item">
                                <div className="unique-check"><Check size={14} /></div>
                                A Church where leadership is shared and individuals mobilized in variety of skills and gifts for the work of the ministry
                            </li>
                            <li className="unique-item">
                                <div className="unique-check"><Check size={14} /></div>
                                A church that is cell based
                            </li>
                        </ul>
                    </div>
                    <div className="unique-visual">
                        <img src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80" alt="African Men Fellowship" />
                    </div>
                </div>
            </section>
        </div>
    );
}
