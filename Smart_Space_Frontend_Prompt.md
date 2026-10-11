# Smart Space — Frontend Build Prompt

> Give this whole document to the AI coding tool as the single source of truth. Read all of it before writing any code. Build the complete frontend in one pass, keep the project runnable, then verify against the checklist at the end.

---

## 1. Your role and goal

You are a senior frontend engineer. Build a **complete, working React frontend prototype** for **Smart Space**, a space-booking platform. It must feel like a real, polished product: real interactions, real validation, real state changes, all running on **local mock data**. It is not a set of static screens.

A teammate is building the backend separately (Node.js + Express + MySQL). Do **not** build or call any backend. Later, only the `services/` layer will be swapped to call the real API, so all data access must live there.

---

## 2. What the project is

Smart Space helps people find and book small physical spaces nearby: society halls, community halls, clubhouses, meeting rooms and classrooms. A person enters what they need (type, date, time, number of people, area, facilities) and the system shows only the spaces that match and are actually free for that slot.

Typical users: a family booking a society hall for a birthday, a student group booking a classroom, an employee booking a meeting room, a local organiser booking a hall for a small event. These are **small venues, not large banquet halls**.

Signature features of this project (UI-only, mocked in this version):
- **QR entry pass:** every confirmed booking gets a QR code.
- **Entry verification:** the hall's watchman scans/enters the QR and verifies the visitor with ID verification (Aadhaar last 4 digits).
- **Local decorator suggestions:** if the user needs decoration, nearby decorators are suggested.

---

## 3. Tech stack and hard rules

- React 18 + Vite, JavaScript (no TypeScript)
- Tailwind CSS (current stable setup for Vite; define the shared "clay" styles once in `index.css`)
- React Router
- Allowed extra packages **only**: `lucide-react` (icons) and `qrcode.react` (QR codes). Nothing else: no UI kits, no Redux/Zustand, no animation libraries.
- Fonts via Google Fonts: **Fredoka** (headings) and **Nunito** (body).

Do NOT use: Prisma, Express, Node APIs, real auth, real payments, fake AI features, chatbots, maps SDKs, or any network call. No payment flow (showing a price/rate as plain information is fine).

---

## 4. File structure (keep it small and flat)

No separate folder per component or per page. Shared components live together in a few files. Do not create extra folders, index barrels, or one-file-per-tiny-thing.

```
frontend/
├─ index.html
├─ package.json, vite.config.js, README.md
└─ src/
   ├─ main.jsx
   ├─ App.jsx                 # all routes + role-protected route wrapper
   ├─ index.css               # Tailwind, design tokens, .clay classes
   ├─ data/
   │  └─ mockData.js          # ALL sample data in one place
   ├─ services/
   │  └─ api.js               # ALL data functions (async, simulated delay); the only file later changed for the real API
   ├─ context/
   │  └─ AppContext.jsx       # current user/role, spaces, bookings, etc. + actions that call services/api.js
   ├─ components/
   │  ├─ ui.jsx               # Button, Input, Select, Textarea, Checkbox, FacilityChips, Badge, Modal, ConfirmDialog, Toast, Spinner, EmptyState, StatCard, DataTable, PageHeader
   │  ├─ Layout.jsx           # Navbar (user role), Sidebar (manager/admin), mobile drawer, demo role switcher
   │  ├─ SpaceCard.jsx        # used by search results, dashboard, details
   │  ├─ BookingCard.jsx      # used by dashboard, my bookings, manager/admin views
   │  └─ SpaceForm.jsx        # add/edit space, used by manager and admin
   └─ pages/
      ├─ auth/    Login.jsx, Register.jsx
      ├─ user/    Home.jsx, SearchSpaces.jsx, SpaceDetails.jsx, Booking.jsx, MyBookings.jsx
      ├─ manager/ Dashboard.jsx, ManageSpaces.jsx, ManageFacilities.jsx, ManageSchedules.jsx, ViewBookings.jsx, VerifyEntry.jsx
      ├─ admin/   Dashboard.jsx, ManageUsers.jsx, ManageOrganizations.jsx, ManageSpaces.jsx, ManageBookings.jsx
      └─ Profile.jsx
```

Rules:
- A component gets its own file only if it is used in more than one place; otherwise keep it inside the page that uses it.
- **Search and Results are one page** (`SearchSpaces.jsx`): filter panel on top/side, results below.
- **Add/Edit Space is a modal** (using `SpaceForm.jsx`) opened from Manage Spaces, not a separate route.
- Admin "Manage Spaces/Bookings" should reuse the same table/card components as the manager's, with a wider data scope.
- No page file should exceed roughly 300 lines. Pull repeated pieces into `components/`.

---

## 5. Roles and navigation

Three roles. Each sees only its own navigation and actions.

| Role | Layout | Navigation |
|---|---|---|
| **User** | Floating top navbar | Home, Search Spaces, My Bookings, Profile |
| **Space Manager** | Left sidebar (drawer on mobile) | Dashboard, Spaces, Facilities, Schedules, Bookings, Verify Entry, Profile |
| **System Admin** | Left sidebar (drawer on mobile) | Dashboard, Users, Organizations, Spaces, Bookings, Profile |

- Route paths: `/login`, `/register`, `/` (redirects by role), `/user/...`, `/manager/...`, `/admin/...`, `/profile`.
- A role-protected wrapper in `App.jsx` redirects logged-out visitors to `/login` and wrong-role visitors to their own home. State clearly in the README that this is a UI demo only; real authorization comes from the backend.
- **Login:** email + password, show/hide password, required + format validation, clear error messages. Mock accounts (password for all: `Demo@123`):
  `user@demo.com`, `manager@demo.com`, `admin@demo.com`. Show three "Quick demo login" buttons on the Login page so a reviewer can enter any role in one click.
- **Register:** name, email, password, confirm password. The new account is **always a User**; there is no role selector and no way to create an Admin. Duplicate email shows an error. Registering logs the user in.
- **Demo role switcher:** a small, clearly labelled "Demo mode" control in the layout lets reviewers jump between the three roles without logging out. Persist the session and demo data in `localStorage` (wrapped in try/catch) so a refresh does not reset the app, and give Profile a "Reset demo data" button.
- Manager belongs to exactly one organization and only sees that organization's spaces, bookings and schedules. Admin sees everything.

---

## 6. Design direction: soft claymorphism

The look is **claymorphism**: soft, rounded, puffy, 3D "clay" surfaces on a pastel background. Friendly and modern, but it must still be a **usable management product**, so apply the clay style with discipline:

- Clay (puffy outer shadow + light highlight) is for **cards, buttons, navbar, sidebar and stat tiles**.
- Form inputs use an **inset** clay style (pressed-in).
- Tables and long lists sit inside one clay card, but their **rows are flat** with thin dividers. Never put heavy shadows on every row.
- Never nest clay inside clay more than one level; inner elements use flat or inset styles.
- Text must stay readable: body text at least 4.5:1 contrast. Do not put light text on pastel surfaces.
- Light theme only. No dark mode.
- Motion: only gentle hover lift, button press-in, and modal fade. No decorative or looping animations.

### Design tokens (define as CSS variables in `index.css`, expose via Tailwind)

```css
:root {
  --bg:        #EEF0FB;   /* page background (soft lavender) */
  --surface:   #F6F7FF;   /* clay card surface */
  --ink:       #26253F;   /* main text */
  --ink-soft:  #5E5C80;   /* secondary text */
  --primary:   #5B50E6;   /* indigo-violet; buttons, active nav */
  --primary-2: #8B82FF;   /* lighter tint for gradients */
  --accent:    #FF9F7A;   /* peach highlight */
  --success:   #2FBF8F;
  --warning:   #F5B544;
  --danger:    #EF5D7A;
  --radius-lg: 28px;      /* cards */
  --radius-md: 18px;      /* inputs, buttons */
  --radius-pill: 999px;
}
```

Clay classes to create once in `index.css` and reuse everywhere (do not copy shadow values into components):

```css
.clay {            /* raised card */
  background: var(--surface);
  border-radius: var(--radius-lg);
  box-shadow:
    10px 10px 24px rgba(120, 110, 190, 0.22),
    -8px -8px 20px rgba(255, 255, 255, 0.95),
    inset 2px 2px 5px rgba(255, 255, 255, 0.8),
    inset -3px -3px 6px rgba(120, 110, 190, 0.08);
}
.clay-inset {      /* inputs, pressed areas */
  background: #EAECFA;
  border-radius: var(--radius-md);
  box-shadow:
    inset 4px 4px 9px rgba(120, 110, 190, 0.22),
    inset -4px -4px 9px rgba(255, 255, 255, 0.95);
}
.clay-btn {        /* primary button: gradient + soft shadow; :active becomes inset */ }
```

- Status badges are small clay pills with color + text (never color alone): Confirmed (success), Pending (warning), Cancelled (danger), Completed (neutral), Active/Inactive.
- Icons: `lucide-react`, consistent stroke width, placed inside soft round clay "bubbles" on stat cards and space types.
- Consistent spacing scale, one button style set (primary, secondary, danger, ghost), one input style, one table style.
- Each space type gets a soft pastel colored tile with an icon in place of photos (no external images needed).

---

## 7. Pages: what each must contain

### Shared
- **Login / Register**: as in section 5. Centered clay card, friendly heading, a short product line.
- **Profile**: name, email, role, organization (if any), joined date, "Reset demo data", **Logout**.

### User
- **Home**: welcome message, big "Search Spaces" call-to-action, a quick-search strip (type, date, people) that opens the search page prefilled, the **next upcoming booking** (with its QR available), and recent bookings.
- **Search Spaces** (filters + results on one page):
  Filters: space type, date, start time, end time, number of people, area/location, facilities (multi-select chips). All filters optional so the user can also browse everything.
  Results as cards: name, type, capacity, area, facilities chips, rate per hour (info only), and an availability line such as "Free on 14 Oct, 10:00–13:00". Show result count, active-filter chips, sort (best fit, capacity, rate), loading state, and the empty state **"No spaces match these filters."** with a "Clear filters" button.
- **Space Details**: header with type and status, full info (capacity, area, building/floor, opening hours, rules/notes, rate), all facilities, a small availability view for the selected or next 7 days, a **"Nearby decorators"** section (see section 9), and a **Book Now** button (carries the searched date/time into booking).
- **Booking**: selected space summary, date, start time, end time, number of people, purpose, ID verification field (Aadhaar last 4 digits), optional "I need decoration" checkbox with decorator picker. Validate everything, show inline errors, then success confirmation with booking ID and the **QR entry pass**. A conflict shows a clear error such as "This slot was just taken. Please choose another time."
- **My Bookings**: tabs or filter (Upcoming, Past, Cancelled). Each booking shows space, date, time, status, booking ID, a "Show QR" action, and **Cancel** (with confirm dialog) for upcoming bookings. Cancelling updates the status immediately and frees the slot in search.

### Space Manager
- **Dashboard**: stat cards (total spaces, today's bookings, upcoming bookings, active vs inactive spaces), today's schedule list, and a few recent bookings.
- **Manage Spaces**: searchable table with Add, Edit, Activate/Deactivate, Delete. Add/Edit opens a modal (name, type, capacity, area/location, building/floor, opening and closing time, rate per hour, description, facilities multi-select). Delete is blocked, with a message, if the space has upcoming bookings. Inactive spaces never appear in user search.
- **Manage Facilities**: add, rename, delete facility names (Projector, AC, Wi-Fi, Microphone, Parking, Kitchen, Sound System, Power Backup, Whiteboard, Stage, Wheelchair Access). Show how many spaces use each; warn before deleting one that is in use.
- **Manage Schedules**: pick a space, date, start, end and purpose to **block** a slot (maintenance, private event). Validate the range and overlaps. Blocked slots make the space unavailable in search. List and remove existing blocks.
- **View Bookings**: table for this organization's spaces with filters (status, space, date). Show booking ID, user, space, date, time, status, entry status.
- **Verify Entry** (the watchman screen): large input for booking ID / pasted QR text plus an ID verification field (Aadhaar last 4 digits). Result card: **Valid – allow entry**, or a clear reason for rejection (not found, wrong date, cancelled, ID mismatch, already used). Valid entry marks the booking "Entered". Mock only: no real Aadhaar service.

### System Admin
- **Dashboard**: stat cards (users, organizations, spaces, bookings) plus a small, simple bookings-by-status or bookings-per-week chart (plain SVG/CSS; no chart library).
- **Manage Users**: table with name, email, role, status, joined; Activate/Deactivate action; search and role filter. The admin cannot deactivate themselves.
- **Manage Organizations**: list, Add, Edit (modal), with number of spaces per organization.
- **Manage Spaces**: all spaces across organizations (organization column and filter), view and activate/deactivate.
- **Manage Bookings**: all bookings, filter by status/organization/date, admin may cancel a booking.

---

## 8. Behavior and business rules (these must really work)

Search and availability:
1. Search must genuinely filter the mock spaces. The button is never decorative.
2. **Capacity:** space capacity must be ≥ requested people.
3. **Facilities:** a result must include **all** selected facilities.
4. **Type and area:** exact match when selected.
5. **Time:** start time must be strictly earlier than end time; otherwise show an error and do not search. If any of date/start/end is filled, all three are required. Dates in the past are rejected. Time inputs use 30-minute steps.
6. **Availability:** exclude a space if the requested slot is outside its opening hours or overlaps any non-cancelled booking or manager block on that date. Overlap test: `aStart < bEnd && bStart < aEnd`.
7. Inactive spaces never show up for users.

Booking:
8. Booking creates a new booking in app state with status Confirmed and a generated ID like `BK-1013`, plus a QR token, then shows confirmation.
9. Block conflicts (same space, overlapping time) and block the same user from double-booking overlapping times in different spaces.
10. Cancelling sets status to Cancelled, updates every view, and releases the slot.

Management:
11. Manager/admin add, edit, deactivate, delete, block and activate actions update the shared app state, so changes are visible across pages immediately (a space deactivated by a manager disappears from user search).
12. Every destructive action uses a confirm dialog.

UX states:
13. Every async call goes through `services/api.js` with a short simulated delay (300–600 ms), so **loading states are visible**.
14. Show empty, loading, success and error states everywhere they apply. Use toasts for success/error feedback.
15. Forms: visible labels, helpful placeholders, required-field checks, readable inline messages, disabled submit while saving.

---

## 9. Mock data (single file: `data/mockData.js`)

All sample data lives here, nowhere else. Use camelCase fields. Generate **dates relative to today** (a helper like `daysFromNow(n)`) so the demo never goes stale.

Entities and minimum amounts:
- `organizations` (4, fictional): e.g. Gulmohar Residency Society (Pune), Sai Krupa Co-op Housing Society (Nashik), Greenfield College (Nashik), Orbit Tech Park (Pune). Fields: `id, name, city, contactEmail, status`.
- `users` (8): include the three demo accounts. Fields: `id, name, email, password, role ('user'|'manager'|'admin'), organizationId (managers), status ('active'|'inactive'), joinedOn`.
- `facilities` (11): the list in section 7.
- `spaces` (14): mix of Community Hall, Society Clubhouse, Meeting Room, Classroom, Terrace Hall. Fields: `id, name, type, capacity (10–120), organizationId, area, city, building, floor, facilityIds, openTime, closeTime, ratePerHour, description, rules, status`. Use realistic Pune/Nashik areas (e.g. Kothrud, Baner, Wakad, Gangapur Road, College Road, Panchavati).
- `bookings` (14): spread across past, today and upcoming, mixed statuses. Fields: `id, userId, spaceId, date, startTime, endTime, people, purpose, status ('confirmed'|'cancelled'|'completed'), qrToken, idLast4, entryStatus ('pending'|'entered'), decoratorId (optional), createdAt`.
- `schedules` (5 manager blocks): `id, spaceId, date, startTime, endTime, purpose`.
- `decorators` (5): `id, name, speciality (birthday, wedding, corporate), area, startingPrice, phone, rating`. Display and contact only; no booking or payment of decorators.

Make sure demo data exercises the rules: at least one space that is full on a given day, one inactive space, one cancelled booking, and one space with a manager block.

### `services/api.js`
- One exported async function per operation (`login`, `register`, `getSpaces`, `searchSpaces`, `createBooking`, `cancelBooking`, `saveSpace`, `blockSlot`, `verifyEntry`, and so on). Each returns data or throws an `Error` with a readable message, after a small delay.
- Pages and components never import `mockData.js` directly; they go through the context and `services/api.js`. Keep function names and return shapes clean, because the real Express API will replace the internals later.

---

## 10. Layout and quality bar

- Responsive for **laptop (≥1024px) and mobile (≥360px)**. Sidebar collapses to a drawer on small screens; tables become stacked cards or scroll horizontally inside their container; touch targets at least 44px.
- Looks like a real product, not an assignment form: consistent spacing, typography scale, clear hierarchy, one visual language across all three roles.
- Accessibility basics: semantic HTML, labels tied to inputs, visible keyboard focus ring (a clay-style glow), `aria` on modals and toasts, icon-only buttons have labels.
- No console errors or warnings. No unused files or dead code. Component and file names should be obvious.
- Do not add features that are not in this document.

---

## 11. Deliverables

1. The working project in `frontend/`, started with `npm install` then `npm run dev`, and no backend needed. `npm run build` must succeed.
2. A short `README.md`: how to run, demo accounts, folder structure, completed pages, known limitations, and a note on where the API will be plugged in (`services/api.js`).
3. A short closing note listing what is complete and any known issues.

---

## 12. Acceptance checklist (verify before finishing)

- [ ] All pages in section 7 exist and every nav link works for each role
- [ ] Each role sees only its own navigation; wrong-role URLs redirect
- [ ] Login, quick demo login and register work with validation; no way to register an Admin
- [ ] Search filters by type, area, capacity, facilities, and date/time availability
- [ ] Start ≥ end time and past dates are rejected with clear messages
- [ ] Booking creates a booking, shows the QR pass, and rejects conflicts
- [ ] Cancelling updates My Bookings and frees the slot in search
- [ ] Manager add/edit/deactivate/delete/block actions update the UI everywhere
- [ ] A deactivated space disappears from user search
- [ ] Verify Entry returns the correct result for valid, wrong ID, cancelled and already-entered cases
- [ ] Admin pages show cross-organization data; admin cannot deactivate self
- [ ] Loading, empty, success and error states are visible
- [ ] Claymorphism applied consistently, text readable, works at laptop and mobile widths
- [ ] File structure matches section 4 and the project starts from the README
