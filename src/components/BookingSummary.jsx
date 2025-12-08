import PropTypes from 'prop-types'
import { formatLongDate } from '../utils/date'

function BookingSummary({ bookings }) {
  if (!bookings.length) {
    return <p className="empty">No bookings yet. Submit the form to see them here.</p>
  }

  return (
    <div className="booking-summary" aria-label="Reservation details">
      {bookings.map((item) => (
        <article key={item.id} className="summary-card">
          <div className="summary-row">
            <div>
              <p className="summary-label">Reservation Details</p>
              <ul>
                <li>📅 {formatLongDate(item.date)}</li>
                <li>⏰ {item.time}</li>
                <li>👥 {item.guests} {item.guests === 1 ? 'Guest' : 'Guests'}</li>
              </ul>
            </div>
            {item.confirmation ? (
              <div className="confirmation-pill" aria-label="Confirmation number">
                #{item.confirmation}
              </div>
            ) : null}
          </div>
          <div className="summary-details">
            <p>
              <strong>Name:</strong> {item.fullName}
            </p>
            <p>
              <strong>Email:</strong> {item.email}
            </p>
            {item.phone ? (
              <p>
                <strong>Phone:</strong> {item.phone}
              </p>
            ) : null}
            <p>
              <strong>Special occasion:</strong> {item.occasion}
            </p>
            {item.requests ? (
              <p>
                <strong>Requests:</strong> {item.requests}
              </p>
            ) : null}
            <p>
              <strong>Seating:</strong> {item.seating}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}

BookingSummary.propTypes = {
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string,
      date: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      guests: PropTypes.number.isRequired,
      occasion: PropTypes.string.isRequired,
      seating: PropTypes.string.isRequired,
      requests: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
      confirmation: PropTypes.string,
    })
  ).isRequired,
}

export default BookingSummary
