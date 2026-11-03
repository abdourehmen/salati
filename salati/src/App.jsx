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

export default function App() {
  const path = window.location.pathname;

  // إظهار Navbar المنصة في الصفحة الرئيسية وصفحة البحث والتسجيل والدخول
  const isPlatformPage = path === '/' || path === '/login' || path === '/register' || path === '/halls';

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
      default: return <Home />;
    }
  };

  return (
    <div>
      {isPlatformPage && <Navbar />}
      <main>
        {renderPage()}
      </main>
    </div>
  );
}