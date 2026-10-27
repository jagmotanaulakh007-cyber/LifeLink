import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Building2,
  Clock3,
  Compass,
  Droplet,
  HeartPulse,
  MapPinned,
  Pill,
  ShieldCheck,
  Siren,
  Sparkles,
  Stethoscope,
  UserCheck,
  Users
} from 'lucide-react'
import '../styles/Home.css'

function Home() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const hash = location.hash
    if (hash) {
      const timer = window.setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
      return () => window.clearTimeout(timer)
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname, location.hash])

  const resources = [
    { icon: Droplet, title: 'Blood', description: 'Find compatible blood donors near you.', to: '/blood-requests', tone: 'red' },
    { icon: Building2, title: 'Hospitals', description: 'Find hospitals and emergency care.', to: '/hospitals', tone: 'blue' },
    { icon: Pill, title: 'Medicines', description: 'Check medicine availability nearby.', to: '/medicines', tone: 'violet' },
    { icon: Siren, title: 'Ambulance', description: 'Find available ambulance services.', to: '/ambulance', tone: 'orange' },
    { icon: Stethoscope, title: 'Equipment', description: 'Find essential medical equipment.', to: '/equipment', tone: 'green' }
  ]

  return (
    <main>
      <section className="hero-home">
        <div className="container hero-layout hero-layout-single">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> Community emergency network</div>
            <h1>When every minute matters, <span>find help faster.</span></h1>
            <p>LifeLink connects patients, families and communities with blood donors, hospitals, medicines, ambulances and medical equipment from one trusted place.</p>
            <div className="hero-actions">
              <button type="button" onClick={() => navigate('/start')} className="btn btn-pulse"><HeartPulse size={18} /> Get Started <ArrowRight size={17} /></button>
            </div>
            <div className="hero-trust-row">
              <span><ShieldCheck size={16} /> Community-first</span>
              <span><Clock3 size={16} /> Faster coordination</span>
              <span><BadgeCheck size={16} /> Trusted network</span>
            </div>
          </div>
        </div>
        <div className="hero-scroll" aria-hidden="true"><span>Scroll down</span><ArrowDown size={16} /></div>
      </section>

      <section id="about" className="container page-section home-about">
        <div className="about-card">
          <div className="about-intro">
            <span className="section-kicker">ABOUT LIFELINK</span>
            <h2 className="page-heading">One place to coordinate emergency resources.</h2>
            <div className="about-badge"><Sparkles size={15} /> Built for critical moments</div>
          </div>
          <div className="about-copy">
            <p>During an emergency, families often search across calls, messages, social media and separate provider websites. LifeLink brings those resource-finding journeys into one simple platform.</p>
            <p>It is designed for coordination and discovery, not diagnosis. The goal is to help people reach the right resource faster while keeping the experience simple for patients, families and community providers.</p>
            <div className="about-highlights">
              <div className="about-highlight"><span className="about-highlight-icon"><MapPinned size={17} /></span><div><strong>All resources, one place</strong><p>Blood, hospitals, medicines, ambulances and equipment together.</p></div></div>
              <div className="about-highlight"><span className="about-highlight-icon"><Users size={17} /></span><div><strong>Community powered</strong><p>Donors, hospitals, pharmacies and providers on the same network.</p></div></div>
              <div className="about-highlight"><span className="about-highlight-icon"><UserCheck size={17} /></span><div><strong>Simple to use</strong><p>Clear resource pages help you find information and make connections.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="container home-resources-section">
        <div className="home-resources-heading">
          <span className="section-kicker">WHAT YOU CAN FIND</span>
          <h2>Emergency resources, all in one place.</h2>
          <p>Choose the resource you need and view available options through LifeLink.</p>
        </div>
        <div className="home-resource-grid">
          {resources.map(({ icon: Icon, title, description, to, tone }) => (
            <button key={title} type="button" className="home-resource-card" onClick={() => navigate(to)}>
              <span className={`home-resource-icon ${tone}`}><Icon size={21} /></span>
              <span className="home-resource-content"><strong>{title}</strong><small>{description}</small></span>
              <ArrowRight size={16} />
            </button>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="container how-section">
        <div className="how-card">
          <div>
            <span className="section-kicker how-kicker">HOW IT WORKS</span>
            <h2>From emergency to response in a few steps.</h2>
            <p className="how-lead">A simple, guided path so you know where to look next.</p>
          </div>
          <div className="steps">
            <div className="step"><span className="step-icon"><Compass size={18} /></span><div><strong>Get started</strong><p>Choose whether you need help or want to help.</p></div></div>
            <div className="step"><span className="step-icon"><HeartPulse size={18} /></span><div><strong>Choose a resource</strong><p>Find blood, hospitals, medicines, ambulances or medical equipment.</p></div></div>
            <div className="step"><span className="step-icon"><ShieldCheck size={18} /></span><div><strong>Connect</strong><p>View resource details and contact the donor or provider.</p></div></div>
          </div>
        </div>
      </section>

      <section className="container safety-banner">
        <ShieldCheck size={24} />
        <div><strong>Designed for coordination, not diagnosis.</strong><p>LifeLink does not replace doctors, hospitals or emergency services. It helps people organize access to resources faster.</p></div>
      </section>
    </main>
  )
}

export default Home
