import { useEffect, useMemo, useState } from 'react'
import AvailabilityForm from './components/AvailabilityForm'
import BookingSummary from './components/BookingSummary'
import DetailsForm from './components/DetailsForm'
import heroImg from './assets/ll-food-hero.png'
import headerLogo from './assets/logos/Asset 14@4x.png'
import footerLogo from './assets/logos/Asset 18@4x.png'
import './App.css'

const parseLocalDate = (value) => {
  if (!value) return new Date()
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

const generateTimes = (dateValue) => {
  const baseDate = parseLocalDate(dateValue)
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 17, 0, 0)
  const end = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 21, 30, 0)
  const slots = []
  while (start <= end) {
    const hours = start.getHours().toString().padStart(2, '0')
    const minutes = start.getMinutes().toString().padStart(2, '0')
    slots.push(`${hours}:${minutes}`)
    start.setMinutes(start.getMinutes() + 15)
  }
  const offset = new Date(dateValue).getDate() % 3
  return slots.slice(offset, slots.length - offset)
}

const todayAsInputValue = () => new Date().toISOString().split('T')[0]

function App() {
  const today = todayAsInputValue()
  const [selectedDate, setSelectedDate] = useState(today)
  const [availableTimes, setAvailableTimes] = useState(() => generateTimes(today))
  const [step, setStep] = useState('availability')
  const [bookings, setBookings] = useState([])
  const [reservation, setReservation] = useState(() => ({
    date: today,
    time: generateTimes(today)[0] ?? '',
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
    setSelectedDate(nextDate)
    const slots = generateTimes(nextDate)
    setAvailableTimes(slots)
    setReservation((prev) => ({ ...prev, date: nextDate, time: slots[0] ?? '' }))
  }

  const handleAvailabilitySubmit = ({ date, time, guests }) => {
    setReservation((prev) => ({ ...prev, date, time, guests }))
    setStep('details')
  }

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
    const slots = generateTimes(today)
    setSelectedDate(today)
    setAvailableTimes(slots)
    setReservation({
      date: today,
      time: slots[0] ?? '',
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
          <nav aria-label="Primary">
            <a href="#booking">Home</a>
            <a href="#menu">Menu</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
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
