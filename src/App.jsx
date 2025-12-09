import { useEffect, useMemo, useState } from 'react'
import AvailabilityForm from './components/AvailabilityForm'
import BookingSummary from './components/BookingSummary'
import DetailsForm from './components/DetailsForm'
import heroImg from './assets/ll-food-hero.png'
import headerLogo from './assets/logos/Asset 14@4x.png'
import footerLogo from './assets/logos/Asset 18@4x.png'
import './App.css'

const toInputDate = (date) => date.toISOString().split('T')[0]

const OPEN_HOUR = 11
const OPEN_MINUTE = 0
const CLOSE_HOUR = 21
const CLOSE_MINUTE = 30
const SLOT_MINUTES = 30

const generateTimes = (dateValue) => {
  if (!dateValue) return []
  const [year, month, day] = dateValue.split('-').map(Number)
  const start = new Date(year, (month || 1) - 1, day || 1, OPEN_HOUR, OPEN_MINUTE, 0)
  const end = new Date(year, (month || 1) - 1, day || 1, CLOSE_HOUR, CLOSE_MINUTE, 0)
  const slots = []
  const cursor = new Date(start)
  while (cursor <= end) {
    const hours = cursor.getHours().toString().padStart(2, '0')
    const minutes = cursor.getMinutes().toString().padStart(2, '0')
    slots.push(`${hours}:${minutes}`)
    cursor.setMinutes(cursor.getMinutes() + SLOT_MINUTES)
  }
  return slots
}

const computeDefaultDateTime = () => {
  const now = new Date()
  const target = new Date(now.getTime() + 2 * 60 * 60 * 1000)

  const buildSlot = (date) => ({
    openStart: new Date(date.getFullYear(), date.getMonth(), date.getDate(), OPEN_HOUR, OPEN_MINUTE, 0),
    lastSlot: new Date(date.getFullYear(), date.getMonth(), date.getDate(), CLOSE_HOUR, CLOSE_MINUTE, 0),
  })

  const todaySlots = buildSlot(target)

  if (target < todaySlots.openStart) {
    return { date: toInputDate(target), time: '11:00' }
  }

  const timesForDay = generateTimes(toInputDate(target))
  if (target <= todaySlots.lastSlot) {
    const candidateTime = `${target.getHours().toString().padStart(2, '0')}:${target
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
    const nextSlot = timesForDay.find((slot) => slot >= candidateTime) ?? timesForDay[0]
    return { date: toInputDate(target), time: nextSlot }
  }

  const nextDay = new Date(target)
  nextDay.setDate(nextDay.getDate() + 1)
  const nextDaySlots = generateTimes(toInputDate(nextDay))
  return { date: toInputDate(nextDay), time: nextDaySlots[0] ?? '' }
}

function App() {
  const defaultDateTime = computeDefaultDateTime()
  const [selectedDate, setSelectedDate] = useState(defaultDateTime.date)
  const [availableTimes, setAvailableTimes] = useState(() => generateTimes(defaultDateTime.date))
  const [step, setStep] = useState('availability')
  const [bookings, setBookings] = useState([])
  const [navOpen, setNavOpen] = useState(false)
  const [reservation, setReservation] = useState(() => ({
    date: defaultDateTime.date,
    time: defaultDateTime.time,
    guests: 2,
    fullName: '',
    email: '',
    phone: '',
    occasion: 'Birthday',
    requests: '',
  }))

  useEffect(() => {
    setReservation((prev) => {
      if (prev.time && availableTimes.includes(prev.time)) {
        return prev
      }
      return {
        ...prev,
        time: availableTimes[0] ?? '',
      }
    })
  }, [availableTimes])

  const handleDateChange = (nextDate) => {
    const slots = generateTimes(nextDate)
    setSelectedDate(nextDate)
    setAvailableTimes(slots)
    setReservation((prev) => ({
      ...prev,
      date: nextDate,
      time: slots.includes(prev.time) ? prev.time : slots[0] ?? '',
    }))
  }

  const handleAvailabilitySubmit = ({ date, time, guests }) => {
    setReservation((prev) => ({ ...prev, date, time, guests }))
    setStep('details')
  }

  const closeNav = () => setNavOpen(false)

  const handleDetailsSubmit = (details) => {
    const completed = {
      ...reservation,
      ...details,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      confirmation: `LL${Math.floor(Math.random() * 900000) + 100000}`,
    }
    setBookings((prev) => [...prev, completed])
    setReservation(completed)
    setStep('confirmed')
  }

  const handleReset = () => {
    const nextDefaults = computeDefaultDateTime()
    const slots = generateTimes(nextDefaults.date)
    setSelectedDate(nextDefaults.date)
    setAvailableTimes(slots)
    setReservation({
      date: nextDefaults.date,
      time: slots.includes(nextDefaults.time) ? nextDefaults.time : slots[0] ?? '',
      guests: 2,
      fullName: '',
      email: '',
      phone: '',
      occasion: 'Birthday',
      requests: '',
    })
    setStep('availability')
  }

  const latestBooking = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0],
    [bookings]
  )

  const renderFormCard = () => {
    if (step === 'availability') {
      return (
        <>
          <div className="panel__header">
            <p className="eyebrow">Book a table</p>
            <h2 id="booking-title">Select your date and time</h2>
            <p className="lede">
              Tell us when you’re visiting and how many guests to check availability instantly.
            </p>
          </div>
          <AvailabilityForm
            availableTimes={availableTimes}
            defaultDate={selectedDate}
            initialTime={reservation.time}
            initialGuests={reservation.guests}
            onDateChange={handleDateChange}
            onSubmit={handleAvailabilitySubmit}
          />
          <p className="required-note" aria-live="polite">
            *All fields are required
          </p>
        </>
      )
    }

    if (step === 'details') {
      return (
        <>
          <div className="panel__header">
            <p className="eyebrow">Your details</p>
            <h2 id="booking-title">Confirm your reservation</h2>
            <p className="lede">Provide your contact info and any special requests.</p>
          </div>
          <DetailsForm
            summary={{ date: reservation.date, time: reservation.time, guests: reservation.guests }}
            initialDetails={{
              fullName: reservation.fullName,
              email: reservation.email,
              phone: reservation.phone,
              occasion: reservation.occasion,
              requests: reservation.requests,
            }}
            onBack={() => setStep('availability')}
            onSubmit={handleDetailsSubmit}
          />
        </>
      )
    }

    return (
      <>
        <div className="confirmation__icon" role="img" aria-label="Reservation confirmed">
          ✓
        </div>
        <div className="panel__header">
          <p className="eyebrow">Reservation confirmed</p>
          <h2 id="booking-title">You’re all set</h2>
          <p className="lede">
            We’ve emailed your confirmation. You can also see the details below.
          </p>
        </div>
        <BookingSummary bookings={[reservation]} />
        <div className="info-box">
          <p className="summary-label">Important information</p>
          <ul>
            <li>Please arrive 10 minutes before your reservation time.</li>
            <li>To modify or cancel, call us at (312) 555-0100.</li>
            <li>We’ll send a reminder 24 hours before your reservation.</li>
          </ul>
        </div>
        <div className="cta-row">
          <button className="ghost" type="button" onClick={handleReset}>
            Make another reservation
          </button>
          <button className="pill" type="button" onClick={() => setStep('details')}>
            Edit details
          </button>
        </div>
      </>
    )
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar__inner">
          <div className="brand">
            <img src={headerLogo} alt="Little Lemon" />
          </div>
          <button
            className="nav-toggle"
            aria-expanded={navOpen}
            aria-controls="primary-nav"
            onClick={() => setNavOpen((open) => !open)}
          >
            <span className="sr-only">Toggle navigation</span>
            <span />
            <span />
            <span />
          </button>
          <nav
            id="primary-nav"
            aria-label="Primary"
            className={navOpen ? 'open' : ''}
            onClick={(e) => e.stopPropagation()}
          >
            <a href="#booking" onClick={closeNav}>
              Home
            </a>
            <a href="#menu" onClick={closeNav}>
              Menu
            </a>
            <a href="#about" onClick={closeNav}>
              About
            </a>
            <a href="#contact" onClick={closeNav}>
              Contact
            </a>
          </nav>
        </div>
        {navOpen ? <div className="nav-backdrop" onClick={closeNav} /> : null}
      </header>

      <main className="shell">
        <div className="card-grid">
          <section className="info-card" aria-labelledby="reserve-title">
            <img className="hero-image" src={heroImg} alt="Signature Little Lemon entrée" />
            <div className="info-copy">
              <h2 id="reserve-title">Reserve Your Table</h2>
              <p>
                Experience authentic Mediterranean cuisine in a warm, inviting atmosphere. Our
                farm-to-table restaurant offers fresh, seasonal dishes crafted with love.
              </p>
              <ul className="info-list" aria-label="Restaurant details">
                <li>
                  <span aria-hidden="true">📍</span> 123 Main Street, Chicago, IL 60601
                </li>
                <li>
                  <span aria-hidden="true">📞</span> (312) 555-0100
                </li>
                <li>
                  <span aria-hidden="true">⏰</span> Open Daily: 11:00 AM – 10:00 PM
                </li>
              </ul>
            </div>
          </section>

          <section className="form-card" id="booking" aria-labelledby="booking-title">
            {renderFormCard()}
          </section>
        </div>

      </main>

      <footer className="footer">
        <div className="footer__inner">
          <div className="brand">
            <img src={footerLogo} alt="Little Lemon logo" />
          </div>
          <p>Fresh Mediterranean dishes crafted with love. © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}

export default App
