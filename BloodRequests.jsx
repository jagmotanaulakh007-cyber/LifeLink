import { useEffect, useState } from 'react'
import {
  Droplet,
  MapPin,
  Phone,
  Plus,
  Search,
  X,
  CheckCircle2
} from 'lucide-react'

import donors from '../data/donors.js'
import Notification from '../components/Notification.jsx'
import '../styles/BloodRequests.css'

const REQUESTS_KEY = 'lifelink_requests'

const bloodGroups = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-'
]

const compatibility = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-'
  ],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-']
}

function BloodRequests() {
  const [bloodGroup, setBloodGroup] = useState('')
  const [location, setLocation] = useState('')
  const [urgency, setUrgency] = useState('Urgent')
  const [searched, setSearched] = useState(false)

  const [showRequestForm, setShowRequestForm] = useState(false)
  const [message, setMessage] = useState('')

  const [requests, setRequests] = useState([])
  const [donorList, setDonorList] = useState([])

  const [form, setForm] = useState({
    patientName: '',
    bloodGroup: '',
    units: '1',
    hospital: '',
    contact: '',
    urgency: 'Urgent'
  })

  const [errors, setErrors] = useState({})


  /* LOAD BLOOD REQUESTS */

  useEffect(() => {
    try {
      const savedRequests = JSON.parse(
        window.localStorage.getItem(REQUESTS_KEY) ||
        window.localStorage.getItem('lifelink_blood_requests') ||
        '[]'
      )

      const safeRequests = Array.isArray(savedRequests) ? savedRequests : []
      setRequests(safeRequests)
      window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(safeRequests))
    } catch {
      setRequests([])
    }
  }, [])


  /* LOAD DONORS FROM LOCAL STORAGE */

  useEffect(() => {
    const savedDonors = window.localStorage.getItem(
      'bloodDonors'
    )

    if (savedDonors) {
      try {
        setDonorList(JSON.parse(savedDonors))
      } catch {
        window.localStorage.setItem(
          'bloodDonors',
          JSON.stringify(donors)
        )

        setDonorList(donors)
      }
    } else {
      window.localStorage.setItem(
        'bloodDonors',
        JSON.stringify(donors)
      )

      setDonorList(donors)
    }
  }, [])


  /* FILTER DONORS */

  const filteredDonors = donorList.filter((donor) => {
    const matchesBlood =
      !bloodGroup ||
      compatibility[bloodGroup]?.includes(
        donor.bloodGroup
      )

    const matchesLocation =
      !location ||
      donor.location
        .toLowerCase()
        .includes(location.toLowerCase())

    return matchesBlood && matchesLocation
  })


  /* SEARCH */

  function handleSearch(e) {
    e.preventDefault()
    setSearched(true)
  }


  /* REQUEST FORM */

  function handleFormChange(e) {
    const { name, value } = e.target

    setForm((previous) => ({
      ...previous,
      [name]: value
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: ''
    }))
  }


  /* VALIDATE REQUEST */

  function validateForm() {
    const newErrors = {}

    if (!form.patientName.trim()) {
      newErrors.patientName =
        'Patient name is required'
    }

    if (!form.bloodGroup) {
      newErrors.bloodGroup =
        'Select a blood group'
    }

    if (!form.hospital.trim()) {
      newErrors.hospital =
        'Hospital name is required'
    }

    if (!/^[0-9]{10}$/.test(form.contact)) {
      newErrors.contact =
        'Enter a valid 10-digit number'
    }

    return newErrors
  }


  /* CREATE BLOOD REQUEST */

  function handleRequestSubmit(e) {
    e.preventDefault()

    const validationErrors = validateForm()

    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    const currentUser = JSON.parse(window.localStorage.getItem('lifelink_user') || '{}')
    const now = new Date()

    const newRequest = {
      id: Date.now(),
      type: 'blood',
      patientName: form.patientName.trim(),
      bloodGroup: form.bloodGroup,
      units: Number(form.units),
      hospital: form.hospital.trim(),
      contact: form.contact.trim(),
      urgency: form.urgency,
      status: 'Pending',
      createdAt: now.toLocaleDateString(),
      submittedAt: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      requesterEmail: currentUser.email || '',
      requesterPhone: currentUser.phone || ''
    }

    const updatedRequests = [
      ...requests,
      newRequest
    ]

    setRequests(updatedRequests)

    window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(updatedRequests))
    window.localStorage.setItem('lifelink_blood_requests', JSON.stringify(updatedRequests))
    window.dispatchEvent(new Event('lifelink-data-change'))

    setForm({
      patientName: '',
      bloodGroup: '',
      units: '1',
      hospital: '',
      contact: '',
      urgency: 'Urgent'
    })

    setErrors({})
    setShowRequestForm(false)

    setMessage(
      'Blood request created successfully'
    )
  }


  /* REQUEST BLOOD FROM DONOR */

  function openRequestForDonor(donor) {
    setForm((previous) => ({
      ...previous,
      bloodGroup: donor.bloodGroup
    }))

    setShowRequestForm(true)
  }


  /* CANCEL REQUEST */

  function cancelRequest(id) {
    const updatedRequests =
      requests.filter(
        (request) => request.id !== id
      )

    setRequests(updatedRequests)

    window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(updatedRequests))
    window.localStorage.setItem('lifelink_blood_requests', JSON.stringify(updatedRequests))
    window.dispatchEvent(new Event('lifelink-data-change'))

    setMessage('Blood request cancelled')
  }


  return (
    <main className="blood-page">

      <div className="container">

        {/* PAGE HEADER */}

        <section className="blood-header">

          <span className="section-kicker">
            BLOOD SUPPORT
          </span>

          <h1>Find Blood</h1>

          <p>
            Find compatible blood donors near you
            or create an urgent blood request.
          </p>

        </section>


        {/* SEARCH SECTION */}

        <section className="blood-search-card">

          <div className="blood-section-title">

            <div>

              <h2>
                Find a blood donor
              </h2>

              <p>
                Search available donors by blood
                group and city.
              </p>

            </div>


            <button
              className="btn btn-pulse"
              onClick={() =>
                setShowRequestForm(true)
              }
            >
              <Plus size={17} />
              Create Request
            </button>

          </div>


          <form
            className="blood-search-form"
            onSubmit={handleSearch}
          >

            <div className="blood-field">

              <label htmlFor="searchBloodGroup">
                Blood Group
              </label>

              <select
                id="searchBloodGroup"
                value={bloodGroup}
                onChange={(e) =>
                  setBloodGroup(e.target.value)
                }
              >

                <option value="">
                  Any blood group
                </option>

                {bloodGroups.map((group) => (
                  <option
                    key={group}
                    value={group}
                  >
                    {group}
                  </option>
                ))}

              </select>

            </div>


            <div className="blood-field">

              <label htmlFor="searchLocation">
                Location
              </label>

              <input
                id="searchLocation"
                type="text"
                placeholder="Enter city or area"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
              />

            </div>


            <div className="blood-field">

              <label htmlFor="urgency">
                Urgency
              </label>

              <select
                id="urgency"
                value={urgency}
                onChange={(e) =>
                  setUrgency(e.target.value)
                }
              >

                <option>Normal</option>
                <option>Urgent</option>
                <option>Critical</option>

              </select>

            </div>


            <button
              type="submit"
              className="btn btn-primary blood-search-button"
            >
              <Search size={17} />
              Search Donors
            </button>

          </form>

        </section>


        {/* DONOR RESULTS */}

        <section className="blood-results">

          <div className="blood-results-heading">

            <div>

              <span className="section-kicker">
                AVAILABLE DONORS
              </span>

              <h2>
                {searched
                  ? `${filteredDonors.length} donors found`
                  : 'Available blood donors'}
              </h2>

            </div>


            {bloodGroup && (
              <span className="blood-filter">
                {bloodGroup} compatible
              </span>
            )}

          </div>


          {filteredDonors.length > 0 ? (

            <div className="blood-donor-grid">

              {filteredDonors.map((donor) => (

                <article
                  className="blood-donor-card"
                  key={donor.id}
                >

                  <div className="donor-card-top">

                    <div className="donor-avatar">
                      <Droplet size={21} />
                    </div>


                    <span
                      className={
                        donor.available
                          ? 'donor-status available'
                          : 'donor-status unavailable'
                      }
                    >

                      <span></span>

                      {donor.available
                        ? 'Available now'
                        : 'Unavailable'}

                    </span>

                  </div>


                  <h3>
                    {donor.name}
                  </h3>


                  <div className="donor-blood-group">
                    {donor.bloodGroup} Blood Group
                  </div>


                  {/* LOCATION + PHONE */}

                  <div className="donor-info">

                    <span>

                      <MapPin size={15} />

                      {donor.location}

                    </span>


                    <span>

                      <Phone size={15} />

                      {donor.phone}

                    </span>

                  </div>


                  <button
                    className="donor-request-button"
                    disabled={!donor.available}
                    onClick={() =>
                      openRequestForDonor(donor)
                    }
                  >

                    {donor.available
                      ? 'Request Blood'
                      : 'Currently Unavailable'}

                  </button>

                </article>

              ))}

            </div>

          ) : (

            <div className="blood-empty">

              <Droplet size={30} />

              <h3>
                No compatible donors found
              </h3>

              <p>
                Try another blood group or location.
              </p>

            </div>

          )}

        </section>


        {/* COMPATIBILITY */}

        <section className="compatibility-section">

          <div className="compatibility-heading">

            <span className="section-kicker">
              BLOOD COMPATIBILITY
            </span>

            <h2>
              Who can donate to whom?
            </h2>

            <p>
              Use this guide to understand
              compatible blood groups.
            </p>

          </div>


          <div className="compatibility-grid">

            {bloodGroups.map((group) => (

              <div
                className="compatibility-card"
                key={group}
              >

                <strong>
                  {group}
                </strong>

                <span>
                  Can receive from
                </span>

                <div>

                  {compatibility[group].map(
                    (compatibleGroup) => (
                      <small
                        key={compatibleGroup}
                      >
                        {compatibleGroup}
                      </small>
                    )
                  )}

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* MY REQUESTS */}

        <section className="my-blood-requests">

          <div className="blood-results-heading">

            <div>

              <span className="section-kicker">
                MY REQUESTS
              </span>

              <h2>
                Blood requests
              </h2>

            </div>

          </div>


          {requests.length > 0 ? (

            <div className="request-list">

              {requests.map((request) => (

                <article
                  className="request-item"
                  key={request.id}
                >

                  <div className="request-icon">
                    <Droplet size={19} />
                  </div>


                  <div className="request-details">

                    <h3>
                      {request.bloodGroup} ·{' '}
                      {request.units} unit
                      {request.units > 1
                        ? 's'
                        : ''}
                    </h3>

                    <p>
                      {request.hospital} ·{' '}
                      {request.patientName}
                    </p>

                    <small>
                      Created {request.createdAt}
                    </small>

                  </div>


                  <div className="request-right">

                    <span className="request-status">
                      {request.status}
                    </span>

                    <button
                      className="cancel-request"
                      onClick={() =>
                        cancelRequest(request.id)
                      }
                    >
                      Cancel
                    </button>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="no-requests">

              <CheckCircle2 size={22} />

              <p>
                You haven't created any blood
                requests yet.
              </p>

            </div>

          )}

        </section>

      </div>


      {/* CREATE REQUEST MODAL */}

      {showRequestForm && (

        <div
          className="blood-modal-overlay"
          onClick={() =>
            setShowRequestForm(false)
          }
        >

          <div
            className="blood-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="blood-modal-header">

              <div>

                <span className="section-kicker">
                  EMERGENCY REQUEST
                </span>

                <h2>
                  Create Blood Request
                </h2>

              </div>


              <button
                className="modal-close"
                onClick={() =>
                  setShowRequestForm(false)
                }
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>


            <p className="modal-description">
              Enter the patient's details to create
              a blood request.
            </p>


            <form onSubmit={handleRequestSubmit}>

              <div className="blood-field">

                <label htmlFor="patientName">
                  Patient Name
                </label>

                <input
                  id="patientName"
                  name="patientName"
                  value={form.patientName}
                  onChange={handleFormChange}
                  placeholder="Enter patient name"
                />

                {errors.patientName && (
                  <span className="error-text">
                    {errors.patientName}
                  </span>
                )}

              </div>


              <div className="modal-form-row">

                <div className="blood-field">

                  <label htmlFor="requestBloodGroup">
                    Blood Group
                  </label>

                  <select
                    id="requestBloodGroup"
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={handleFormChange}
                  >

                    <option value="">
                      Select group
                    </option>

                    {bloodGroups.map((group) => (
                      <option
                        key={group}
                        value={group}
                      >
                        {group}
                      </option>
                    ))}

                  </select>

                  {errors.bloodGroup && (
                    <span className="error-text">
                      {errors.bloodGroup}
                    </span>
                  )}

                </div>


                <div className="blood-field">

                  <label htmlFor="units">
                    Units Required
                  </label>

                  <input
                    id="units"
                    name="units"
                    type="number"
                    min="1"
                    max="10"
                    value={form.units}
                    onChange={handleFormChange}
                  />

                </div>

              </div>


              <div className="blood-field">

                <label htmlFor="hospital">
                  Hospital
                </label>

                <input
                  id="hospital"
                  name="hospital"
                  value={form.hospital}
                  onChange={handleFormChange}
                  placeholder="Hospital name"
                />

                {errors.hospital && (
                  <span className="error-text">
                    {errors.hospital}
                  </span>
                )}

              </div>


              <div className="modal-form-row">

                <div className="blood-field">

                  <label htmlFor="contact">
                    Contact Number
                  </label>

                  <input
                    id="contact"
                    name="contact"
                    value={form.contact}
                    onChange={handleFormChange}
                    placeholder="10-digit number"
                    maxLength="10"
                  />

                  {errors.contact && (
                    <span className="error-text">
                      {errors.contact}
                    </span>
                  )}

                </div>


                <div className="blood-field">

                  <label htmlFor="requestUrgency">
                    Urgency
                  </label>

                  <select
                    id="requestUrgency"
                    name="urgency"
                    value={form.urgency}
                    onChange={handleFormChange}
                  >

                    <option>Normal</option>
                    <option>Urgent</option>
                    <option>Critical</option>

                  </select>

                </div>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() =>
                    setShowRequestForm(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="btn btn-pulse"
                >
                  Create Request
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      <Notification
        message={message}
        onClose={() => setMessage('')}
      />

    </main>
  )
}

export default BloodRequests