# Smart Space — Frontend Prototype

A modern, responsive, claymorphic space-booking platform prototype built with **React 18 + Vite**, **Tailwind CSS**, and **React Router**. Smart Space helps residents, student groups, and professionals discover and book small physical spaces nearby (society community halls, clubhouses, meeting rooms, and classrooms).

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+ or v20+ recommended)
- npm (v9+)

### Installation & Launch
```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. To verify production bundle build:
npm run build
```

Open your browser at `http://localhost:5173/`.

---

## 🔑 Demo Accounts (1-Click Login Available)

All demo accounts share the password: `Demo@123`

| Role | Email | Password | Scope & Description |
|---|---|---|---|
| **User (Resident)** | `user@demo.com` | `Demo@123` | Can search spaces, view 7-day availability, book slots with Aadhaar ID verification, request decorators, and get QR entry passes. |
| **Space Manager** | `manager@demo.com` | `Demo@123` | Scoped to *Gulmohar Residency Co-op Society* (Pune). Can manage spaces, amenities, maintenance blocks, view bookings, and operate the Watchman QR Entry terminal. |
| **System Admin** | `admin@demo.com` | `Demo@123` | Full cross-organization control. System metrics, bookings status chart, user management (protected from self-deactivation), organization management, and global space supervision. |

> **Tip:** You can jump between roles instantly at any time using the **"Demo Mode"** switcher pill in the navigation bar/sidebar without logging out!

---

## 🗂️ Project Structure

```
frontend/
├─ index.html                  # HTML entry point with Fredoka & Nunito Google Fonts
├─ package.json                # Dependencies: react, react-router-dom, lucide-react, qrcode.react, tailwindcss
├─ vite.config.js              # Vite configuration
├─ tailwind.config.js          # Custom clay design tokens, typography, colors
├─ README.md                   # Project documentation
└─ src/
   ├─ main.jsx                 # React root mount
   ├─ App.jsx                  # All routes, role redirects, and role-protected route guard
   ├─ index.css                # Soft claymorphism utility classes (.clay, .clay-inset, .clay-btn, .clay-bubble)
   ├─ data/
   │  └─ mockData.js           # Single source of sample data (relative dynamic dates with daysFromNow)
   ├─ services/
   │  └─ api.js                # Data access layer (async, simulated delay 300-500ms, localStorage persistence)
   ├─ context/
   │  └─ AppContext.jsx        # Global state, active session, reactive updates, and toast feedback
   ├─ components/
   │  ├─ ui.jsx                # Accessible UI components (Button, Input, Select, Textarea, Checkbox,
   │  │                        # FacilityChips, Badge, Modal, ConfirmDialog, Toast, Spinner, EmptyState,
   │  │                        # StatCard, DataTable, PageHeader)
   │  ├─ Layout.jsx            # Floating top navbar (user), left sidebar (manager/admin), mobile drawer, demo switcher
   │  ├─ SpaceCard.jsx         # Card for search results, availability line, pastel category bubbles
   │  ├─ BookingCard.jsx       # Booking card with status badges, cancel confirmation, and modal QR pass
   │  └─ SpaceForm.jsx         # Add/edit space modal with full validation, operating hours, and facility chips
   └─ pages/
      ├─ auth/
      │  ├─ Login.jsx          # Login with 1-click demo buttons and format validation
      │  └─ Register.jsx       # User-only registration (always assigns 'user' role)
      ├─ user/
      │  ├─ Home.jsx           # Welcome hero, quick-search strip, upcoming booking with QR, featured venues
      │  ├─ SearchSpaces.jsx   # 1-page search & results, multi-filter, slot conflict validation, empty states
      │  ├─ SpaceDetails.jsx   # Venue specs, 7-day schedule matrix, recommended local decorators, Book Now CTA
      │  ├─ Booking.jsx        # Reservation checkout, conflict prevention, Aadhaar last 4 validation, QR pass screen
      │  └─ MyBookings.jsx     # Tabs (Upcoming, Past, Cancelled, All), reactive cancellation
      ├─ manager/
      │  ├─ Dashboard.jsx      # Stats, today's schedule timeline, recent bookings, quick actions
      │  ├─ ManageSpaces.jsx   # Organization-scoped space table, add/edit modal, activation toggle, delete check
      │  ├─ ManageFacilities.jsx # Amenity chips, usage counts in venues, rename/delete warnings
      │  ├─ ManageSchedules.jsx  # Slot blocking (maintenance/private), overlap prevention, block lifting
      │  ├─ ViewBookings.jsx   # Organization booking logs, status and date filters, cancellation
      │  └─ VerifyEntry.jsx    # Watchman terminal: scans QR/ID + Aadhaar verification, real rejection reasons, 1-click demo test buttons
      ├─ admin/
      │  ├─ Dashboard.jsx      # System metrics, pure CSS/SVG bookings distribution chart, user role breakdowns
      │  ├─ ManageUsers.jsx    # User accounts, search, role filters, activation toggle, self-deactivation protection
      │  ├─ ManageOrganizations.jsx # Organization cards, listed space counts, add/edit modal
      │  ├─ ManageSpaces.jsx   # Cross-organization venue supervisor
      │  └─ ManageBookings.jsx # Cross-organization platform booking supervisor
      └─ Profile.jsx           # Account metadata, organization details, reset demo data, sign out
```

---

## 🔌 Backend Integration Point (`services/api.js`)

All pages, contexts, and components interact **strictly** through the exported asynchronous functions in `src/services/api.js`.

When the backend team delivers the Node.js + Express + MySQL endpoints:
1. Only `src/services/api.js` needs to be replaced with `fetch()` or `axios` calls to the Express API (e.g., `POST /api/auth/login`, `GET /api/spaces`, `POST /api/bookings`).
2. No components or pages import `mockData.js` directly.
3. The UI components already handle real loading states, errors, inline validation messages, and toast notifications.

---

## ✨ Signature Features Implemented

1. **Digital QR Entry Pass (`qrcode.react`)**:
   - Every confirmed reservation generates a high-contrast QR token (`QRCodeSVG`) displaying the booking reference and venue details.
   - Available on the User Home screen, Space Confirmation screen, and My Bookings modal.

2. **Watchman Security Gate Verification (`/manager/verify-entry`)**:
   - Security terminal to input booking reference / paste QR token + visitor's last 4 digits of Aadhaar.
   - Real validation against:
     - **Valid pass**: Marks booking as "Entered" and displays attendee details.
     - **Wrong date**: Rejection if pass is for a past or future date.
     - **Cancelled booking**: Rejection if booking was cancelled.
     - **ID mismatch**: Rejection if Aadhaar last 4 digits do not match.
     - **Already entered**: Rejection for re-entry attempts.
   - Includes 1-click test buttons for instantaneous scenario testing.

3. **Live Conflict Prevention**:
   - Rejects reservations outside operating hours.
   - Rejects slot overlaps with active bookings or manager maintenance blocks (`aStart < bEnd && bStart < aEnd`).
   - Prevents the same user from double-booking overlapping hours across different venues.
   - Cancelling a booking instantly frees the slot in search results.

4. **Local Decorator Recommendations**:
   - Displays rated local floral, balloon, and theme decorators nearby.
   - Allows users to check "I need decoration services" and attach a decorator directly to their booking pass.

5. **Soft Claymorphism Design System**:
   - Custom puffy 3D raised surfaces (`.clay`) and pressed form fields (`.clay-inset`).
   - Pastel category tiles, accessible contrast (>4.5:1), and Google Fonts (**Fredoka** for headings, **Nunito** for body).
   - Fully responsive for mobile (drawer layout) and laptop screens.

---

## ⚠️ Known Prototype Limitations
- Payments are non-transactional (hourly rate is displayed as informational guidance).
- Government ID verification simulates Aadhaar last-4-digit matching against the client-side mock session without third-party UIDAI API calls.
