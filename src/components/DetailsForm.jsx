import { useEffect, useMemo, useState } from 'react'
import { formatLongDate } from '../utils/date'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[\d\s+().-]{7,}$/

const validate = (form) => {
  const errors = {}

  if (!form.fullName.trim()) {
    errors.fullName = 'Please enter the name for this reservation.'
  }

  if (!form.email.trim() || !emailPattern.test(form.email)) {
    errors.email = 'Add a valid email so we can send your confirmation.'
  }

  if (form.phone && !phonePattern.test(form.phone)) {
    errors.phone = 'Use digits and common characters like +, -, or parentheses.'
  }

  return errors
}

const occasions = [
  { label: 'Birthday', icon: '✨' },
  { label: 'Business', icon: '💼' },
  { label: 'Anniversary', icon: '❤️' },
  { label: 'Casual', icon: '👥' },
]

function DetailsForm({ summary, initialDetails = {}, onBack, onSubmit }) {
  const [form, setForm] = useState({
    fullName: initialDetails.fullName ?? '',
    email: initialDetails.email ?? '',
    phone: initialDetails.phone ?? '',
    occasion: initialDetails.occasion ?? 'Birthday',
    requests: initialDetails.requests ?? '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      fullName: initialDetails.fullName ?? prev.fullName ?? '',
      email: initialDetails.email ?? prev.email ?? '',
      phone: initialDetails.phone ?? prev.phone ?? '',
      occasion: initialDetails.occasion ?? prev.occasion ?? 'Birthday',
      requests: initialDetails.requests ?? prev.requests ?? '',
    }))
  }, [initialDetails])

  const formattedDate = useMemo(() => formatLongDate(summary.date), [summary.date])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('')
      return
    }
    onSubmit(form)
    setStatus('Reservation confirmed! Check your email for details.')
  }

  const describe = (field) => (errors[field] ? `${field}-error` : undefined)

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <div className="summary-card inline-card" aria-label="Reservation summary">
        <p className="summary-label">Reservation Summary</p>
        <ul>
          <li>📅 {formattedDate}</li>
          <li>⏰ {summary.time}</li>
          <li>
            👥 {summary.guests} {summary.guests === 1 ? 'Guest' : 'Guests'}
          </li>
        </ul>
      </div>

      <div className="field two-column">
        <div>
          <label htmlFor="fullName">Name *</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={describe('fullName')}
            required
          />
          {errors.fullName ? (
            <p className="error" id="fullName-error" role="alert">
              {errors.fullName}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="email">Email address *</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describe('email')}
            required
          />
          {errors.email ? (
            <p className="error" id="email-error" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="field">
        <label htmlFor="phone">Mobile number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 (312) 555-0101"
          value={form.phone}
          onChange={handleChange}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={describe('phone')}
        />
        {errors.phone ? (
          <p className="error" id="phone-error" role="alert">
            {errors.phone}
          </p>
        ) : null}
      </div>

      <fieldset className="field">
        <legend>Special occasion</legend>
        <div className="occasion-grid">
          {occasions.map((option) => (
            <label
              key={option.label}
              className={`occasion ${form.occasion === option.label ? 'is-active' : ''}`}
            >
              <input
                type="radio"
                name="occasion"
                value={option.label}
                checked={form.occasion === option.label}
                onChange={handleChange}
              />
              <span role="img" aria-label={option.label}>
                {option.icon}
              </span>
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="requests">Special requests</label>
        <textarea
          id="requests"
          name="requests"
          rows="3"
          placeholder="Dietary restrictions, accessibility needs, seating preferences, etc."
          value={form.requests}
          onChange={handleChange}
        />
      </div>

      <div className="form-footer">
        <div className="status" role="status" aria-live="polite">
          {status}
        </div>
        <div className="cta-row">
          <button className="ghost" type="button" onClick={onBack}>
            Back
          </button>
          <button className="pill" type="submit">
            Confirm reservation
          </button>
        </div>
      </div>
    </form>
  )
}

export default DetailsForm
