import React from 'react';
import { ViewBookings as BaseViewBookings } from '../manager/ViewBookings.jsx';

export const ManageBookings = () => {
  return <BaseViewBookings isAdminView={true} />;
};
