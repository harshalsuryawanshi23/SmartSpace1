import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  apiGetCurrentUser,
  apiLogin,
  apiRegister,
  apiLogout,
  apiSwitchDemoRole,
  apiResetDemoData,
  apiGetSpaces,
  apiSearchSpaces,
  apiSaveSpace,
  apiDeleteSpace,
  apiToggleSpaceStatus,
  apiGetBookings,
  apiCreateBooking,
  apiCancelBooking,
  apiVerifyEntry,
  apiGetFacilities,
  apiSaveFacility,
  apiDeleteFacility,
  apiGetSchedules,
  apiBlockSlot,
  apiUnblockSlot,
  apiGetUsers,
  apiToggleUserStatus,
  apiGetOrganizations,
  apiSaveOrganization,
  apiGetDecorators,
} from '../services/api.js';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [users, setUsers] = useState([]);
  const [decorators, setDecorators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Show Toast notification
  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // Fetch all core application state
  const refreshData = useCallback(async () => {
    try {
      const [u, sp, bk, fac, org, sch, usrList, dec] = await Promise.all([
        apiGetCurrentUser(),
        apiGetSpaces(),
        apiGetBookings(),
        apiGetFacilities(),
        apiGetOrganizations(),
        apiGetSchedules(),
        apiGetUsers(),
        apiGetDecorators(),
      ]);
      setCurrentUser(u);
      setSpaces(sp);
      setBookings(bk);
      setFacilities(fac);
      setOrganizations(org);
      setSchedules(sch);
      setUsers(usrList);
      setDecorators(dec);
    } catch (err) {
      console.error('Failed to load initial application state:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Auth actions
  const login = async (email, password) => {
    const user = await apiLogin(email, password);
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`);
    await refreshData();
    return user;
  };

  const register = async (formData) => {
    const user = await apiRegister(formData);
    setCurrentUser(user);
    showToast(`Account created successfully! Welcome, ${user.name}!`);
    await refreshData();
    return user;
  };

  const logout = async () => {
    await apiLogout();
    setCurrentUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const switchDemoRole = async (targetRole) => {
    try {
      const user = await apiSwitchDemoRole(targetRole);
      setCurrentUser(user);
      showToast(`Switched to demo role: ${user.role.toUpperCase()} (${user.name})`, 'info');
      await refreshData();
      return user;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const resetDemoData = async () => {
    try {
      await apiResetDemoData();
      await refreshData();
      showToast('Demo data and mock storage reset to original state!', 'success');
    } catch (err) {
      showToast('Failed to reset demo data.', 'error');
    }
  };

  // Space actions
  const saveSpace = async (spaceData) => {
    try {
      const saved = await apiSaveSpace(spaceData);
      showToast(spaceData.id ? 'Space updated successfully!' : 'New space added successfully!');
      await refreshData();
      return saved;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const deleteSpace = async (spaceId) => {
    try {
      await apiDeleteSpace(spaceId);
      showToast('Space removed successfully.');
      await refreshData();
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const toggleSpaceStatus = async (spaceId) => {
    try {
      const updated = await apiToggleSpaceStatus(spaceId);
      showToast(`Space marked as ${updated.status}.`);
      await refreshData();
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Booking actions
  const createBooking = async (bookingData) => {
    try {
      const newBooking = await apiCreateBooking(bookingData);
      showToast(`Booking confirmed! ID: ${newBooking.id}`);
      await refreshData();
      return newBooking;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const updated = await apiCancelBooking(bookingId);
      showToast(`Booking ${bookingId} has been cancelled.`);
      await refreshData();
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Facilities actions
  const saveFacility = async (facilityData) => {
    try {
      const saved = await apiSaveFacility(facilityData);
      showToast(`Facility "${saved.name}" saved!`);
      await refreshData();
      return saved;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const deleteFacility = async (facilityId) => {
    try {
      await apiDeleteFacility(facilityId);
      showToast('Facility deleted.');
      await refreshData();
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Schedule / Block actions
  const blockSlot = async (slotData) => {
    try {
      const blocked = await apiBlockSlot(slotData);
      showToast('Maintenance slot blocked successfully.');
      await refreshData();
      return blocked;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const unblockSlot = async (scheduleId) => {
    try {
      await apiUnblockSlot(scheduleId);
      showToast('Maintenance block lifted.');
      await refreshData();
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  // Admin User & Organization actions
  const toggleUserStatus = async (userId) => {
    try {
      const updated = await apiToggleUserStatus(userId, currentUser?.id);
      showToast(`User ${updated.name} is now ${updated.status}.`);
      await refreshData();
      return updated;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  const saveOrganization = async (orgData) => {
    try {
      const saved = await apiSaveOrganization(orgData);
      showToast(orgData.id ? 'Organization updated!' : 'New organization added!');
      await refreshData();
      return saved;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        spaces,
        bookings,
        facilities,
        organizations,
        schedules,
        users,
        decorators,
        loading,
        toast,
        showToast,
        closeToast,
        refreshData,
        login,
        register,
        logout,
        switchDemoRole,
        resetDemoData,
        saveSpace,
        deleteSpace,
        toggleSpaceStatus,
        createBooking,
        cancelBooking,
        saveFacility,
        deleteFacility,
        blockSlot,
        unblockSlot,
        toggleUserStatus,
        saveOrganization,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
