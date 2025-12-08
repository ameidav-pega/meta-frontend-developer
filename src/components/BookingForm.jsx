import { useEffect, useMemo, useState } from 'react'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[\d\s+().-]{7,}$/

const buildInitialForm = (defaultDate, availableTimes) => ({
  fullName: '',
  email: '',
  phone: '',
  date: defaultDate,
  time: availableTimes[0] ?? '',
  guests: 2,
  occasion: 'Birthday',
  seating: 'Indoor',
  requests: '',
})

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

  if (!form.date) {
    errors.date = 'Choose a date.'
  } else {
    const today = new Date()
    const selected = new Date(form.date)
    today.setHours(0, 0, 0, 0)
    selected.setHours(0, 0, 0, 0)
    if (selected < today) {
      errors.date = 'Date must be today or later.'
    }
  }

  if (!form.time) {
    errors.time = 'Select a seating time.'
  }

  if (form.guests < 1 || form.guests > 8) {
    errors.guests = 'Party size should be between 1 and 8 guests.'
  }

  return errors
}

function BookingForm({ availableTimes, defaultDate, onDateChange, onSubmit }) {
  const [form, setForm] = useState(() => buildInitialForm(defaultDate, availableTimes))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  const dateInputMin = useMemo(() => new Date().toISOString().split('T')[0], [])

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      date: defaultDate,
      time: availableTimes[0] ?? '',
    }))
  }, [availableTimes, defaultDate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: name === 'guests' ? Number(value) : value }))

    if (name === 'date') {
      onDateChange(value)
    }
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
    setForm(buildInitialForm(form.date, availableTimes))
  }

  const describe = (field) => (errors[field] ? `${field}-error` : undefined)

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="fullName">Full name</label>
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

      <div className="field two-column">
        <div>
          <label htmlFor="email">Email address</label>
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

        <div>
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
      </div>

      <div className="field two-column">
        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            name="date"
            type="date"
            min={dateInputMin}
            value={form.date}
            onChange={handleChange}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={describe('date')}
            required
          />
          {errors.date ? (
            <p className="error" id="date-error" role="alert">
              {errors.date}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="time">Time</label>
          <select
            id="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            aria-invalid={Boolean(errors.time)}
            aria-describedby={describe('time')}
            required
          >
            <option value="">Select a time</option>
            {availableTimes.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.time ? (
            <p className="error" id="time-error" role="alert">
              {errors.time}
            </p>
          ) : null}
        </div>
      </div>

      <div className="field two-column">
        <div>
          <label htmlFor="guests">Party size</label>
          <input
            id="guests"
            name="guests"
            type="number"
            min={1}
            max={8}
            value={form.guests}
            onChange={handleChange}
            aria-invalid={Boolean(errors.guests)}
            aria-describedby={describe('guests')}
            required
          />
          {errors.guests ? (
            <p className="error" id="guests-error" role="alert">
              {errors.guests}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="occasion">Occasion</label>
          <select id="occasion" name="occasion" value={form.occasion} onChange={handleChange}>
            <option>Birthday</option>
            <option>Anniversary</option>
            <option>Business</option>
            <option>Casual night</option>
          </select>
        </div>
      </div>

      <fieldset className="field">
        <legend>Seating preference</legend>
        <div className="choice-group">
          {['Indoor', 'Courtyard', 'Chef counter'].map((option) => (
            <label key={option} className="choice">
              <input
                type="radio"
                name="seating"
                value={option}
                checked={form.seating === option}
                onChange={handleChange}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="field">
        <label htmlFor="requests">Requests</label>
        <textarea
          id="requests"
          name="requests"
          rows="3"
          placeholder="Allergies, highchair, or timing notes"
          value={form.requests}
          onChange={handleChange}
        />
      </div>

      <div className="form-footer">
        <div className="status" role="status" aria-live="polite">
          {status}
        </div>
        <button className="pill" type="submit">
          Confirm reservation
        </button>
      </div>
    </form>
  )
}

export default BookingForm
