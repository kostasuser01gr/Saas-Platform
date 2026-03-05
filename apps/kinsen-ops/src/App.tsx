import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import Bookings from '@/pages/Bookings';
import Fleet from '@/pages/Fleet';
import Customers from '@/pages/Customers';
import TeamChat from '@/pages/TeamChat';
import Settings from '@/pages/Settings';
import AIAssistant from '@/pages/AIAssistant';
import Washers from '@/pages/Washers';
import Shifts from '@/pages/Shifts';
import Imports from '@/pages/Imports';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<AIAssistant />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="fleet" element={<Fleet />} />
          <Route path="customers" element={<Customers />} />
          <Route path="chat" element={<TeamChat />} />
          <Route path="settings" element={<Settings />} />
          <Route path="washers" element={<Washers />} />
          <Route path="shifts" element={<Shifts />} />
          <Route path="imports" element={<Imports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
