import { useState } from 'react'
import {
  Ambulance as AmbulanceIcon,
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  X
} from 'lucide-react'

import ambulances from '../data/ambulances.js'
import Notification from '../components/Notification.jsx'
import NearbyEmergencySearch from '../components/NearbyEmergencySearch.jsx'
import '../styles/Ambulance.css'

function Ambulance() {
  const [location, setLocation] = useState('')
  const [searched, setSearched] = useState(false)
  const [selectedAmbulance, setSelectedAmbulance] = useState(null)
  const [message, setMessage] = useState('')

  const filteredAmbulances = ambulances.filter((ambulance) => {
    return (
      !location ||
      ambulance.location
        .toLowerCase()
        .includes(location.toLowerCase())
    )
  })

  function handleSearch(e) {
    e.preventDefault()
    setSearched(true)
  }

  function handleContact(ambulance) {
    setMessage(`Ambulance contact: ${ambulance.contact}`)
  }

  return (
    <main className="ambulance-page">

      <div className="container">

        {/* PAGE HEADER */}

        <section className="ambulance-header">

          <span className="section-kicker">
            EMERGENCY TRANSPORT
          </span>

          <h1>Find an Ambulance</h1>

          <p>
            Find nearby ambulance services and check
            available emergency transport options.
          </p>

        </section>


        {/* EMERGENCY NOTICE */}

        <div className="ambulance-emergency-notice">

          <ShieldCheck size={20} />

          <div>

            <strong>Need an ambulance immediately?</strong>

            <p>
              For life-threatening emergencies, contact
              your local emergency service immediately.
            </p>

          </div>

        </div>


        {/* SEARCH */}

        <section className="ambulance-search-card">

          <div className="ambulance-section-heading">

            <h2>Find an ambulance</h2>

            <p>
              Enter your location to find nearby
              ambulance services.
            </p>

          </div>


          <form
            className="ambulance-search-form"
            onSubmit={handleSearch}
          >

            <div className="ambulance-field">

              <label htmlFor="ambulanceLocation">
                Location
              </label>

              <div className="ambulance-input-wrap">

                <MapPin size={17} />

                <input
                  id="ambulanceLocation"
                  type="text"
                  placeholder="Enter city or area"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                />

              </div>

            </div>


            <button
              type="submit"
              className="btn btn-primary ambulance-search-button"
            >
              Search Ambulances
            </button>

          </form>

        </section>


        {/* RESULTS */}

        <NearbyEmergencySearch kind="ambulance" />

        <section className="ambulance-results">

          <div className="ambulance-results-heading">

            <div>

              <span className="section-kicker">
                AVAILABLE AMBULANCES
              </span>

              <h2>
                {searched
                  ? `${filteredAmbulances.length} ambulances found`
                  : 'Ambulances near you'}
              </h2>

            </div>

          </div>


          {filteredAmbulances.length > 0 ? (

            <div className="ambulance-grid">

              {filteredAmbulances.map((ambulance) => (

                <article
                  className="ambulance-card"
                  key={ambulance.id}
                >

                  {/* CARD TOP */}

                  <div className="ambulance-card-top">

                    <div className="ambulance-icon">
                      <AmbulanceIcon size={22} />
                    </div>

                    <span className="ambulance-status">
                      <span></span>
                      Available
                    </span>

                  </div>


                  {/* NAME */}

                  <h3>
                    {ambulance.name}
                  </h3>


                  {/* TYPE */}

                  <div className="ambulance-type">

                    <strong>
                      {ambulance.type}
                    </strong>

                  </div>


                  {/* INFORMATION */}

                  <div className="ambulance-info">

                    <span>

                      <MapPin size={15} />

                      {ambulance.location}

                    </span>

                    <span>

                      <Clock size={15} />

                      {ambulance.distance}

                    </span>

                  </div>


                  {/* VIEW DETAILS */}

                  <div className="ambulance-card-actions">

                    <button
                      className="ambulance-details-button"
                      onClick={() =>
                        setSelectedAmbulance(ambulance)
                      }
                    >
                      View Details
                    </button>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="ambulance-empty">

              <AmbulanceIcon size={32} />

              <h3>
                No ambulances found
              </h3>

              <p>
                Try another location.
              </p>

            </div>

          )}

        </section>

      </div>


      {/* DETAILS MODAL */}

      {selectedAmbulance && (

        <div
          className="ambulance-modal-overlay"
          onClick={() =>
            setSelectedAmbulance(null)
          }
        >

          <div
            className="ambulance-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="ambulance-modal-header">

              <div>

                <span className="section-kicker">
                  AMBULANCE DETAILS
                </span>

                <h2>
                  {selectedAmbulance.name}
                </h2>

              </div>

              <button
                className="ambulance-modal-close"
                onClick={() =>
                  setSelectedAmbulance(null)
                }
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>


            <div className="ambulance-modal-info">

              <div>

                <AmbulanceIcon size={17} />

                <span>
                  {selectedAmbulance.type}
                </span>

              </div>


              <div>

                <MapPin size={17} />

                <span>
                  {selectedAmbulance.location}
                </span>

              </div>


              <div>

                <Clock size={17} />

                <span>
                  {selectedAmbulance.distance} away
                </span>

              </div>


              <div>

                <ShieldCheck size={17} />

                <span>
                  {selectedAmbulance.availability}
                </span>

              </div>


              <div>

                <Phone size={17} />

                <span>
                  {selectedAmbulance.contact}
                </span>

              </div>

            </div>


            {/* CONTACT */}

            <button
              className="ambulance-contact-button"
              onClick={() =>
                handleContact(selectedAmbulance)
              }
            >
              <Phone size={17} />
              Contact Ambulance Service
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

export default Ambulance