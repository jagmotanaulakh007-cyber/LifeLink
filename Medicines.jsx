import { useState } from 'react'
import {
  Pill,
  MapPin,
  Clock,
  Package,
  Phone,
  X
} from 'lucide-react'

import medicines from '../data/medicines.js'
import Notification from '../components/Notification.jsx'
import '../styles/Medicines.css'

function Medicines() {
  const [medicineName, setMedicineName] = useState('')
  const [location, setLocation] = useState('')
  const [searched, setSearched] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [message, setMessage] = useState('')

  const filteredMedicines = medicines.filter((medicine) => {
    const matchesMedicine =
      !medicineName ||
      medicine.name
        .toLowerCase()
        .includes(medicineName.toLowerCase())

    const matchesLocation =
      !location ||
      medicine.location
        .toLowerCase()
        .includes(location.toLowerCase())

    return matchesMedicine && matchesLocation
  })

  function handleSearch(e) {
    e.preventDefault()
    setSearched(true)
  }

  function handleContact(medicine) {
    setMessage(`Pharmacy contact: ${medicine.contact}`)
  }

  return (
    <main className="medicines-page">

      <div className="container">

        {/* PAGE HEADER */}

        <section className="medicines-header">

          <span className="section-kicker">
            MEDICINE SUPPORT
          </span>

          <h1>Find Medicines</h1>

          <p>
            Search for medicines and find nearby pharmacies
            where they are available.
          </p>

        </section>


        {/* EMERGENCY NOTICE */}

        <div className="medicine-emergency-notice">

          <Pill size={20} />

          <div>

            <strong>Need medicine urgently?</strong>

            <p>
              Search for the medicine and check nearby
              pharmacy availability before visiting.
            </p>

          </div>

        </div>


        {/* SEARCH */}

        <section className="medicine-search-card">

          <div className="medicine-section-heading">

            <h2>Search for a medicine</h2>

            <p>
              Enter a medicine name and location to find
              nearby pharmacies.
            </p>

          </div>


          <form
            className="medicine-search-form"
            onSubmit={handleSearch}
          >

            {/* MEDICINE */}

            <div className="medicine-field">

              <label htmlFor="medicineName">
                Medicine
              </label>

              <div className="medicine-input-wrap">

                <Pill size={17} />

                <input
                  id="medicineName"
                  type="text"
                  placeholder="Enter medicine name"
                  value={medicineName}
                  onChange={(e) =>
                    setMedicineName(e.target.value)
                  }
                />

              </div>

            </div>


            {/* LOCATION */}

            <div className="medicine-field">

              <label htmlFor="medicineLocation">
                Location
              </label>

              <div className="medicine-input-wrap">

                <MapPin size={17} />

                <input
                  id="medicineLocation"
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
              className="btn btn-primary medicine-search-button"
            >
              Search Medicines
            </button>

          </form>

        </section>


        {/* RESULTS */}

        <section className="medicine-results">

          <div className="medicine-results-heading">

            <div>

              <span className="section-kicker">
                AVAILABLE MEDICINES
              </span>

              <h2>
                {searched
                  ? `${filteredMedicines.length} results found`
                  : 'Medicines near you'}
              </h2>

            </div>

          </div>


          {filteredMedicines.length > 0 ? (

            <div className="medicine-grid">

              {filteredMedicines.map((medicine) => (

                <article
                  className="medicine-card"
                  key={medicine.id}
                >

                  {/* CARD TOP */}

                  <div className="medicine-card-top">

                    <div className="medicine-icon">
                      <Pill size={22} />
                    </div>

                    <span
                      className={
                        medicine.availability === 'Available'
                          ? 'medicine-status available'
                          : 'medicine-status unavailable'
                      }
                    >
                      <span></span>
                      {medicine.availability}
                    </span>

                  </div>


                  {/* MEDICINE NAME */}

                  <h3>{medicine.name}</h3>


                  {/* PHARMACY */}

                  <div className="medicine-pharmacy">

                    <strong>
                      {medicine.pharmacy}
                    </strong>

                  </div>


                  {/* INFORMATION */}

                  <div className="medicine-info">

                    <span>
                      <MapPin size={15} />
                      {medicine.location}
                    </span>

                    <span>
                      <Clock size={15} />
                      {medicine.distance}
                    </span>

                    <span>
                      <Package size={15} />
                      {medicine.quantity > 0
                        ? `${medicine.quantity} units available`
                        : 'Currently unavailable'}
                    </span>

                  </div>


                  {/* VIEW DETAILS ONLY */}

                  <div className="medicine-card-actions">

                    <button
                      className="medicine-details-button"
                      onClick={() =>
                        setSelectedMedicine(medicine)
                      }
                    >
                      View Details
                    </button>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="medicine-empty">

              <Pill size={32} />

              <h3>
                No medicines found
              </h3>

              <p>
                Try another medicine name or location.
              </p>

            </div>

          )}

        </section>

      </div>


      {/* DETAILS MODAL */}

      {selectedMedicine && (

        <div
          className="medicine-modal-overlay"
          onClick={() =>
            setSelectedMedicine(null)
          }
        >

          <div
            className="medicine-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="medicine-modal-header">

              <div>

                <span className="section-kicker">
                  MEDICINE DETAILS
                </span>

                <h2>
                  {selectedMedicine.name}
                </h2>

              </div>

              <button
                className="medicine-modal-close"
                onClick={() =>
                  setSelectedMedicine(null)
                }
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>


            <div className="medicine-modal-info">

              <div>
                <Pill size={17} />

                <span>
                  {selectedMedicine.name}
                </span>
              </div>


              <div>
                <Package size={17} />

                <span>
                  {selectedMedicine.quantity > 0
                    ? `${selectedMedicine.quantity} units available`
                    : 'Currently unavailable'}
                </span>
              </div>


              <div>
                <MapPin size={17} />

                <span>
                  {selectedMedicine.location}
                </span>
              </div>


              <div>
                <Clock size={17} />

                <span>
                  {selectedMedicine.distance} away
                </span>
              </div>


              <div>
                <Phone size={17} />

                <span>
                  {selectedMedicine.contact}
                </span>
              </div>

            </div>


            {/* PHARMACY */}

            <div className="medicine-pharmacy-details">

              <h3>Pharmacy</h3>

              <p>
                {selectedMedicine.pharmacy}
              </p>

            </div>


            {/* CONTACT ONLY INSIDE MODAL */}

            <button
              className="medicine-contact-button medicine-modal-contact"
              onClick={() =>
                handleContact(selectedMedicine)
              }
            >
              <Phone size={17} />
              Contact Pharmacy
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

export default Medicines