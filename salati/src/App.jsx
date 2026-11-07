import { useState, useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/platform/Home';
import Register from './pages/platform/Register';
import Login from './pages/platform/Login';
import Dashboard from './pages/dashboard/Dashboard';
import PublicHall from './pages/salle/PublicHall';
import BookingSuccess from './pages/salle/BookingSuccess';
import RateHall from './pages/salle/RateHall';
import AdminDashboard from './admin/AdminDashboard';
import HallsCatalog from './pages/platform/HallsCatalog';
import Terms from './pages/platform/Terms';
import Privacy from './pages/platform/Privacy';

// استدعاء مكون الواتساب العائم
import WhatsAppWidget from './components/WhatsAppWidget';

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // إظهار Navbar والواتساب العائم في صفحات المنصة العامة
  const isPlatformPage = 
    path === '/' || 
    path === '/login' || 
    path === '/register' || 
    path === '/halls' ||
    path === '/terms' ||
    path === '/privacy';

  const renderPage = () => {
    switch (path) {
      case '/register': return <Register />;
      case '/login': return <Login />;
      case '/dashboard': return <Dashboard />;
      case '/admin': return <AdminDashboard />;
      case '/halls': return <HallsCatalog />;
      case '/hall/demo': return <PublicHall />;
      case '/hall/success': return <BookingSuccess />;
      case '/hall/rate': return <RateHall />;
      case '/terms': return <Terms />;
      case '/privacy': return <Privacy />;
      default: return <Home />;
    }
  };

  return (
    <div>
      {isPlatformPage && <Navbar />}
      <main>
        {renderPage()}
      </main>
      
      {/* ظهور زر الواتساب العائم في الصفحات العامة للمنصة */}
      {isPlatformPage && <WhatsAppWidget />}
    </div>
  );
}