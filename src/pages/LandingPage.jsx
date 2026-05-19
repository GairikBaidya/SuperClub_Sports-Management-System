import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const FEATURES = [
  { icon: '🏃', title: 'Athlete Registration', desc: '8-step validated multi-step form covering personal details, guardian info, address, club affiliation, competition details, documents, and declaration — with auto-save to localStorage.', badge: '● Phase 1 Live', accent: 'var(--gold)', iconBg: 'rgba(232,184,75,0.1)', iconBorder: 'rgba(232,184,75,0.25)', badgeBg: 'rgba(232,184,75,0.08)', badgeBorder: 'rgba(232,184,75,0.2)', badgeColor: 'var(--gold)' },
  { icon: '📁', title: 'Smart Document Upload', desc: 'Browser-side image compression, support for Aadhaar, birth certificates, NOC documents, insurance PDFs — all stored securely in private Supabase buckets with signed URL access.', badge: '● Auto Compression', accent: '#5B8FFF', iconBg: 'rgba(91,143,255,0.1)', iconBorder: 'rgba(91,143,255,0.25)', badgeBg: 'rgba(91,143,255,0.08)', badgeBorder: 'rgba(91,143,255,0.2)', badgeColor: '#5B8FFF' },
  { icon: '🛡️', title: 'Admin Dashboard', desc: 'Supabase Auth-protected admin panel with real-time athlete data grid, search & filter by name, mobile or email, paginated profile drill-down, and full document viewer.', badge: '● Role Protected', accent: 'var(--crimson)', iconBg: 'rgba(200,16,46,0.1)', iconBorder: 'rgba(200,16,46,0.25)', badgeBg: 'rgba(200,16,46,0.08)', badgeBorder: 'rgba(200,16,46,0.2)', badgeColor: '#FF4466' },
  { icon: '📊', title: 'Excel Export', desc: 'Export the full athlete roster — or any filtered subset — to a fully formatted .xlsx file in one click using SheetJS. Includes auto-width columns, date formatting, and all metadata.', badge: '● SheetJS Powered', accent: '#22D3A0', iconBg: 'rgba(34,211,160,0.1)', iconBorder: 'rgba(34,211,160,0.25)', badgeBg: 'rgba(34,211,160,0.08)', badgeBorder: 'rgba(34,211,160,0.2)', badgeColor: '#22D3A0' },
  { icon: '⚡', title: 'Real-time Validation', desc: 'Live duplicate detection for mobile and email, auto-calculated age from DOB, dynamic guardian fields for minors, insurance conditional logic, and Zod schema-based form validation.', badge: '● Instant Feedback', accent: '#A78BFA', iconBg: 'rgba(167,139,250,0.1)', iconBorder: 'rgba(167,139,250,0.25)', badgeBg: 'rgba(167,139,250,0.08)', badgeBorder: 'rgba(167,139,250,0.2)', badgeColor: '#A78BFA' },
  { icon: '🔒', title: 'Row-Level Security', desc: 'Full Supabase RLS policies ensure athletes can only register, while admins get authenticated access to all data. No paid third-party services needed in Phase 1 — fully self-contained.', badge: '● Zero Paid Services', accent: '#F97316', iconBg: 'rgba(249,115,22,0.1)', iconBorder: 'rgba(249,115,22,0.25)', badgeBg: 'rgba(249,115,22,0.08)', badgeBorder: 'rgba(249,115,22,0.2)', badgeColor: '#F97316' },
];

const STEPS = [
  { name: 'Personal Details', detail: 'Name, DOB, gender, blood group, contact' },
  { name: 'Guardian Info', detail: 'Parent / guardian details for minors' },
  { name: 'Address', detail: 'Current address, city, state, PIN' },
  { name: 'Club & State', detail: 'Club name, state representation, district' },
  { name: 'Competition', detail: 'Age group, skill level, events applied' },
  { name: 'Documents', detail: 'Upload passport photo, Aadhaar, NOC, certs' },
  { name: 'Declaration', detail: 'Terms agreement & guardian consent' },
  { name: 'Payment', detail: 'Registration fee — Phase 2 live' },
];

const STATS = [
  { target: 8, label: 'Registration Steps' },
  { target: 100, label: '% Secure Storage' },
  { target: 9, label: 'Document Types' },
  { target: 5, label: 'Phase 1 Weeks' },
];

export default function LandingPage() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const particlesRef = useRef(null);
  const navRef = useRef(null);
  const mousePos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  // Cursor
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    const onMove = (e) => {
      mousePos.current.mx = e.clientX;
      mousePos.current.my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    document.addEventListener('mousemove', onMove);

    let raf;
    const animate = () => {
      const m = mousePos.current;
      m.rx += (m.mx - m.rx) * 0.12;
      m.ry += (m.my - m.ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = m.rx + 'px';
        ringRef.current.style.top = m.ry + 'px';
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  // Nav scroll
  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) navRef.current.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Particles
  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    const create = () => {
      const p = document.createElement('div');
      p.className = 'landing-particle';
      const size = Math.random() * 3 + 1;
      p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;opacity:${Math.random()*0.5+0.1};animation-duration:${Math.random()*8+6}s;animation-delay:${Math.random()*5}s;background:${Math.random()>0.5?'#E8B84B':'#C8102E'}`;
      container.appendChild(p);
      setTimeout(() => { if (p.parentNode) p.remove(); }, 14000);
    };
    for (let i = 0; i < 25; i++) create();
    const iv = setInterval(create, 600);
    return () => clearInterval(iv);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll('.landing-reveal');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const parent = entry.target.closest('.features-grid') || entry.target.closest('.flow-steps');
          const delay = parent ? Array.from(parent.children).indexOf(entry.target) * 80 : 0;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Count-up
  useEffect(() => {
    const els = document.querySelectorAll('.countup');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = +el.dataset.target;
          let current = 0;
          const increment = target / 40;
          const update = () => {
            current = Math.min(current + increment, target);
            el.textContent = Math.round(current);
            if (current < target) requestAnimationFrame(update);
          };
          update();
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = useCallback((id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="landing-root">
      {/* Cursor */}
      <div className="landing-cursor" ref={cursorRef} />
      <div className="landing-cursor-ring" ref={ringRef} />

      {/* NAV */}
      <nav className="landing-nav" ref={navRef}>
        <a href="#" className="nav-logo" onClick={(e) => e.preventDefault()}>
          <div className="nav-logo-icon">SC</div>
          <span className="nav-logo-text">Super<span>Club</span></span>
        </a>
        <ul className="nav-links">
          <li><a href="#features" onClick={scrollTo('features')}>Features</a></li>
          <li><a href="#process" onClick={scrollTo('process')}>Process</a></li>
          <li><a href="#register" onClick={scrollTo('register')}>Register</a></li>
          <li><Link to="/admin/login" className="nav-link-item">Admin</Link></li>
        </ul>
        <Link to="/register" className="nav-cta">Get Started</Link>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
        <div className="hero-grid" />
        <div className="hero-glow-left" />
        <div className="hero-glow-right" />
        <div className="landing-particles" ref={particlesRef} />

        <div className="orb-ring" />
        <div className="orb-ring" />
        <div className="orb-ring" />
        <div className="hero-orb" />

        <div className="hero-content">
          <div className="hero-eyebrow">Phase 1 · Sports Club Platform · India</div>
          <h1 className="hero-title">
            <span className="line1">ELEVATE</span>
            <span className="line2">YOUR CLUB.</span>
            <span className="line3">DOMINATE</span>
          </h1>
          <p className="hero-sub">
            <strong>SuperClub</strong> is the all-in-one sports management platform — athlete registration, document management, and admin intelligence. Built for champions, engineered for excellence.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="landing-btn-primary">
              Register as Athlete
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a href="#features" className="landing-btn-secondary" onClick={scrollTo('features')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              See How It Works
            </a>
          </div>
        </div>

        <div className="hero-stats landing-reveal">
          {STATS.map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-num countup" data-target={s.target}>0</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-features" id="features">
        <div className="features-header landing-reveal">
          <span className="section-label-landing">Core Capabilities</span>
          <h2 className="section-title-landing">BUILT FOR<br /><span className="accent">CHAMPIONS</span></h2>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card landing-reveal" key={i} style={{ '--card-accent': f.accent, '--icon-bg': f.iconBg, '--icon-border': f.iconBorder, '--badge-bg': f.badgeBg, '--badge-border': f.badgeBorder, '--badge-color': f.badgeColor }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title-card">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <span className="feature-badge">{f.badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FLOW */}
      <section className="landing-flow" id="process">
        <div className="landing-reveal" style={{ textAlign: 'center' }}>
          <span className="section-label-landing">The Process</span>
          <h2 className="section-title-landing">8 STEPS TO<br /><span className="accent">GREATNESS</span></h2>
        </div>
        <div className="flow-steps">
          {STEPS.map((s, i) => (
            <div className="flow-step landing-reveal" key={i}>
              <div className="step-num">{i + 1}</div>
              <div className="step-name">{s.name}</div>
              <div className="step-detail">{s.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta" id="register">
        <div className="cta-bg" />
        <div className="cta-card landing-reveal">
          <h2 className="cta-title">READY TO<br /><span>JOIN THE CLUB?</span></h2>
          <p className="cta-sub">Start your athlete registration today. Complete all 8 steps, upload your documents, and get your Registration ID — it only takes minutes.</p>
          <div className="cta-buttons">
            <Link to="/register" className="landing-btn-primary">
              Begin Registration
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/admin/login" className="landing-btn-secondary">Admin Login</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-copy">© 2026 <span>SuperClub</span> · Sports Club Management Platform · Phase 1</div>
        <ul className="footer-links">
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Support</a></li>
        </ul>
      </footer>
    </div>
  );
}
