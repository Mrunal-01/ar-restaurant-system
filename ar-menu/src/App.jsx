// frontend/src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

// customer pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import DishPage from './pages/DishPage';
import ARViewPage from './pages/ARViewPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* ✅ Show customer navbar only on NON-staff routes */}
      {!isStaffRoute && <Navbar />}

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pb-8">
        <Routes>
          {/* customer routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/dish/:id" element={<DishPage />} />
          <Route path="/ar/:id" element={<ARViewPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/success" element={<SuccessPage />} />

          {/* fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
