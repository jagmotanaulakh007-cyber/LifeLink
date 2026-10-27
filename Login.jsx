import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import '../styles/Auth.css'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
    setAuthError('')
  }

  function validate() {
    const newErrors = {}
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!emailPattern.test(form.email.trim())) newErrors.email = 'Enter a valid email address'
    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'

    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)
    setAuthError('')
    if (Object.keys(validationErrors).length > 0) return

    let users = []
    try {
      users = JSON.parse(window.localStorage.getItem('lifelink_users') || '[]')
    } catch {
      users = []
    }

    const enteredEmail = form.email.trim().toLowerCase()
    const matchedUser = users.find(
      (user) => user.email?.trim().toLowerCase() === enteredEmail && user.password === form.password
    )

    if (!matchedUser) {
      setAuthError('Invalid email or password. Please check your details and try again.')
      return
    }

    const sessionUser = {
      name: matchedUser.name,
      email: matchedUser.email,
      phone: matchedUser.phone || '',
      city: matchedUser.city || '',
      bloodGroup: matchedUser.bloodGroup || '',
      isBloodDonor: Boolean(matchedUser.isBloodDonor)
    }

    window.localStorage.setItem('lifelink_user', JSON.stringify(sessionUser))
    window.dispatchEvent(new Event('lifelink-auth-change'))
    navigate(location.state?.from || '/dashboard', { replace: true })
  }

  return (
    <main className="auth-wrap">
      <div className="auth-blob auth-blob-1" aria-hidden="true" />
      <div className="auth-blob auth-blob-2" aria-hidden="true" />

      <div className="card auth-card">
        <div className="auth-brand-mark"><LockKeyhole size={19} /></div>
        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subtext">Access your requests, resources and LifeLink profile.</p>

        {authError && <div className="auth-alert" role="alert">{authError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Your password" autoComplete="current-password" />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((previous) => !previous)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary auth-submit">
            Log in <ArrowRight size={17} />
          </button>
        </form>

        <div className="auth-note">
          <ShieldCheck size={15} />
          <span>Prototype authentication uses browser storage. Secure backend authentication can be added in PBE-2.</span>
        </div>

        <p className="auth-footer-text">New to LifeLink? <Link to="/register">Create an account</Link></p>
      </div>
    </main>
  )
}

export default Login
