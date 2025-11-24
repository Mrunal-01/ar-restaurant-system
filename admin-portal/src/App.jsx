// frontend/src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';


// staff pages
import StaffLoginPage from './pages/staff/StaffLoginPage';
import StaffOrdersPage from './pages/staff/StaffOrdersPage';
import StaffDishesPage from './pages/staff/StaffDishesPage';
import AddDishPage from './pages/staff/AddDishPage';
import EditDishPage from './pages/staff/EditDishPage';

function App() {
  const location = useLocation();

  // ✅ any URL starting with /staff is considered a staff route
  const isStaffRoute = location.pathname.startsWith('/staff');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* ✅ Show customer navbar only on NON-staff routes */}
      {!isStaffRoute && <Navbar />}

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pb-8">
        <Routes>

          {/* staff routes */}
          <Route path="/staff/login" element={<StaffLoginPage />} />
          <Route path="/staff/orders" element={<StaffOrdersPage />} />
          <Route path="/staff/dishes" element={<StaffDishesPage />} />
          <Route path="/staff/dishes/new" element={<AddDishPage />} />
          <Route path="/staff/dishes/edit/:id" element={<EditDishPage />} />

          {/* fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
