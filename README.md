# Little Lemon Table Booking (React + Vite)

React single-page app for the Coursera Meta Front-End Developer capstone. Guests book a table at Little Lemon via a simplified, multi-step flow (availability → details → confirmation) with accessible markup, validation, and unit tests.

## Prerequisites

- Node.js 20.19+ recommended (Node 20.9 works with current warnings from Vite).
- npm 10+.

## Getting started

```bash
npm install
npm run dev
```

The dev server defaults to `http://localhost:5173`.

## Available scripts

- `npm run dev` – start the Vite dev server with HMR.
- `npm run build` – production build.
- `npm run preview` – preview the production build locally.
- `npm run lint` – run ESLint.
- `npm test` – run unit tests with Vitest + Testing Library.

## Project structure

- `src/App.jsx` – top-level layout and multi-step booking flow.
- `src/components/AvailabilityForm.jsx` – step one with date/time/guests.
- `src/components/DetailsForm.jsx` – step two with contact info, occasion, requests.
- `src/components/BookingSummary.jsx` – confirmation summary card(s).
- `src/__tests__/BookingForm.test.jsx` – validation/submission tests for both steps.
- `src/setupTests.js` – Testing Library + jest-dom setup.

## Notes for reviewers

- Form flow: Step 1 (date/time/guests), Step 2 (contact info, occasion cards, special requests), Step 3 (confirmation summary with important info).
- Validation: non-past dates, required time, guest count, required name/email, optional phone pattern; inline errors with `aria-*`.
- Responsive layout, focus-visible states, deterministic time slots in 15-minute increments by date.
- Branded assets: header (`src/assets/logos/Asset 14@4x.png`), footer (`src/assets/logos/Asset 18@4x.png`), hero image (`src/assets/ll-food-hero.png`).

## GitHub Pages

- Live URL (after Actions runs): `https://ameidav-pega.github.io/meta-frontend-developer/`
- Deploy workflow: `.github/workflows/deploy.yml` builds on pushes to `main` and publishes `dist` to GitHub Pages.
- Vite `base` is set to `/meta-frontend-developer/` for correct asset paths on Pages.
