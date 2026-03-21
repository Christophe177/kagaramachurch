import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Church, ArrowRight } from 'lucide-react';
import pastorMupenda from '../../assets/pastor_mupenda.png';
import pastorCyungura from '../../assets/pastor_cyungura.png';
import pastorNsekanabo from '../../assets/pastor_nsekanabo.png';
import churchHero from '../../assets/church_hero.png';
import eventsHero from '../../assets/events_hero.png';
import annHero from '../../assets/announcements_hero.png';

const pastors = [
    {
        name: 'Rev. Aaron MUPENDA',
        title: 'Assistant General Superintendent',
        bio: 'Rev. Aaron Mupenda provides visionary leadership and spiritual oversight as the General Superintendent, guiding the Evangelical Friends Church of Rwanda across all 76 local congregations.',
        image: pastorMupenda,
    },
    {
        name: 'Rev. Dieudonné CYUNGURA',
        title: 'Assistant Legal Representative',
        bio: 'Rev. Dieudonné Cyungura serves as the Assistant Legal Representative, ensuring the administrative and legal integrity of our mission while providing vital pastoral care.',
        image: pastorCyungura,
    },
    {
        name: 'Rev. Jean Paul NSEKANABO',
        title: 'Legal Representative & General Superintendent',
        bio: 'Rev. Jean Paul Nsekanabo contributes to the spiritual growth and national outreach programs of the church, supporting the Superintendent in fulfilling the Great Commission.',
        image: pastorNsekanabo,
    },
];

export default function Pastors() {
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

        const scrollElements = document.querySelectorAll('.reveal');
        scrollElements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="pastors-page">
            <style>{`
        .pastors-hero {
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
        .pastors-hero h1 {
          font-size: 3.5rem; line-height: 1.15; margin-bottom: 1.5rem;
          background: linear-gradient(135deg, #ffffff 40%, var(--color-primary));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; color: white; font-weight: 800;
        }
        .pastors-hero p { color: rgba(255,255,255,0.9); max-width: 700px; margin: 0 auto 2.5rem; font-size: 1.2rem; line-height: 1.7; }
        .hero-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .pastors-grid {
          max-width: 1100px; margin: 0 auto; padding: 3rem 2rem 6rem;
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;
        }
        .pastor-card {
          background: var(--color-bg-card); border: 1px solid var(--color-border);
          border-radius: var(--radius-xl); overflow: hidden;
          transition: all var(--transition-base);
        }
        .pastor-card:hover {
          transform: translateY(-6px);
          border-color: rgba(37, 99, 235, 0.3);
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.15);
        }
        .pastor-photo {
          width: 100%; height: 350px; object-fit: cover; object-position: top;
          border-bottom: 3px solid rgba(37, 99, 235, 0.2);
        }
        .pastor-info { padding: 1.5rem 2rem 2rem; text-align: center; }
        .pastor-name {
          font-size: 1.25rem; margin-bottom: 0.5rem;
          font-family: var(--font-body); font-weight: 700;
          color: var(--color-text);
        }
        .pastor-title {
          display: inline-block; padding: 0.3rem 0.85rem; border-radius: var(--radius-full);
          background: rgba(37, 99, 235, 0.1); color: #2563eb;
          font-size: 0.72rem; font-weight: 600; margin-bottom: 1rem;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .pastor-bio { color: var(--color-text-secondary); font-size: 0.88rem; line-height: 1.7; }

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

        @media (max-width: 768px) {
          .pastors-grid { grid-template-columns: 1fr; }
          .pastor-photo { height: 300px; }
        }
      `}</style>

            <section className="pastors-hero">
                <div className="hero-bg-layer" style={{ backgroundImage: `url(${backgroundImages[bgIdx]})` }}></div>
                <div className="hero-overlay"></div>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="hero-badge"><Church size={16} /> Welcome to Kagarama Church</div>
                    <h1>Our Church Leaders</h1>
                    <p>Meet the dedicated pastors who guide our congregation with faith, wisdom, and love.</p>
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

            <div className="pastors-grid">
                {pastors.map((p, i) => (
                    <div key={i} className="pastor-card reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                        <img src={p.image} alt={p.name} className="pastor-photo" />
                        <div className="pastor-info">
                            <div className="pastor-name">{p.name}</div>
                            <div className="pastor-title">{p.title}</div>
                            <p className="pastor-bio">{p.bio}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
