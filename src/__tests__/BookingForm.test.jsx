import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AvailabilityForm from '../components/AvailabilityForm'
import DetailsForm from '../components/DetailsForm'

const futureDate = () => {
  const date = new Date()
  date.setDate(date.getDate() + 2)
  return date.toISOString().split('T')[0]
}

describe('AvailabilityForm', () => {
  it('shows validation errors when required fields are missing', async () => {
    render(
      <AvailabilityForm
        availableTimes={[]}
        defaultDate=""
        onDateChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /check availability/i }))

    expect(screen.getByText(/choose a date/i)).toBeInTheDocument()
    expect(screen.getByText(/select a seating time/i)).toBeInTheDocument()
  })

  it('submits the form when inputs are valid', async () => {
    const onSubmit = vi.fn()
    const nextDate = futureDate()
    render(
      <AvailabilityForm
        availableTimes={['17:00', '17:15']}
        defaultDate={nextDate}
        onDateChange={vi.fn()}
        onSubmit={onSubmit}
      />
    )

    fireEvent.change(screen.getByLabelText(/select time/i), { target: { value: '17:15' } })
    fireEvent.change(screen.getByLabelText(/number of diners/i), { target: { value: 4 } })
    await userEvent.click(screen.getByRole('button', { name: /check availability/i }))

    expect(onSubmit).toHaveBeenCalledWith({ date: nextDate, time: '17:15', guests: 4 })
  })
})

describe('DetailsForm', () => {
  it('shows validation errors when required fields are missing', async () => {
    render(
      <DetailsForm summary={{ date: futureDate(), time: '17:00', guests: 2 }} onBack={() => {}} onSubmit={vi.fn()} />
    )

    await userEvent.click(screen.getByRole('button', { name: /confirm reservation/i }))

    expect(screen.getByText(/enter the name/i)).toBeInTheDocument()
    expect(screen.getByText(/add a valid email/i)).toBeInTheDocument()
  })

  it('submits when inputs are valid', async () => {
    const onSubmit = vi.fn()
    render(
      <DetailsForm
        summary={{ date: futureDate(), time: '18:00', guests: 3 }}
        onBack={() => {}}
        onSubmit={onSubmit}
      />
    )

    await userEvent.type(screen.getByLabelText(/name/i), 'Jamie Doe')
    await userEvent.type(screen.getByLabelText(/email address/i), 'jamie@example.com')
    await userEvent.type(screen.getByLabelText(/mobile number/i), '3125550101')
    await userEvent.type(screen.getByLabelText(/special requests/i), 'Window seat please')
    await userEvent.click(screen.getByRole('radio', { name: /business/i }))

    await userEvent.click(screen.getByRole('button', { name: /confirm reservation/i }))

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: 'Jamie Doe',
        email: 'jamie@example.com',
        phone: '3125550101',
        occasion: 'Business',
        requests: 'Window seat please',
      })
    )
  })
})
