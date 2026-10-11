import {
  INITIAL_ORGANIZATIONS,
  INITIAL_USERS,
  INITIAL_FACILITIES,
  INITIAL_SPACES,
  INITIAL_BOOKINGS,
  INITIAL_SCHEDULES,
  INITIAL_DECORATORS,
  daysFromNow
} from '../data/mockData.js';

export { daysFromNow };

const STORAGE_KEYS = {
  USERS: 'smartspace_users',
  SPACES: 'smartspace_spaces',
  BOOKINGS: 'smartspace_bookings',
  SCHEDULES: 'smartspace_schedules',
  ORGANIZATIONS: 'smartspace_organizations',
  FACILITIES: 'smartspace_facilities',
  CURRENT_USER: 'smartspace_current_user',
};

// Simulate network latency (300ms - 500ms)
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const getStorageItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving ${key} to localStorage:`, e);
  }
};

// Initialize localStorage if empty
const initStorage = () => {
  if (!getStorageItem(STORAGE_KEYS.USERS, null)) {
    setStorageItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!getStorageItem(STORAGE_KEYS.SPACES, null)) {
    setStorageItem(STORAGE_KEYS.SPACES, INITIAL_SPACES);
  }
  if (!getStorageItem(STORAGE_KEYS.BOOKINGS, null)) {
    setStorageItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }
  if (!getStorageItem(STORAGE_KEYS.SCHEDULES, null)) {
    setStorageItem(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  }
  if (!getStorageItem(STORAGE_KEYS.ORGANIZATIONS, null)) {
    setStorageItem(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
  }
  if (!getStorageItem(STORAGE_KEYS.FACILITIES, null)) {
    setStorageItem(STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
  }
  if (!getStorageItem(STORAGE_KEYS.CURRENT_USER, null)) {
    // Default to user@demo.com initially
    setStorageItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  }
};

// Run initialization
initStorage();

// Overlap helper: (aStart < bEnd && bStart < aEnd)
export const checkOverlap = (startA, endA, startB, endB) => {
  return startA < endB && startB < endA;
};

// Get today's date formatted as YYYY-MM-DD
export const getTodayStr = () => daysFromNow(0);

// --- Auth APIs ---

export const apiLogin = async (email, password) => {
  await delay(350);
  const users = getStorageItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  const user = users.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!user) {
    throw new Error('No account found with this email address.');
  }
  if (user.status === 'inactive') {
    throw new Error('This account has been deactivated. Please contact support.');
  }
  if (user.password !== password) {
    throw new Error('Invalid password. Please check your credentials.');
  }

  const sanitized = { ...user };
  delete sanitized.password;
  setStorageItem(STORAGE_KEYS.CURRENT_USER, sanitized);
  return sanitized;
};

export const apiRegister = async ({ name, email, password, confirmPassword }) => {
  await delay(400);
  if (!name || !email || !password) {
    throw new Error('All fields are required.');
  }
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match.');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const users = getStorageItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new Error('An account with this email address already exists.');
  }

  const newUser = {
    id: `usr-${Date.now().toString().slice(-4)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    role: 'user', // Hard rule: always 'user'
    organizationId: null,
    status: 'active',
    joinedOn: getTodayStr(),
  };

  users.push(newUser);
  setStorageItem(STORAGE_KEYS.USERS, users);

  const sanitized = { ...newUser };
  delete sanitized.password;
  setStorageItem(STORAGE_KEYS.CURRENT_USER, sanitized);
  return sanitized;
};

export const apiGetCurrentUser = async () => {
  return getStorageItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
};

export const apiSwitchDemoRole = async (targetRole) => {
  await delay(200);
  const users = getStorageItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  const demoAccount = users.find(
    (u) => u.role === targetRole && u.status === 'active'
  );
  if (demoAccount) {
    const sanitized = { ...demoAccount };
    delete sanitized.password;
    setStorageItem(STORAGE_KEYS.CURRENT_USER, sanitized);
    return sanitized;
  }
  throw new Error(`Demo account for role "${targetRole}" not found.`);
};

export const apiLogout = async () => {
  await delay(150);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  return true;
};

export const apiResetDemoData = async () => {
  await delay(400);
  setStorageItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  setStorageItem(STORAGE_KEYS.SPACES, INITIAL_SPACES);
  setStorageItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  setStorageItem(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  setStorageItem(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
  setStorageItem(STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
  setStorageItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  return true;
};

// --- Spaces APIs ---

export const apiGetSpaces = async (filterOrgId = null) => {
  await delay(300);
  let spaces = getStorageItem(STORAGE_KEYS.SPACES, INITIAL_SPACES);
  if (filterOrgId) {
    spaces = spaces.filter((s) => s.organizationId === filterOrgId);
  }
  return spaces;
};

export const apiGetSpaceById = async (id) => {
  await delay(200);
  const spaces = getStorageItem(STORAGE_KEYS.SPACES, INITIAL_SPACES);
  const space = spaces.find((s) => s.id === id);
  if (!space) throw new Error('Space not found.');
  return space;
};

export const apiSearchSpaces = async (filters = {}) => {
  await delay(400);
  const {
    type,
    area,
    people,
    facilityIds = [],
    date,
    startTime,
    endTime,
    sortBy = 'default', // 'default' | 'capacity' | 'rate-low' | 'rate-high'
  } = filters;

  const today = getTodayStr();

  // Validate time logic if provided
  if (date || startTime || endTime) {
    if (!date || !startTime || !endTime) {
      throw new Error('To filter by time, Date, Start Time, and End Time are all required.');
    }
    if (date < today) {
      throw new Error('Date cannot be in the past. Please select today or a future date.');
    }
    if (startTime >= endTime) {
      throw new Error('Start time must be strictly earlier than end time.');
    }
  }

  const allSpaces = getStorageItem(STORAGE_KEYS.SPACES, INITIAL_SPACES);
  const allBookings = getStorageItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  const allSchedules = getStorageItem(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);

  let results = allSpaces.filter((space) => {
    // 7. Inactive spaces never show up for users
    if (space.status !== 'active') return false;

    // 4. Type and area exact match
    if (type && space.type !== type) return false;
    if (area && space.area.toLowerCase() !== area.toLowerCase()) return false;

    // 2. Capacity: space capacity >= requested people
    if (people && Number(space.capacity) < Number(people)) return false;

    // 3. Facilities: space must include ALL selected facilities
    if (facilityIds && facilityIds.length > 0) {
      const hasAll = facilityIds.every((fid) => space.facilityIds?.includes(fid));
      if (!hasAll) return false;
    }

    // 6. Time and Availability
    if (date && startTime && endTime) {
      // Check space opening & closing hours
      if (startTime < space.openTime || endTime > space.closeTime) {
        return false;
      }

      // Check overlapping non-cancelled bookings
      const hasBookingConflict = allBookings.some((b) => {
        if (b.spaceId !== space.id || b.date !== date || b.status === 'cancelled') {
          return false;
        }
        return checkOverlap(startTime, endTime, b.startTime, b.endTime);
      });
      if (hasBookingConflict) return false;

      // Check overlapping manager blocks/schedules
      const hasScheduleConflict = allSchedules.some((s) => {
        if (s.spaceId !== space.id || s.date !== date) return false;
        return checkOverlap(startTime, endTime, s.startTime, s.endTime);
      });
      if (hasScheduleConflict) return false;
    }

    return true;
  });

  // Sorting
  if (sortBy === 'capacity') {
    results.sort((a, b) => b.capacity - a.capacity);
  } else if (sortBy === 'rate-low') {
    results.sort((a, b) => a.ratePerHour - b.ratePerHour);
  } else if (sortBy === 'rate-high') {
    results.sort((a, b) => b.ratePerHour - a.ratePerHour);
  }

  return results;
};

export const apiSaveSpace = async (spaceData) => {
  await delay(400);
  const spaces = getStorageItem(STORAGE_KEYS.SPACES, INITIAL_SPACES);

  if (spaceData.id) {
    // Update
    const idx = spaces.findIndex((s) => s.id === spaceData.id);
    if (idx === -1) throw new Error('Space to update was not found.');
    spaces[idx] = { ...spaces[idx], ...spaceData };
    setStorageItem(STORAGE_KEYS.SPACES, spaces);
    return spaces[idx];
  } else {
    // Create new
    const newSpace = {
      ...spaceData,
      id: `spc-${Date.now().toString().slice(-4)}`,
      status: spaceData.status || 'active',
    };
    spaces.push(newSpace);
    setStorageItem(STORAGE_KEYS.SPACES, spaces);
    return newSpace;
  }
};

export const apiDeleteSpace = async (spaceId) => {
  await delay(350);
  const spaces = getStorageItem(STORAGE_KEYS.SPACES, INITIAL_SPACES);
  const bookings = getStorageItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  const today = getTodayStr();

  // Rule: Delete is blocked with a message if the space has upcoming bookings
  const hasUpcoming = bookings.some(
    (b) => b.spaceId === spaceId && b.date >= today && b.status === 'confirmed'
  );

  if (hasUpcoming) {
    throw new Error('Cannot delete this space because it has active upcoming bookings. Please cancel or reassign them first.');
  }

  const updated = spaces.filter((s) => s.id !== spaceId);
  setStorageItem(STORAGE_KEYS.SPACES, updated);
  return true;
};

export const apiToggleSpaceStatus = async (spaceId) => {
  await delay(300);
  const spaces = getStorageItem(STORAGE_KEYS.SPACES, INITIAL_SPACES);
  const space = spaces.find((s) => s.id === spaceId);
  if (!space) throw new Error('Space not found.');

  space.status = space.status === 'active' ? 'inactive' : 'active';
  setStorageItem(STORAGE_KEYS.SPACES, spaces);
  return space;
};

// --- Bookings APIs ---

export const apiGetBookings = async (filterUserId = null, filterOrgId = null) => {
  await delay(350);
  let bookings = getStorageItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  const spaces = getStorageItem(STORAGE_KEYS.SPACES, INITIAL_SPACES);

  if (filterUserId) {
    bookings = bookings.filter((b) => b.userId === filterUserId);
  }

  if (filterOrgId) {
    const orgSpaceIds = spaces
      .filter((s) => s.organizationId === filterOrgId)
      .map((s) => s.id);
    bookings = bookings.filter((b) => orgSpaceIds.includes(b.spaceId));
  }

  return bookings;
};

export const apiCreateBooking = async (bookingData) => {
  await delay(450);
  const {
    userId,
    spaceId,
    date,
    startTime,
    endTime,
    people,
    purpose,
    idLast4,
    decoratorId,
  } = bookingData;

  const today = getTodayStr();
  if (date < today) {
    throw new Error('Cannot book dates in the past.');
  }
  if (startTime >= endTime) {
    throw new Error('Start time must be strictly earlier than end time.');
  }
  if (!idLast4 || idLast4.length !== 4 || !/^\d{4}$/.test(idLast4)) {
    throw new Error('Valid 4-digit Aadhaar last 4 digits are required for entry verification.');
  }

  const spaces = getStorageItem(STORAGE_KEYS.SPACES, INITIAL_SPACES);
  const space = spaces.find((s) => s.id === spaceId);
  if (!space) throw new Error('Selected space was not found.');
  if (space.status !== 'active') throw new Error('This space is currently inactive and cannot be booked.');

  if (startTime < space.openTime || endTime > space.closeTime) {
    throw new Error(`Requested slot is outside operating hours (${space.openTime} – ${space.closeTime}).`);
  }

  const allBookings = getStorageItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  const allSchedules = getStorageItem(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);

  // Rule 9: Check space conflict
  const spaceConflict = allBookings.some((b) => {
    if (b.spaceId !== spaceId || b.date !== date || b.status === 'cancelled') return false;
    return checkOverlap(startTime, endTime, b.startTime, b.endTime);
  });
  if (spaceConflict) {
    throw new Error('This slot was just taken. Please choose another time.');
  }

  // Check schedule conflict
  const scheduleConflict = allSchedules.some((s) => {
    if (s.spaceId !== spaceId || s.date !== date) return false;
    return checkOverlap(startTime, endTime, s.startTime, s.endTime);
  });
  if (scheduleConflict) {
    throw new Error('This slot is reserved for maintenance or private schedule by the manager.');
  }

  // Rule 9: Block the same user from double-booking overlapping times in different spaces!
  const userOverlapConflict = allBookings.some((b) => {
    if (b.userId !== userId || b.date !== date || b.status === 'cancelled') return false;
    return checkOverlap(startTime, endTime, b.startTime, b.endTime);
  });
  if (userOverlapConflict) {
    throw new Error('You already have another active booking overlapping this time window.');
  }

  const nextBookingNum = 1015 + allBookings.length;
  const newId = `BK-${nextBookingNum}`;
  const randomSalt = Math.floor(1000 + Math.random() * 9000);

  const newBooking = {
    id: newId,
    userId,
    spaceId,
    date,
    startTime,
    endTime,
    people: Number(people),
    purpose: purpose?.trim() || 'General Gathering',
    status: 'confirmed',
    qrToken: `${newId}-QR-${randomSalt}-AUTH`,
    idLast4: idLast4.trim(),
    entryStatus: 'pending',
    decoratorId: decoratorId || null,
    createdAt: `${today} ${new Date().toTimeString().slice(0, 5)}`,
  };

  allBookings.unshift(newBooking);
  setStorageItem(STORAGE_KEYS.BOOKINGS, allBookings);
  return newBooking;
};

export const apiCancelBooking = async (bookingId) => {
  await delay(350);
  const bookings = getStorageItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  const booking = bookings.find((b) => b.id === bookingId);
  if (!booking) throw new Error('Booking not found.');

  booking.status = 'cancelled';
  setStorageItem(STORAGE_KEYS.BOOKINGS, bookings);
  return booking;
};

// --- Verify Entry API (The watchman screen) ---
export const apiVerifyEntry = async (query, idLast4) => {
  await delay(450);
  if (!query || !idLast4) {
    throw new Error('Both Booking ID/QR text and Aadhaar last 4 digits are required.');
  }

  const cleanQuery = query.trim().toUpperCase();
  const cleanId = idLast4.trim();
  const bookings = getStorageItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  const spaces = getStorageItem(STORAGE_KEYS.SPACES, INITIAL_SPACES);
  const users = getStorageItem(STORAGE_KEYS.USERS, INITIAL_USERS);

  // Match either booking ID (BK-XXXX) or QR Token
  const booking = bookings.find(
    (b) => b.id.toUpperCase() === cleanQuery || b.qrToken.toUpperCase() === cleanQuery
  );

  if (!booking) {
    return {
      success: false,
      reason: 'NOT_FOUND',
      message: 'Booking pass not found. Please verify the code or QR string.',
    };
  }

  const today = getTodayStr();

  // Rejection: Cancelled
  if (booking.status === 'cancelled') {
    return {
      success: false,
      reason: 'CANCELLED',
      message: 'This booking has been cancelled and cannot be used for entry.',
      booking,
    };
  }

  // Rejection: Date mismatch
  if (booking.date !== today) {
    return {
      success: false,
      reason: 'WRONG_DATE',
      message: `Booking is scheduled for ${booking.date}, but today is ${today}. Access denied.`,
      booking,
    };
  }

  // Rejection: ID mismatch
  if (booking.idLast4 !== cleanId) {
    return {
      success: false,
      reason: 'ID_MISMATCH',
      message: 'ID verification failed: Last 4 digits do not match the registered booking record.',
      booking,
    };
  }

  // Rejection: Already entered
  if (booking.entryStatus === 'entered') {
    return {
      success: false,
      reason: 'ALREADY_ENTERED',
      message: 'This QR pass has already been scanned and verified. Re-entry denied.',
      booking,
    };
  }

  // Valid! Mark entered
  booking.entryStatus = 'entered';
  setStorageItem(STORAGE_KEYS.BOOKINGS, bookings);

  const space = spaces.find((s) => s.id === booking.spaceId);
  const user = users.find((u) => u.id === booking.userId);

  return {
    success: true,
    reason: 'VALID',
    message: 'Valid Entry — Welcome to Smart Space!',
    booking,
    space,
    user,
  };
};

// --- Facilities APIs ---

export const apiGetFacilities = async () => {
  await delay(200);
  return getStorageItem(STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
};

export const apiSaveFacility = async (facilityData) => {
  await delay(300);
  const facilities = getStorageItem(STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);

  if (facilityData.id) {
    const idx = facilities.findIndex((f) => f.id === facilityData.id);
    if (idx === -1) throw new Error('Facility not found.');
    facilities[idx] = { ...facilities[idx], name: facilityData.name.trim() };
    setStorageItem(STORAGE_KEYS.FACILITIES, facilities);
    return facilities[idx];
  } else {
    const newFacility = {
      id: `fac-${Date.now().toString().slice(-4)}`,
      name: facilityData.name.trim(),
    };
    facilities.push(newFacility);
    setStorageItem(STORAGE_KEYS.FACILITIES, facilities);
    return newFacility;
  }
};

export const apiDeleteFacility = async (facilityId) => {
  await delay(300);
  const facilities = getStorageItem(STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
  const spaces = getStorageItem(STORAGE_KEYS.SPACES, INITIAL_SPACES);

  const usageCount = spaces.filter((s) => s.facilityIds?.includes(facilityId)).length;
  // If in use, caller should confirm first, but let's also remove reference from spaces
  const updatedSpaces = spaces.map((s) => ({
    ...s,
    facilityIds: s.facilityIds?.filter((fid) => fid !== facilityId) || [],
  }));
  setStorageItem(STORAGE_KEYS.SPACES, updatedSpaces);

  const updatedFacilities = facilities.filter((f) => f.id !== facilityId);
  setStorageItem(STORAGE_KEYS.FACILITIES, updatedFacilities);
  return { deletedId: facilityId, removedFromSpaces: usageCount };
};

// --- Schedules (Manager Blocked Slots) APIs ---

export const apiGetSchedules = async (filterSpaceId = null) => {
  await delay(250);
  let schedules = getStorageItem(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  if (filterSpaceId) {
    schedules = schedules.filter((s) => s.spaceId === filterSpaceId);
  }
  return schedules;
};

export const apiBlockSlot = async ({ spaceId, date, startTime, endTime, purpose }) => {
  await delay(400);
  const today = getTodayStr();
  if (date < today) {
    throw new Error('Cannot block dates in the past.');
  }
  if (startTime >= endTime) {
    throw new Error('Start time must be strictly earlier than end time.');
  }

  const schedules = getStorageItem(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  const bookings = getStorageItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);

  // Check overlap with existing blocks
  const blockOverlap = schedules.some((s) => {
    if (s.spaceId !== spaceId || s.date !== date) return false;
    return checkOverlap(startTime, endTime, s.startTime, s.endTime);
  });
  if (blockOverlap) {
    throw new Error('A maintenance block already overlaps this time slot.');
  }

  // Check overlap with confirmed bookings
  const bookingOverlap = bookings.some((b) => {
    if (b.spaceId !== spaceId || b.date !== date || b.status === 'cancelled') return false;
    return checkOverlap(startTime, endTime, b.startTime, b.endTime);
  });
  if (bookingOverlap) {
    throw new Error('An active booking already exists in this slot. Please coordinate or cancel it before blocking.');
  }

  const newSchedule = {
    id: `sch-${Date.now().toString().slice(-4)}`,
    spaceId,
    date,
    startTime,
    endTime,
    purpose: purpose?.trim() || 'Maintenance & Inspection',
  };

  schedules.unshift(newSchedule);
  setStorageItem(STORAGE_KEYS.SCHEDULES, schedules);
  return newSchedule;
};

export const apiUnblockSlot = async (scheduleId) => {
  await delay(300);
  const schedules = getStorageItem(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
  const updated = schedules.filter((s) => s.id !== scheduleId);
  setStorageItem(STORAGE_KEYS.SCHEDULES, updated);
  return true;
};

// --- Users & Organizations APIs (Admin) ---

export const apiGetUsers = async () => {
  await delay(300);
  const users = getStorageItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  return users.map((u) => {
    const sanitized = { ...u };
    delete sanitized.password;
    return sanitized;
  });
};

export const apiToggleUserStatus = async (userId, currentAdminId) => {
  await delay(350);
  // Rule: Admin cannot deactivate themselves!
  if (userId === currentAdminId) {
    throw new Error('System Security: Administrators cannot deactivate their own active account.');
  }

  const users = getStorageItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  const user = users.find((u) => u.id === userId);
  if (!user) throw new Error('User not found.');

  user.status = user.status === 'active' ? 'inactive' : 'active';
  setStorageItem(STORAGE_KEYS.USERS, users);

  const sanitized = { ...user };
  delete sanitized.password;
  return sanitized;
};

export const apiGetOrganizations = async () => {
  await delay(250);
  return getStorageItem(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
};

export const apiSaveOrganization = async (orgData) => {
  await delay(400);
  const orgs = getStorageItem(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);

  if (orgData.id) {
    const idx = orgs.findIndex((o) => o.id === orgData.id);
    if (idx === -1) throw new Error('Organization not found.');
    orgs[idx] = { ...orgs[idx], ...orgData };
    setStorageItem(STORAGE_KEYS.ORGANIZATIONS, orgs);
    return orgs[idx];
  } else {
    const newOrg = {
      ...orgData,
      id: `org-${Date.now().toString().slice(-4)}`,
      status: 'active',
    };
    orgs.push(newOrg);
    setStorageItem(STORAGE_KEYS.ORGANIZATIONS, orgs);
    return newOrg;
  }
};

export const apiGetDecorators = async () => {
  return INITIAL_DECORATORS;
};
