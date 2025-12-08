import { useEffect, useMemo, useState } from 'react'

const validate = (form) => {
  const errors = {}
  if (!form.date) {
    errors.date = 'Choose a date to continue.'
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

  if (!form.guests) {
    errors.guests = 'Select your party size.'
  }

  return errors
}

function AvailabilityForm({ availableTimes, defaultDate, initialTime, initialGuests, onDateChange, onSubmit }) {
  const [form, setForm] = useState({
    date: defaultDate,
    time: initialTime ?? availableTimes[0] ?? '',
    guests: initialGuests ?? 2,
  })
  const [errors, setErrors] = useState({})

  const dateInputMin = useMemo(() => new Date().toISOString().split('T')[0], [])

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      date: defaultDate || prev.date,
      guests: initialGuests ?? prev.guests,
      time:
        (initialTime && availableTimes.includes(initialTime) && initialTime) ||
        prev.time ||
        availableTimes[0] ||
        '',
    }))
  }, [defaultDate, initialGuests, initialTime, availableTimes])

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'date') {
      onDateChange(value)
    }
    setForm((prev) => ({
      ...prev,
      [name]: name === 'guests' ? Number(value) : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit(form)
  }

  const describe = (field) => (errors[field] ? `${field}-error` : undefined)

  const guestOptions = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="date">Select date *</label>
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

      <div className="field">
        <label htmlFor="time">Select time *</label>
        <select
          id="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          aria-invalid={Boolean(errors.time)}
          aria-describedby={describe('time')}
          required
        >
          <option value="">Choose a time</option>
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

      <div className="field">
        <label htmlFor="guests">Number of diners *</label>
        <select
          id="guests"
          name="guests"
          value={form.guests}
          onChange={handleChange}
          aria-invalid={Boolean(errors.guests)}
          aria-describedby={describe('guests')}
          required
        >
          <option value="">Select guests</option>
          {guestOptions.map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'guest' : 'guests'}
            </option>
          ))}
        </select>
        {errors.guests ? (
          <p className="error" id="guests-error" role="alert">
            {errors.guests}
          </p>
        ) : null}
      </div>

      <div className="form-footer">
        <div className="status" aria-live="polite" />
        <button className="pill" type="submit">
          Check availability
        </button>
      </div>
    </form>
  )
}

export default AvailabilityForm
