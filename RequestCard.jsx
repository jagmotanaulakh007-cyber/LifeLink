import { Clock, Droplet } from 'lucide-react'
import '../styles/Cards.css'

function RequestCard({ request }) {
  return (
    <div className="card entity-card">
      <div className="entity-card-top">
        <div>
          <div className="entity-card-title">{request.patientName || 'Emergency request'}</div>
          <div className="entity-card-sub">
            {request.type === 'blood'
              ? `Blood group ${request.bloodGroup}`
              : `Ambulance to ${request.hospital || 'requested location'}`}
          </div>
        </div>
        <span className="badge badge-urgent">{request.status}</span>
      </div>

      {request.type === 'blood' && request.units && (
        <div className="entity-card-row">
          <Droplet size={15} color="#dc2626" strokeWidth={1.5} />
          {request.units} unit{Number(request.units) === 1 ? '' : 's'} required
        </div>
      )}

      {request.hospital && (
        <div className="entity-card-row">Hospital: {request.hospital}</div>
      )}

      <div className="entity-card-row">
        <Clock size={15} color="#8B93A7" strokeWidth={1.5} />
        {request.createdAt || request.submittedAt || 'Recently created'}
        {request.submittedAt && request.createdAt ? ` · ${request.submittedAt}` : ''}
      </div>
    </div>
  )
}

export default RequestCard
