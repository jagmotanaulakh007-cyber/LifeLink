import { useEffect, useState } from 'react'
import {
  Heart,
  User,
  Droplet,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import bloodDonors from '../data/donors.js'
import '../styles/DonateBlood.css'

function DonateBlood() {
  const [formData, setFormData] = useState({ name: '', age: '', bloodGroup: '', phone: '', location: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const existingDonors = window.localStorage.getItem('bloodDonors')
    if (!existingDonors) window.localStorage.setItem('bloodDonors', JSON.stringify(bloodDonors))

    try {
      const user = JSON.parse(window.localStorage.getItem('lifelink_user') || '{}')
      setFormData((previous) => ({
        ...previous,
        name: user.name || previous.name,
        bloodGroup: user.bloodGroup || previous.bloodGroup,
        phone: user.phone || previous.phone,
        location: user.city || previous.location
      }))
    } catch {
      // Keep the form empty if no session user exists.
    }
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
    setSubmitted(false)
  }

  function validateForm() {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Please enter your name'
    if (!formData.age) newErrors.age = 'Please enter your age'
    else if (Number(formData.age) < 18 || Number(formData.age) > 65) newErrors.age = 'Age must be between 18 and 65'
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Please select your blood group'
    if (!formData.phone.trim()) newErrors.phone = 'Please enter your phone number'
    else if (!/^[0-9]{10}$/.test(formData.phone.trim())) newErrors.phone = 'Enter a valid 10-digit phone number'
    if (!formData.location.trim()) newErrors.location = 'Please enter your location'
    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    let existingDonors = []
    try {
      existingDonors = JSON.parse(window.localStorage.getItem('bloodDonors') || '[]')
    } catch {
      existingDonors = []
    }

    let user = {}
    try {
      user = JSON.parse(window.localStorage.getItem('lifelink_user') || '{}')
    } catch {
      user = {}
    }

    const newDonor = {
      id: Date.now(),
      name: formData.name.trim(),
      age: Number(formData.age),
      bloodGroup: formData.bloodGroup,
      location: formData.location.trim(),
      phone: formData.phone.trim(),
      email: user.email || '',
      available: true
    }

    const withoutCurrentDonor = existingDonors.filter((donor) => {
      if (user.email && donor.email) return donor.email !== user.email
      return donor.phone !== newDonor.phone
    })

    window.localStorage.setItem('bloodDonors', JSON.stringify([...withoutCurrentDonor, newDonor]))

    if (user.email) {
      const updatedUser = { ...user, bloodGroup: formData.bloodGroup, isBloodDonor: true }
      window.localStorage.setItem('lifelink_user', JSON.stringify(updatedUser))

      try {
        const users = JSON.parse(window.localStorage.getItem('lifelink_users') || '[]')
        const updatedUsers = users.map((storedUser) =>
          storedUser.email?.trim().toLowerCase() === user.email.trim().toLowerCase()
            ? { ...storedUser, bloodGroup: formData.bloodGroup, isBloodDonor: true }
            : storedUser
        )
        window.localStorage.setItem('lifelink_users', JSON.stringify(updatedUsers))
      } catch {
        // Keep the donor registration successful even if old user data is malformed.
      }
    }

    window.dispatchEvent(new Event('lifelink-data-change'))
    setSubmitted(true)
    setErrors({})
  }

  return (
    <main className="donate-blood-page">
      <div className="container">
        <section className="donate-header">
          <div className="donate-icon"><Heart size={28} /></div>
          <span className="section-kicker">MAKE A DIFFERENCE</span>
          <h1>Donate Blood</h1>
          <p>Your blood donation can help someone during an emergency, surgery, or critical medical situation.</p>
        </section>

        <section className="donate-info-section">
          <div className="donate-info-card"><Droplet size={22} /><div><h3>Why donate blood?</h3><p>Blood is needed every day for patients who require emergency care, surgery, and other medical treatments.</p></div></div>
          <div className="donate-info-card"><CheckCircle size={22} /><div><h3>Before donating</h3><p>Donors should generally be healthy and meet the eligibility requirements of the blood donation center.</p></div></div>
        </section>

        <section className="donate-form-section">
          <div className="donate-form-header">
            <span className="section-kicker">DONOR REGISTRATION</span>
            <h2>Register as a Blood Donor</h2>
            <p>Enter your details to make your availability visible in the Find Blood section.</p>
          </div>

          {submitted && (
            <div className="donate-success">
              <CheckCircle size={21} />
              <div><strong>Thank you for registering as a donor!</strong><p>Your donor information is now available in the Find Blood section and your Dashboard.</p></div>
            </div>
          )}

          <form className="donate-form" onSubmit={handleSubmit} noValidate>
            <div className="donate-field"><label htmlFor="name">Full Name</label><div className="donate-input-wrap"><User size={17} /><input id="name" name="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={handleChange} /></div>{errors.name && <span className="donate-error">{errors.name}</span>}</div>
            <div className="donate-field"><label htmlFor="age">Age</label><input id="age" name="age" type="number" min="18" max="65" placeholder="Enter your age" value={formData.age} onChange={handleChange} />{errors.age && <span className="donate-error">{errors.age}</span>}</div>
            <div className="donate-field"><label htmlFor="bloodGroup">Blood Group</label><div className="donate-input-wrap"><Droplet size={17} /><select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}><option value="">Select blood group</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select></div>{errors.bloodGroup && <span className="donate-error">{errors.bloodGroup}</span>}</div>
            <div className="donate-field"><label htmlFor="phone">Phone Number</label><div className="donate-input-wrap"><Phone size={17} /><input id="phone" name="phone" type="tel" inputMode="numeric" placeholder="10-digit phone number" value={formData.phone} onChange={handleChange} maxLength="10" /></div>{errors.phone && <span className="donate-error">{errors.phone}</span>}</div>
            <div className="donate-field donate-field-full"><label htmlFor="location">City / Location</label><div className="donate-input-wrap"><MapPin size={17} /><input id="location" name="location" type="text" placeholder="Example: Andheri West, Mumbai" value={formData.location} onChange={handleChange} /></div>{errors.location && <span className="donate-error">{errors.location}</span>}</div>
            <div className="donate-form-notice"><AlertCircle size={17} /><p>Please provide accurate information so people searching for blood can find the appropriate donor.</p></div>
            <button type="submit" className="donate-submit-button"><Heart size={17} /> Register as Blood Donor</button>
          </form>
        </section>
      </div>
    </main>
  )
}

export default DonateBlood
