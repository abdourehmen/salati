import { Routes, Route } from 'react-router-dom';

// Pages Import
import Home from '../pages/platform/Home';
import Login from '../pages/platform/Login';
import Register from '../pages/platform/Register';
import PublicHall from '../pages/salle/PublicHall';
import DashboardOverview from '../pages/dashboard/Overview';

export default function AppRoutes() {
  return (
    <Routes>
      {/* صفحات المنصة العامة */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* صفحة الصالة المخصصة للزبون */}
      <Route path="/salle/:hallSlug" element={<PublicHall />} />

      {/* لوحة تحكم صاحب الصالة */}
      <Route path="/dashboard" element={<DashboardOverview />} />
    </Routes>
  );
}