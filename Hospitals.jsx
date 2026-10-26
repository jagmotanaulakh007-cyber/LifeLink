import { useState } from 'react'
import {
  Building2,
  MapPin,
  Phone,
  Star,
  X,
  Clock,
  ShieldCheck,
  BedDouble
} from 'lucide-react'

import hospitals from '../data/hospitals.js'
import Notification from '../components/Notification.jsx'
import NearbyEmergencySearch from '../components/NearbyEmergencySearch.jsx'
import '../styles/Hospitals.css'

function Hospitals() {
  const [location, setLocation] = useState('')
  const [service, setService] = useState('')
  const [searched, setSearched] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState(null)
  const [message, setMessage] = useState('')

  const services = [
    'ICU',
    'Trauma Care',
    'Cardiology',
    'Oncology',
    'Neurology',
    'Pediatrics',
    'Orthopedics',
    'Maternity',
    'Nephrology'
  ]

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesLocation =
      !location ||
      hospital.location
        .toLowerCase()
        .includes(location.toLowerCase())

    const matchesService =
      !service ||
      hospital.services.includes(service)

    return matchesLocation && matchesService
  })

  const emergencyHospitals = hospitals.filter((hospital) =>
    hospital.services.includes('Trauma Care')
  )

  function handleSearch(e) {
    e.preventDefault()
    setSearched(true)
  }

  function handleContact(hospital) {
    setMessage(`Hospital contact: ${hospital.contact}`)
  }

  return (
    <main className="hospitals-page">

      <div className="container">

        {/* PAGE HEADER */}

        <section className="hospitals-header">

          <span className="section-kicker">
            HOSPITAL SUPPORT
          </span>

          <h1>Find Hospitals</h1>

          <p>
            Find hospitals near you and explore the
            services they provide.
          </p>

        </section>


        {/* EMERGENCY NOTICE */}

        <div className="hospital-emergency-notice">

          <ShieldCheck size={20} />

          <div>
            <strong>Need emergency care?</strong>

            <p>
              For life-threatening emergencies, contact
              your local emergency service immediately.
            </p>
          </div>

        </div>


        {/* SEARCH */}

        <section className="hospital-search-card">

          <div className="hospital-section-heading">

            <div>

              <h2>Find a hospital</h2>

              <p>
                Search hospitals by location and available
                service.
              </p>

            </div>

          </div>


          <form
            className="hospital-search-form"
            onSubmit={handleSearch}
          >

            {/* LOCATION */}

            <div className="hospital-field">

              <label htmlFor="hospitalLocation">
                Location
              </label>

              <div className="hospital-input-wrap">

                <MapPin size={17} />

                <input
                  id="hospitalLocation"
                  type="text"
                  placeholder="Enter city or area"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                />

              </div>

            </div>


            {/* SERVICE */}

            <div className="hospital-field">

              <label htmlFor="hospitalService">
                Service
              </label>

              <select
                id="hospitalService"
                value={service}
                onChange={(e) =>
                  setService(e.target.value)
                }
              >

                <option value="">
                  Any service
                </option>

                {services.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>


            {/* SEARCH BUTTON */}

            <button
              type="submit"
              className="btn btn-primary hospital-search-button"
            >
              Search Hospitals
            </button>

          </form>

        </section>


        <NearbyEmergencySearch kind="hospital" />

        {/* HOSPITAL RESULTS */}

        <section className="hospital-results">

          <div className="hospital-results-heading">

            <div>

              <span className="section-kicker">
                AVAILABLE HOSPITALS
              </span>

              <h2>
                {searched
                  ? `${filteredHospitals.length} hospitals found`
                  : 'Hospitals near you'}
              </h2>

            </div>

            {service && (
              <span className="hospital-filter">
                {service}
              </span>
            )}

          </div>


          {filteredHospitals.length > 0 ? (

            <div className="hospital-grid">

              {filteredHospitals.map((hospital) => (

                <article
                  className="hospital-card"
                  key={hospital.id}
                >

                  {/* CARD TOP */}

                  <div className="hospital-card-top">

                    <div className="hospital-icon">
                      <Building2 size={22} />
                    </div>

                    <span className="hospital-status open">
                      <span></span>
                      Available
                    </span>

                  </div>


                  {/* NAME */}

                  <h3>{hospital.name}</h3>


                  {/* RATING */}

                  <div className="hospital-rating">

                    <Star
                      size={15}
                      fill="currentColor"
                    />

                    <strong>4.5</strong>

                    <span>
                      Community rating
                    </span>

                  </div>


                  {/* LOCATION */}

                  <div className="hospital-info">

                    <span>
                      <MapPin size={15} />

                      {hospital.location}
                    </span>

                    <span>
                      <Clock size={15} />

                      {hospital.distance}
                    </span>

                    <span>
                      <BedDouble size={15} />

                      {hospital.bedsAvailable > 0
                        ? `${hospital.bedsAvailable} beds available`
                        : 'No beds currently listed'}
                    </span>

                  </div>


                  {/* SERVICES */}

                  <div className="hospital-services">

                    {hospital.services.map((item) => (
                      <span key={item}>
                        {item}
                      </span>
                    ))}

                  </div>


                  {/* BUTTONS */}

                  <div className="hospital-card-actions">
                    <button
                      className="hospital-details-button"
                      onClick={() => setSelectedHospital(hospital)}
                    >
                      View Details
                    </button>
                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="hospital-empty">

              <Building2 size={32} />

              <h3>No hospitals found</h3>

              <p>
                Try another location or service.
              </p>

            </div>

          )}

        </section>


        
      </div>


      {/* HOSPITAL DETAILS MODAL */}

      {selectedHospital && (

        <div
          className="hospital-modal-overlay"
          onClick={() =>
            setSelectedHospital(null)
          }
        >

          <div
            className="hospital-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="hospital-modal-header">

              <div>

                <span className="section-kicker">
                  HOSPITAL DETAILS
                </span>

                <h2>
                  {selectedHospital.name}
                </h2>

              </div>

              <button
                className="hospital-modal-close"
                onClick={() =>
                  setSelectedHospital(null)
                }
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>


            <div className="hospital-modal-rating">

              <Star
                size={17}
                fill="currentColor"
              />

              <strong>4.5</strong>

              <span>
                Community rating
              </span>

            </div>


            <div className="hospital-modal-info">

              <div>

                <MapPin size={17} />

                <span>
                  {selectedHospital.location}
                </span>

              </div>

              <div>

                <Phone size={17} />

                <span>
                  {selectedHospital.contact}
                </span>

              </div>

              <div>

                <Clock size={17} />

                <span>
                  {selectedHospital.distance}
                  {' '}away
                </span>

              </div>

              <div>

                <BedDouble size={17} />

                <span>
                  {selectedHospital.bedsAvailable > 0
                    ? `${selectedHospital.bedsAvailable} beds currently listed`
                    : 'No beds currently listed'}
                </span>

              </div>

            </div>


            <div className="hospital-modal-services">

              <h3>
                Available Services
              </h3>

              <div>

                {selectedHospital.services.map(
                  (item) => (
                    <span key={item}>
                      ✓ {item}
                    </span>
                  )
                )}

              </div>

            </div>


            <button
              className="btn btn-primary hospital-contact-button"
              onClick={() =>
                handleContact(selectedHospital)
              }
            >
              <Phone size={17} />
              Contact Hospital
            </button>

          </div>

        </div>

      )}


      <Notification
        message={message}
        onClose={() =>
          setMessage('')
        }
      />

    </main>
  )
}

export default Hospitals