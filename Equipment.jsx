import { useState } from 'react'
import {
  Activity,
  MapPin,
  Clock,
  Package,
  Phone,
  X
} from 'lucide-react'

import equipment from '../data/equipment.js'
import Notification from '../components/Notification.jsx'
import '../styles/Equipment.css'

function Equipment() {
  const [equipmentName, setEquipmentName] = useState('')
  const [location, setLocation] = useState('')
  const [searched, setSearched] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [message, setMessage] = useState('')

  const filteredEquipment = equipment.filter((item) => {
    const matchesEquipment =
      !equipmentName ||
      item.name
        .toLowerCase()
        .includes(equipmentName.toLowerCase())

    const matchesLocation =
      !location ||
      item.location
        .toLowerCase()
        .includes(location.toLowerCase())

    return matchesEquipment && matchesLocation
  })

  function handleSearch(e) {
    e.preventDefault()
    setSearched(true)
  }

  function handleContact(item) {
    setMessage(`Provider contact: ${item.contact}`)
  }

  return (
    <main className="equipment-page">

      <div className="container">

        {/* PAGE HEADER */}

        <section className="equipment-header">

          <span className="section-kicker">
            MEDICAL EQUIPMENT SUPPORT
          </span>

          <h1>Find Medical Equipment</h1>

          <p>
            Find essential medical equipment available
            near you.
          </p>

        </section>


        {/* EMERGENCY NOTICE */}

        <div className="equipment-emergency-notice">

          <Activity size={20} />

          <div>

            <strong>Need medical equipment urgently?</strong>

            <p>
              Search for equipment and check nearby
              providers before visiting.
            </p>

          </div>

        </div>


        {/* SEARCH */}

        <section className="equipment-search-card">

          <div className="equipment-section-heading">

            <h2>Find equipment</h2>

            <p>
              Search by equipment name and location.
            </p>

          </div>


          <form
            className="equipment-search-form"
            onSubmit={handleSearch}
          >

            {/* EQUIPMENT */}

            <div className="equipment-field">

              <label htmlFor="equipmentName">
                Equipment
              </label>

              <div className="equipment-input-wrap">

                <Activity size={17} />

                <input
                  id="equipmentName"
                  type="text"
                  placeholder="Enter equipment name"
                  value={equipmentName}
                  onChange={(e) =>
                    setEquipmentName(e.target.value)
                  }
                />

              </div>

            </div>


            {/* LOCATION */}

            <div className="equipment-field">

              <label htmlFor="equipmentLocation">
                Location
              </label>

              <div className="equipment-input-wrap">

                <MapPin size={17} />

                <input
                  id="equipmentLocation"
                  type="text"
                  placeholder="Enter city or area"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                />

              </div>

            </div>


            {/* SEARCH BUTTON */}

            <button
              type="submit"
              className="btn btn-primary equipment-search-button"
            >
              Search Equipment
            </button>

          </form>

        </section>


        {/* RESULTS */}

        <section className="equipment-results">

          <div className="equipment-results-heading">

            <div>

              <span className="section-kicker">
                AVAILABLE EQUIPMENT
              </span>

              <h2>
                {searched
                  ? `${filteredEquipment.length} results found`
                  : 'Equipment near you'}
              </h2>

            </div>

          </div>


          {filteredEquipment.length > 0 ? (

            <div className="equipment-grid">

              {filteredEquipment.map((item) => (

                <article
                  className="equipment-card"
                  key={item.id}
                >

                  {/* CARD TOP */}

                  <div className="equipment-card-top">

                    <div className="equipment-icon">
                      <Activity size={22} />
                    </div>

                    <span className="equipment-status available">
                      <span></span>
                      Available
                    </span>

                  </div>


                  {/* EQUIPMENT NAME */}

                  <h3>{item.name}</h3>


                  {/* PROVIDER */}

                  <div className="equipment-provider">

                    <strong>
                      {item.provider}
                    </strong>

                  </div>


                  {/* INFORMATION */}

                  <div className="equipment-info">

                    <span>
                      <MapPin size={15} />
                      {item.location}
                    </span>

                    <span>
                      <Clock size={15} />
                      {item.distance}
                    </span>

                    <span>
                      <Package size={15} />
                      {item.quantity} units available
                    </span>

                  </div>


                  {/* VIEW DETAILS */}

                  <div className="equipment-card-actions">

                    <button
                      className="equipment-details-button"
                      onClick={() =>
                        setSelectedEquipment(item)
                      }
                    >
                      View Details
                    </button>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="equipment-empty">

              <Activity size={32} />

              <h3>
                No equipment found
              </h3>

              <p>
                Try another equipment name or location.
              </p>

            </div>

          )}

        </section>

      </div>


      {/* DETAILS MODAL */}

      {selectedEquipment && (

        <div
          className="equipment-modal-overlay"
          onClick={() =>
            setSelectedEquipment(null)
          }
        >

          <div
            className="equipment-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="equipment-modal-header">

              <div>

                <span className="section-kicker">
                  EQUIPMENT DETAILS
                </span>

                <h2>
                  {selectedEquipment.name}
                </h2>

              </div>

              <button
                className="equipment-modal-close"
                onClick={() =>
                  setSelectedEquipment(null)
                }
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>


            <div className="equipment-modal-info">

              <div>
                <Activity size={17} />

                <span>
                  {selectedEquipment.name}
                </span>
              </div>


              <div>
                <Package size={17} />

                <span>
                  {selectedEquipment.quantity} units available
                </span>
              </div>


              <div>
                <MapPin size={17} />

                <span>
                  {selectedEquipment.location}
                </span>
              </div>


              <div>
                <Clock size={17} />

                <span>
                  {selectedEquipment.distance} away
                </span>
              </div>


              <div>
                <Phone size={17} />

                <span>
                  {selectedEquipment.contact}
                </span>
              </div>

            </div>


            {/* PROVIDER */}

            <div className="equipment-provider-details">

              <h3>Provider</h3>

              <p>
                {selectedEquipment.provider}
              </p>

            </div>


            {/* CONTACT */}

            <button
              className="equipment-contact-button equipment-modal-contact"
              onClick={() =>
                handleContact(selectedEquipment)
              }
            >
              <Phone size={17} />
              Contact Provider
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

export default Equipment
