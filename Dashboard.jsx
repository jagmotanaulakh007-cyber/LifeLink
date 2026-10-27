import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  Building2,
  Clock3,
  Droplet,
  HeartPulse,
  MapPin,
  Pill,
  Plus,
  Siren,
  UserRound
} from 'lucide-react'
import { Link } from 'react-router-dom'
import RequestCard from '../components/RequestCard.jsx'
import '../styles/Dashboard.css'

function readArray(key) {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function Dashboard() {
  const [requests, setRequests] = useState([])
  const [donorProfile, setDonorProfile] = useState(null)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem('lifelink_user') || '{}')
    } catch {
      return {}
    }
  })

  function loadDashboardData() {
    let currentUser = {}
    try {
      currentUser = JSON.parse(window.localStorage.getItem('lifelink_user') || '{}')
    } catch {
      currentUser = {}
    }

    setUser(currentUser)

    const allRequests = readArray('lifelink_requests')
    const currentEmail = currentUser.email?.trim().toLowerCase()
    const currentPhone = currentUser.phone?.trim()

    const userRequests = allRequests.filter((request) => {
      if (!request.requesterEmail && !request.requesterPhone) return false
      return (
        (currentEmail && request.requesterEmail?.trim().toLowerCase() === currentEmail) ||
        (currentPhone && request.requesterPhone === currentPhone)
      )
    })

    setRequests(userRequests)

    const storedDonors = readArray('bloodDonors')

    // Only show the donor section when this logged-in user
    // has explicitly registered through Donate Blood.
    // The seeded donors are community donors and must not
    // make every user appear as a blood donor.
    const matchingDonor = currentUser.isBloodDonor && currentEmail
      ? storedDonors.find(
          (donor) => donor.email?.trim().toLowerCase() === currentEmail
        )
      : null

    setDonorProfile(matchingDonor || null)
  }

  useEffect(() => {
    loadDashboardData()

    const refresh = () => loadDashboardData()
    window.addEventListener('focus', refresh)
    window.addEventListener('lifelink-data-change', refresh)
    window.addEventListener('lifelink-auth-change', refresh)

    return () => {
      window.removeEventListener('focus', refresh)
      window.removeEventListener('lifelink-data-change', refresh)
      window.removeEventListener('lifelink-auth-change', refresh)
    }
  }, [])

  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((item) => item.status === 'Pending' || item.status === 'Waiting for donor').length,
    blood: requests.filter((item) => item.type === 'blood').length,
    ambulance: requests.filter((item) => item.type === 'ambulance').length
  }), [requests])

  const quickActions = [
    { icon: Droplet, label: 'Find Blood', description: 'Find compatible blood donors', to: '/blood-requests', tone: 'red' },
    { icon: Building2, label: 'Find Hospitals', description: 'Find nearby hospitals', to: '/hospitals', tone: 'blue' },
    { icon: Pill, label: 'Find Medicines', description: 'Check medicine availability', to: '/medicines', tone: 'violet' },
    { icon: Siren, label: 'Find Ambulance', description: 'Find ambulance services', to: '/ambulance', tone: 'orange' }
  ]

  return (
    <main className="container page-section dashboard-page">
      <section className="dashboard-welcome">
        <div className="dashboard-welcome-icon"><HeartPulse size={22} /></div>
        <div className="dashboard-welcome-text">
          <span className="section-kicker">YOUR LIFELINK</span>
          <h1 className="page-heading">Hello, {user.name || 'there'}.</h1>
          <p className="page-subtext">Keep track of requests you have made and quickly access the resources you need.</p>
        </div>
        <Link to="/blood-requests" className="btn btn-pulse"><Plus size={17} /> New request</Link>
      </section>

      <section className="stats-grid">
        <div className="card stat-card"><span className="stat-icon"><Activity size={19} /></span><div><strong>{stats.total}</strong><span>Your requests</span></div></div>
        <div className="card stat-card"><span className="stat-icon amber"><Clock3 size={19} /></span><div><strong>{stats.pending}</strong><span>Pending</span></div></div>
        <div className="card stat-card"><span className="stat-icon red"><Droplet size={19} /></span><div><strong>{stats.blood}</strong><span>Blood requests</span></div></div>
        <div className="card stat-card"><span className="stat-icon orange"><Siren size={19} /></span><div><strong>{stats.ambulance}</strong><span>Ambulance requests</span></div></div>
      </section>

      <section className="dashboard-quick-section">
        <div className="section-title-row">
          <div><h2>Quick access</h2><p>Go directly to the resource you need.</p></div>
        </div>
        <div className="dashboard-quick-grid">
          {quickActions.map(({ icon: Icon, label, description, to, tone }) => (
            <Link key={label} to={to} className="card dashboard-quick-card">
              <span className={`quick-action-icon ${tone}`}><Icon size={20} /></span>
              <span className="quick-action-content"><strong>{label}</strong><small>{description}</small></span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-main-grid">
        <div>
          <div className="section-title-row">
            <div><h2>Requests you have made</h2><p>Your latest emergency activity.</p></div>
            <Link to="/blood-requests">Create request <ArrowRight size={15} /></Link>
          </div>

          {requests.length > 0 ? (
            <div className="dashboard-request-list">
              {requests.slice().sort((a, b) => Number(b.id) - Number(a.id)).map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="card dashboard-empty">
              <Activity size={24} />
              <h3>No requests yet</h3>
              <p>Your emergency requests will appear here after you create one.</p>
              <div className="dashboard-empty-actions">
                <Link to="/blood-requests" className="btn btn-primary"><Droplet size={16} /> Find Blood</Link>
                <Link to="/hospitals" className="btn btn-outline"><Building2 size={16} /> Find Hospitals</Link>
              </div>
            </div>
          )}
        </div>

        <aside className="dashboard-side">
          <div className="card side-card profile-summary-card">
            <span className="side-icon"><UserRound size={19} /></span>
            <h3>Your profile</h3>
            <div className="profile-summary">
              <div><span>Name</span><strong>{user.name || 'Not set'}</strong></div>
              <div><span>Blood group</span><strong>{user.bloodGroup || 'Not set'}</strong></div>
              {user.city && <div><span>City</span><strong>{user.city}</strong></div>}
            </div>
            <Link to="/profile" className="side-card-link">View profile <ArrowRight size={15} /></Link>
          </div>

          {donorProfile ? (
            <div className="card side-card donor-dashboard-card">
              <span className="side-icon donor-side-icon"><Droplet size={19} /></span>
              <h3>You are registered as a blood donor</h3>
              <p>Your donor details are visible in Find Blood.</p>
              <div className="donor-dashboard-details">
                <div><span>Blood group</span><strong>{donorProfile.bloodGroup}</strong></div>
                <div><span>Location</span><strong>{donorProfile.location}</strong></div>
                <div><span>Status</span><strong>{donorProfile.available ? 'Available' : 'Unavailable'}</strong></div>
              </div>
              <Link to="/blood-requests" className="side-card-link">View blood support <ArrowRight size={15} /></Link>
            </div>
          ) : (
            <div className="card side-card donor-dashboard-card">
              <span className="side-icon donor-side-icon"><Droplet size={19} /></span>
              <h3>Want to help someone?</h3>
              <p>Register your availability as a blood donor and appear in the Find Blood directory.</p>
              <Link to="/donate-blood" className="side-card-link">Donate blood <ArrowRight size={15} /></Link>
            </div>
          )}

          <div className="card side-card">
            <span className="side-icon"><MapPin size={19} /></span>
            <h3>Resource discovery</h3>
            <p>Find blood donors, hospitals, medicines, ambulances and medical equipment through LifeLink's resource directories.</p>
            <Link to="/resources" className="side-card-link">Explore resources <ArrowRight size={15} /></Link>
          </div>

          <div className="card side-card subtle">
            <span className="side-icon"><Activity size={19} /></span>
            <h3>Emergency note</h3>
            <p>For life-threatening situations, contact your local emergency service immediately.</p>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default Dashboard
